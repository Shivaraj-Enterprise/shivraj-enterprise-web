import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import PostCard, { type BlogPostCard } from "@/components/blog/PostCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Newspaper, Search, ChevronLeft, ChevronRight } from "lucide-react";
import AuroraBackground from "@/components/three/AuroraBackground";
import BlurText from "@/components/reactbits/BlurText";

const PAGE_SIZE = 6;

// Static/featured guides that live as their own routes (not in the DB).
// They still appear in the listing so users can discover and filter them.
const STATIC_POSTS: BlogPostCard[] = [
  {
    id: "static-gst-tds-manpower-supply-guide",
    slug: "gst-tds-manpower-supply-guide",
    title: "GST & TDS on Manpower Supply Services in India – A Compliance Guide",
    excerpt:
      "A practical guide to GST (18% Forward Charge, RCM) and TDS Section 194C for manpower outsourcing in India — for procurement, finance and HR managers.",
    cover_image_url: null,
    published_at: "2026-07-03",
    tags: [
      { slug: "compliance", name: "Compliance" },
      { slug: "gst", name: "GST" },
      { slug: "tds", name: "TDS" },
    ],
  },
];

const Blog = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tags, setTags] = useState<{ slug: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const { posts: dbPosts, loading } = useBlogPosts({ tagSlug: activeTag, search: debounced });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("blog_tags").select("slug, name").order("name");
      setTags((data ?? []) as { slug: string; name: string }[]);
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [activeTag, debounced]);

  // Merge static featured posts with DB posts, applying the same search/tag filters.
  const posts = useMemo(() => {
    let statics = STATIC_POSTS;
    if (activeTag) statics = statics.filter((p) => p.tags?.some((t) => t.slug === activeTag));
    if (debounced.trim()) {
      const s = debounced.trim().toLowerCase();
      statics = statics.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          (p.excerpt ?? "").toLowerCase().includes(s)
      );
    }
    const combined = [...statics, ...dbPosts];
    // De-duplicate by slug (DB entry wins if it exists)
    const seen = new Set<string>();
    return combined.filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    }).sort((a, b) => {
      const da = a.published_at ? new Date(a.published_at).getTime() : 0;
      const db = b.published_at ? new Date(b.published_at).getTime() : 0;
      return db - da;
    });
  }, [dbPosts, activeTag, debounced]);

  // Merge static tags into the filter list
  const mergedTags = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    for (const t of tags) map.set(t.slug, t);
    for (const p of STATIC_POSTS) for (const t of p.tags ?? []) if (!map.has(t.slug)) map.set(t.slug, t);
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tags]);

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const paged = useMemo(
    () => posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [posts, page]
  );

  return (
    <Layout>
      <Helmet>
        <title>News & Updates – Shivraj Enterprise Blog</title>
        <meta name="description" content="Latest news, updates and articles from Shivraj Enterprise — manpower, housekeeping and industry insights from Vapi GIDC." />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/#/blog" />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-shivraj-900 via-shivraj-800 to-shivraj-900 text-white py-16">
        <AuroraBackground intensity="bold" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur ring-2 ring-white/20 mb-4">
            <Newspaper size={28} />
          </div>
          <BlurText as="h1" text="News & Updates" className="text-3xl md:text-5xl font-bold mb-3" />
          <p className="text-shivraj-100 max-w-2xl mx-auto">
            Industry insights, company news and daily updates from Shivraj Enterprise.
          </p>
        </div>
      </section>

      <section className="section bg-shivraj-50">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto mb-6 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts by title or excerpt…"
              className="pl-9 bg-white"
              aria-label="Search posts"
            />
          </div>

          {mergedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  activeTag === null ? "bg-shivraj-600 text-white border-shivraj-600" : "bg-white text-shivraj-700 border-shivraj-200"
                }`}
              >
                All
              </button>
              {mergedTags.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setActiveTag(t.slug)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    activeTag === t.slug ? "bg-shivraj-600 text-white border-shivraj-600" : "bg-white text-shivraj-700 border-shivraj-200"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              {debounced || activeTag ? "No posts match your filters." : "No posts yet. Check back soon."}
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, posts.length)} of {posts.length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((p) => <PostCard key={p.id} post={p} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} /> Prev
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;

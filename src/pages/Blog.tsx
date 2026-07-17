import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import PostCard, { type BlogPostCard } from "@/components/blog/PostCard";
import NewsletterCard from "@/components/blog/NewsletterCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import AuroraBackground from "@/components/three/AuroraBackground";
import BlurText from "@/components/reactbits/BlurText";
import FadeContent from "@/components/reactbits/FadeContent";
import blogHeroVideo from "@/assets/blog-hero.mp4.asset.json";

import { STATIC_POSTS } from "@/data/staticPosts";

const PAGE_SIZE = 6;

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

  const posts = useMemo(() => {
    let statics = STATIC_POSTS;
    if (activeTag) statics = statics.filter((p) => p.tags?.some((t) => t.slug === activeTag));
    if (debounced.trim()) {
      const s = debounced.trim().toLowerCase();
      statics = statics.filter(
        (p) => p.title.toLowerCase().includes(s) || (p.excerpt ?? "").toLowerCase().includes(s)
      );
    }
    const combined = [...statics, ...dbPosts];
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

  const mergedTags = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    for (const t of tags) map.set(t.slug, t);
    for (const p of STATIC_POSTS) for (const t of p.tags ?? []) if (!map.has(t.slug)) map.set(t.slug, t);
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tags]);

  const featured = !activeTag && !debounced ? posts[0] : null;
  const listPosts = featured ? posts.slice(1) : posts;

  const totalPages = Math.max(1, Math.ceil(listPosts.length / PAGE_SIZE));
  const paged = useMemo(
    () => listPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [listPosts, page]
  );

  return (
    <Layout>
      <Helmet>
        <title>Insights & Updates – Shivraj Enterprise Blog</title>
        <meta name="description" content="Manpower, compliance and industry insights for Vapi GIDC and beyond — practical guides from Shivraj Enterprise." />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/#/blog" />
        <meta property="og:title" content="Insights & Updates – Shivraj Enterprise Blog" />
        <meta property="og:description" content="Manpower, compliance and industry insights for Vapi GIDC and beyond." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-shivraj-900 via-shivraj-800 to-shivraj-900 text-white pt-20 pb-28">
        <AuroraBackground intensity="bold" />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden
        />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 text-xs font-medium tracking-wide uppercase mb-6">
            <Sparkles size={14} /> Insights & Updates
          </div>
          <BlurText as="h1" text="Ideas that power modern workforces" className="text-4xl md:text-6xl font-bold mb-5 leading-[1.1]" />
          <p className="text-shivraj-100 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Guides, playbooks and industry insights on manpower supply, compliance and operations — written for leaders building teams in Vapi GIDC and across India.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-shivraj-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, topics, tags…"
              className="pl-11 h-12 rounded-full bg-white text-shivraj-900 border-0 shadow-xl placeholder:text-shivraj-400"
              aria-label="Search posts"
            />
          </div>
        </div>
        <div className="absolute -bottom-px left-0 right-0 h-24 bg-gradient-to-b from-transparent to-shivraj-50" aria-hidden />
      </section>

      {/* Filters + content */}
      <section className="bg-shivraj-50/60 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">

          {mergedTags.length > 0 && (
            <FadeContent>
              <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 -mx-1 px-1 md:justify-center md:flex-wrap">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeTag === null
                      ? "bg-shivraj-800 text-white border-shivraj-800 shadow-md"
                      : "bg-white text-shivraj-700 border-shivraj-100 hover:border-shivraj-300 hover:-translate-y-0.5"
                  }`}
                >
                  All posts
                </button>
                {mergedTags.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => setActiveTag(t.slug)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      activeTag === t.slug
                        ? "bg-shivraj-800 text-white border-shivraj-800 shadow-md"
                        : "bg-white text-shivraj-700 border-shivraj-100 hover:border-shivraj-300 hover:-translate-y-0.5"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </FadeContent>
          )}

          {loading && posts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl border border-shivraj-100 overflow-hidden">
                  <div className="aspect-[16/10] bg-shivraj-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-shivraj-100 rounded w-1/3" />
                    <div className="h-5 bg-shivraj-100 rounded w-4/5" />
                    <div className="h-4 bg-shivraj-100 rounded w-full" />
                    <div className="h-4 bg-shivraj-100 rounded w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-shivraj-100">
              <p className="text-lg text-shivraj-800 font-medium mb-2">No posts match your filters</p>
              <p className="text-muted-foreground">Try clearing search or switching category.</p>
            </div>
          ) : (
            <>
              {featured && (
                <FadeContent>
                  <div className="mb-12">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-4">
                      <TrendingUp size={14} /> Featured
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      <PostCard post={featured} featured />
                    </div>
                  </div>
                </FadeContent>
              )}

              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800">Latest articles</h2>
                <p className="text-sm text-muted-foreground">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, listPosts.length)} of {listPosts.length}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paged.map((p, i) => (
                  <FadeContent key={p.id} delay={i * 0.05}>
                    <PostCard post={p} />
                  </FadeContent>
                ))}
              </div>

              {/* Newsletter row */}
              <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <div className="md:col-span-2 bg-white rounded-2xl border border-shivraj-100 p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-shivraj-800 mb-2">Have a workforce challenge?</h3>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    Our team helps plants across Vapi GIDC scale manpower, stay compliant and reduce hiring overhead. Talk to us for a tailored proposal.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="/#/contact" className="inline-flex items-center px-5 py-2.5 rounded-full bg-shivraj-700 text-white font-medium hover:bg-shivraj-800 transition shadow hover:shadow-lg hover:-translate-y-0.5">
                      Talk to sales
                    </a>
                    <a href="/#/services" className="inline-flex items-center px-5 py-2.5 rounded-full bg-white text-shivraj-700 font-medium border border-shivraj-200 hover:border-shivraj-400 transition">
                      Explore services
                    </a>
                  </div>
                </div>
                <NewsletterCard />
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft size={16} /> Prev
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
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

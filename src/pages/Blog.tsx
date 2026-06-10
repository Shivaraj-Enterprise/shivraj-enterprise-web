import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import PostCard from "@/components/blog/PostCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Newspaper, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 6;

const Blog = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tags, setTags] = useState<{ slug: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const { posts, loading } = useBlogPosts({ tagSlug: activeTag, search: debounced });

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

      <section className="bg-gradient-to-br from-shivraj-800 to-shivraj-900 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
            <Newspaper size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">News & Updates</h1>
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

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  activeTag === null ? "bg-shivraj-600 text-white border-shivraj-600" : "bg-white text-shivraj-700 border-shivraj-200"
                }`}
              >
                All
              </button>
              {tags.map((t) => (
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

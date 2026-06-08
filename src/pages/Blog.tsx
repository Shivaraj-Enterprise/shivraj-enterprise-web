import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import PostCard from "@/components/blog/PostCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper } from "lucide-react";

const Blog = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tags, setTags] = useState<{ slug: string; name: string }[]>([]);
  const { posts, loading } = useBlogPosts({ tagSlug: activeTag });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("blog_tags").select("slug, name").order("name");
      setTags((data ?? []) as { slug: string; name: string }[]);
    })();
  }, []);

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
            <p className="text-center text-muted-foreground py-16">No posts yet. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PostCard, { type BlogPostCard } from "./PostCard";
import { STATIC_POSTS } from "@/data/staticPosts";

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  blog_post_tags: { blog_tags: { slug: string; name: string } | null }[] | null;
};

type Props = {
  currentSlug: string;
  currentTagSlugs?: string[];
  limit?: number;
};

const RelatedPosts = ({ currentSlug, currentTagSlugs = [], limit = 3 }: Props) => {
  const [dbPosts, setDbPosts] = useState<BlogPostCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, published_at, blog_post_tags(blog_tags(slug, name))")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(20);
      if (cancelled) return;
      const rows = ((data ?? []) as unknown as Row[]).map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        cover_image_url: r.cover_image_url,
        published_at: r.published_at,
        tags: (r.blog_post_tags ?? []).map((pt) => pt.blog_tags).filter(Boolean) as { slug: string; name: string }[],
      }));
      setDbPosts(rows);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const related = useMemo(() => {
    const all: BlogPostCard[] = [...STATIC_POSTS, ...dbPosts];
    const seen = new Set<string>();
    const deduped = all.filter((p) => {
      if (p.slug === currentSlug) return false;
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
    // Score by shared tag count, then recency
    const scored = deduped.map((p) => {
      const shared = (p.tags ?? []).filter((t) => currentTagSlugs.includes(t.slug)).length;
      const time = p.published_at ? new Date(p.published_at).getTime() : 0;
      return { p, shared, time };
    });
    scored.sort((a, b) => b.shared - a.shared || b.time - a.time);
    return scored.slice(0, limit).map((s) => s.p);
  }, [dbPosts, currentSlug, currentTagSlugs, limit]);

  if (loading && related.length === 0) return null;
  if (related.length === 0) return null;

  return (
    <section className="border-t border-shivraj-100 bg-shivraj-50/50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-6">Related articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;

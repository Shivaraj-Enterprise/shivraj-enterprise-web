import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPostCard } from "@/components/blog/PostCard";

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  blog_post_tags: { blog_tags: { slug: string; name: string } | null }[] | null;
};

export const useBlogPosts = (opts: { limit?: number; tagSlug?: string | null; search?: string } = {}) => {
  const { limit, tagSlug, search } = opts;
  const [posts, setPosts] = useState<BlogPostCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q = supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image_url, published_at, blog_post_tags(blog_tags(slug, name))")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      if (limit) q = q.limit(limit);
      const { data } = await q;
      if (cancelled) return;
      let rows = ((data ?? []) as unknown as Row[]).map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        cover_image_url: r.cover_image_url,
        published_at: r.published_at,
        tags: (r.blog_post_tags ?? []).map((pt) => pt.blog_tags).filter(Boolean) as { slug: string; name: string }[],
      }));
      if (tagSlug) rows = rows.filter((p) => p.tags?.some((t) => t.slug === tagSlug));
      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        rows = rows.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            (p.excerpt ?? "").toLowerCase().includes(s)
        );
      }
      setPosts(rows);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [limit, tagSlug, search]);

  return { posts, loading };
};

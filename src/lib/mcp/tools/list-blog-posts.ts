import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { STATIC_GUIDES } from "../static-posts";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List ALL published blog posts and compliance guides from Shivraj Enterprise (title, slug, excerpt, published date, cover image, canonical URL) — includes both the latest dynamic articles and the long-form static guides.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum posts to return (1-50, default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, published_at, cover_image_url")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(limit ?? 20);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const dbPosts = (data ?? []).map((p) => ({
      ...p,
      url: `https://shivraj-enterprise.lovable.app/blog/${p.slug}`,
      source: "article",
    }));
    const guides = STATIC_GUIDES.map((g) => ({
      id: `static-${g.slug}`,
      title: g.title,
      slug: g.slug,
      excerpt: g.excerpt,
      published_at: g.published_at,
      cover_image_url: null,
      url: g.url,
      source: "guide",
    }));
    const all = [...dbPosts, ...guides]
      .sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)))
      .slice(0, limit ?? 20);
    return {
      content: [{ type: "text", text: JSON.stringify(all) }],
      structuredContent: { posts: all },
    };
  },
});

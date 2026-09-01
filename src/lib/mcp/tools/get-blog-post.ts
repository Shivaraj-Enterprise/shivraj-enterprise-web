import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { STATIC_GUIDES } from "../static-posts";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description:
    "Get a single published blog post from Shivraj Enterprise by its slug, including full content. Works for both dynamic articles (full content returned) and long-form static guides (metadata and canonical URL returned).",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Blog post slug, e.g. 'gst-tds-manpower-supply-guide'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, published_at, cover_image_url")
      .eq("published", true)
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (data) {
      return {
        content: [{ type: "text", text: JSON.stringify(data) }],
        structuredContent: { post: data },
      };
    }
    const guide = STATIC_GUIDES.find((g) => g.slug === slug);
    if (guide) {
      const post = {
        id: `static-${guide.slug}`,
        title: guide.title,
        slug: guide.slug,
        excerpt: guide.excerpt,
        published_at: guide.published_at,
        cover_image_url: null,
        url: guide.url,
        tags: guide.tags,
        note: "This is a long-form static guide. Read the full article at the url.",
      };
      return {
        content: [{ type: "text", text: JSON.stringify(post) }],
        structuredContent: { post },
      };
    }
    return { content: [{ type: "text", text: `No published post found for slug '${slug}'.` }], isError: true };
  },
});

import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List published blog posts from Shivraj Enterprise (title, slug, excerpt, published date, cover image).",
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
      process.env.SUPABASE_PUBLISHABLE_KEY!,
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
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});

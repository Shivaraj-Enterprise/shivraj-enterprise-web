import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";

declare const process: { env: Record<string, string | undefined> };

export default defineTool({
  name: "get_rate_card",
  title: "Get manpower rate card",
  description:
    "Get the public rate card for Shivraj Enterprise manpower supply services (service, 8-hour and 12-hour rates and units).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await supabase
      .from("rate_card_items")
      .select("service, rate8, unit8, rate12, unit12, sort_order")
      .order("sort_order", { ascending: true });
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { items: data ?? [] },
    };
  },
});

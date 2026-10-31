# Project Architecture Rules

- Keep calculator motion and elevation styles scoped under `.calculator-page` so they cannot affect other pages; this preserves the site's existing visual behavior.
- Use the `@react-bits` shadcn registry for React Bits components; `.agents/mcp_config.json` configures its local shadcn MCP client without changing the website's own MCP server.
- Keep Kokonut UI registry components compatible with Tailwind v3 and the existing Framer Motion package; homepage activity rings visualize established company milestones while their text values remain static for search engines.
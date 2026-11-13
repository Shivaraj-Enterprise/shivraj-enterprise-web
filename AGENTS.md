# Project Architecture Rules
- Monthly reports aggregate contact enquiries, job applications, and source-labelled leads using Indian calendar-month boundaries; keep exports paginated and spreadsheet-safe, and CV links signed so owner reports are complete without exposing private files.

- Keep calculator motion and elevation styles scoped under `.calculator-page` so they cannot affect other pages; this preserves the site's existing visual behavior.
- Use the `@react-bits` shadcn registry for React Bits components; `.agents/mcp_config.json` configures its local shadcn MCP client without changing the website's own MCP server.
- Keep Kokonut UI registry components compatible with Tailwind v3 and the existing Framer Motion package; homepage activity rings visualize established company milestones while their text values remain static for search engines.
- Use the `@magicui` shadcn registry for Magic UI components; `.agents/mcp_config.json` also configures the local `@magicuidesign/mcp` client without changing the website's own MCP server.- Shared Motion wrappers live in `src/components/motion/` and respect reduced motion; reuse them instead of per-page animation code so effects stay consistent.
- Article pages own their reading-progress bar instead of stacking it with the global bar; shared heading reveals keep headings visible before animation for indexing and accessibility.
- Adapt OriginKit motion to the existing Tailwind v3 stack with semantic tokens; expose it through shared motion exports and scope homepage effects under `.homepage-motion` to preserve other pages and static company figures.
- Weekly blog topics come only from a fresh last-7-days news search each run (no fixed topic lists), with every candidate logged in `blog_topic_history` and a weekly lock in `blog_generator_state`, so topics stay current and never repeat.
- Clear a weekly AI pause only after successful article publication and check the state update result; this restores cron after manual recovery without blindly retrying credit or permission failures.

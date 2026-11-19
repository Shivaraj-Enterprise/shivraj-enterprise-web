const SITE = "https://shivraj-enterprise.lovable.app/";
export async function localSearchInsights() {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  const connectionKey = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!apiKey || !connectionKey) throw new Error("Google Search Console is not connected");
  const headers = { Authorization: `Bearer ${apiKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json" };
  const base = "https://connector-gateway.lovable.dev/google_search_console/webmasters/v3/sites";
  const sitesResponse = await fetch(base, { headers });
  if (!sitesResponse.ok) throw new Error(`Search Console ${sitesResponse.status}: ${await sitesResponse.text()}`);
  const sites = (await sitesResponse.json()).siteEntry ?? [];
  const site = sites.find((s: { siteUrl: string; permissionLevel: string }) => s.siteUrl === SITE && s.permissionLevel !== "siteUnverifiedUser")
    ?? sites.find((s: { siteUrl: string; permissionLevel: string }) => s.siteUrl === "sc-domain:shivraj-enterprise.lovable.app" && s.permissionLevel !== "siteUnverifiedUser");
  if (!site) throw new Error("No verified Search Console property for this website");
  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - 27 * 86400000);
  const startDate = start.toISOString().slice(0, 10), endDate = end.toISOString().slice(0, 10);
  const response = await fetch(`${base}/${encodeURIComponent(site.siteUrl)}/searchAnalytics/query`, {
    method: "POST", headers,
    body: JSON.stringify({ startDate, endDate, dimensions: ["query"], rowLimit: 1000, dataState: "final" }),
  });
  if (!response.ok) throw new Error(`Search Console ${response.status}: ${await response.text()}`);
  const rows = ((await response.json()).rows ?? []) as { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[];
  const queries = rows.filter((r) => /manpower|labou?r|staffing|contractor|industrial|factory|housekeeping|epf|esic|gst|wage/i.test(r.keys[0] ?? "") && !/home cleaning|house cleaning|cleaning services near me|clean up company|\bjobs?\b|vacanc/i.test(r.keys[0] ?? ""))
    .map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }))
    .sort((a, b) => b.impressions - a.impressions).slice(0, 20);
  return { startDate, endDate, queries };
}
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Every Monday: pull last 7 days of Google Search Console + Business Profile data,
// find opportunities, store a snapshot, and email the owner a briefing.
const SITE = "https://shivraj-enterprise.lovable.app/";
const RECIPIENT = "shivrajenterprise1234@gmail.com";
const FROM = "Shivraj Growth <onboarding@resend.dev>";
const GSC = "https://connector-gateway.lovable.dev/google_search_console";
const GBP = "https://connector-gateway.lovable.dev/google_business_profile";
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { "Content-Type": "application/json" } });
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
const day = (d: Date) => d.toISOString().slice(0, 10);

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

Deno.serve(async (req) => {
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: expected } = await db.rpc("get_monthly_report_secret");
  const provided = req.headers.get("x-report-secret");
  if (!expected || provided !== expected) return json({ error: "Unauthorized" }, 401);

  const now = new Date();
  const end = new Date(now.getTime() - 2 * 864e5); // GSC data lags ~2 days
  const start = new Date(end.getTime() - 6 * 864e5);
  const week = day(now);
  const { data: existing } = await db.from("growth_reports").select("email_sent").eq("week", week).maybeSingle();
  if (existing?.email_sent) return json({ skipped: "already sent this week" });

  const lovKey = Deno.env.get("LOVABLE_API_KEY") ?? "";
  const metrics: Record<string, unknown> = { from: day(start), to: day(end) };
  const errors: string[] = [];
  let queries: Row[] = [], pages: Row[] = [];

  try {
    const h = { Authorization: `Bearer ${lovKey}`, "X-Connection-Api-Key": Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY") ?? "", "Content-Type": "application/json" };
    const sres = await fetch(`${GSC}/webmasters/v3/sites`, { headers: h });
    if (!sres.ok) throw new Error(`sites ${sres.status}`);
    const sites = ((await sres.json()).siteEntry ?? []).filter((s: any) => s.permissionLevel !== "siteUnverifiedUser");
    const host = new URL(SITE).hostname;
    const site = sites.find((s: any) => s.siteUrl === SITE) ?? sites.find((s: any) => s.siteUrl.startsWith("sc-domain:") ? host.endsWith(s.siteUrl.slice(10)) : SITE.startsWith(s.siteUrl));
    if (!site) throw new Error("no verified property");
    const q = async (dimension: string) => {
      const r = await fetch(`${GSC}/webmasters/v3/sites/${encodeURIComponent(site.siteUrl)}/searchAnalytics/query`, {
        method: "POST", headers: h, body: JSON.stringify({ startDate: day(start), endDate: day(end), dimensions: [dimension], rowLimit: 250 }),
      });
      if (!r.ok) throw new Error(`query ${r.status}`);
      return ((await r.json()).rows ?? []) as Row[];
    };
    [queries, pages] = await Promise.all([q("query"), q("page")]);
    const clicks = queries.reduce((a, r) => a + r.clicks, 0);
    const impressions = pages.reduce((a, r) => a + r.impressions, 0);
    Object.assign(metrics, { clicks: pages.reduce((a, r) => a + r.clicks, 0), impressions, queryClicks: clicks });
  } catch (e) { errors.push(`Search Console: ${(e as Error).message}`); }

  try {
    const { data: s } = await db.from("google_business_settings").select("location_name").limit(1).maybeSingle();
    if (s?.location_name) {
      const loc = s.location_name.replace(/^accounts\/[^/]+\//, "");
      const p = new URLSearchParams();
      for (const m of ["CALL_CLICKS", "WEBSITE_CLICKS", "BUSINESS_DIRECTION_REQUESTS", "BUSINESS_IMPRESSIONS_MOBILE_MAPS", "BUSINESS_IMPRESSIONS_MOBILE_SEARCH", "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH", "BUSINESS_IMPRESSIONS_DESKTOP_MAPS"]) p.append("dailyMetrics", m);
      const [y1, m1, d1] = day(start).split("-"), [y2, m2, d2] = day(end).split("-");
      p.set("dailyRange.startDate.year", y1); p.set("dailyRange.startDate.month", String(+m1)); p.set("dailyRange.startDate.day", String(+d1));
      p.set("dailyRange.endDate.year", y2); p.set("dailyRange.endDate.month", String(+m2)); p.set("dailyRange.endDate.day", String(+d2));
      const r = await fetch(`${GBP}/performance/v1/${loc}:fetchMultiDailyMetricsTimeSeries?${p}`, { headers: { Authorization: `Bearer ${lovKey}`, "X-Connection-Api-Key": Deno.env.get("GOOGLE_BUSINESS_PROFILE_API_KEY") ?? "" } });
      if (!r.ok) throw new Error(`performance ${r.status}`);
      const body = await r.json();
      const totals: Record<string, number> = {};
      for (const group of body.multiDailyMetricTimeSeries ?? []) for (const ts of group.dailyMetricTimeSeries ?? []) {
        totals[ts.dailyMetric] = (ts.timeSeries?.datedValues ?? []).reduce((a: number, v: any) => a + Number(v.value ?? 0), 0);
      }
      metrics.googleBusiness = totals;
    }
  } catch (e) { errors.push(`Google Business: ${(e as Error).message}`); }

  // Opportunities: page-2 queries with real impressions, and pages with low CTR.
  const nearWins = queries.filter(r => r.position >= 8 && r.position <= 20 && r.impressions >= 5)
    .sort((a, b) => b.impressions - a.impressions).slice(0, 10)
    .map(r => ({ type: "near_page_one", query: r.keys[0], impressions: r.impressions, position: +r.position.toFixed(1), action: "Add a dedicated section/FAQ and internal link targeting this search" }));
  const lowCtr = pages.filter(r => r.impressions >= 30 && r.ctr < 0.02 && r.position <= 10)
    .sort((a, b) => b.impressions - a.impressions).slice(0, 5)
    .map(r => ({ type: "low_ctr_page", page: r.keys[0], impressions: r.impressions, ctr: +(r.ctr * 100).toFixed(2), action: "Rewrite title and description to be more click-worthy" }));
  const topQueries = [...queries].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 10);
  const opportunities = [...nearWins, ...lowCtr];
  metrics.topQueries = topQueries.map(r => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: +r.position.toFixed(1) }));
  metrics.topPages = [...pages].sort((a, b) => b.clicks - a.clicks).slice(0, 5).map(r => ({ page: r.keys[0], clicks: r.clicks, impressions: r.impressions }));

  await db.from("growth_reports").upsert({ week, metrics, opportunities, error_message: errors.join("; ") || null }, { onConflict: "week" });

  const gb = (metrics.googleBusiness ?? {}) as Record<string, number>;
  const rows = (items: any[], cols: string[]) => items.map(i => `<tr>${cols.map(c => `<td style="padding:4px 8px;border-bottom:1px solid #eee">${esc(i[c])}</td>`).join("")}</tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#0f172a">
<h2 style="color:#1e3a8a">Monday Growth Briefing (${esc(metrics.from)} to ${esc(metrics.to)})</h2>
<p><b>Google Search:</b> ${esc(metrics.clicks ?? "n/a")} clicks, ${esc(metrics.impressions ?? "n/a")} impressions.</p>
<p><b>Google Business:</b> ${esc(gb.CALL_CLICKS ?? "n/a")} call clicks, ${esc(gb.WEBSITE_CLICKS ?? "n/a")} website clicks, ${esc(gb.BUSINESS_DIRECTION_REQUESTS ?? "n/a")} direction requests.</p>
<h3>Top searches</h3><table>${rows(metrics.topQueries as any[], ["query", "clicks", "impressions", "position"])}</table>
<h3>Almost on page 1 (quick wins)</h3><table>${rows(nearWins, ["query", "impressions", "position"])}</table>
<h3>Pages seen but rarely clicked</h3><table>${rows(lowCtr, ["page", "impressions", "ctr"])}</table>
<p>This week's automatic blog article will use these searches as topic fuel.</p>
${errors.length ? `<p style="color:#b91c1c">Data issues: ${esc(errors.join("; "))}</p>` : ""}</div>`;

  let emailSent = false;
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (resendKey) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `growth-${week}` },
      body: JSON.stringify({ from: FROM, to: [RECIPIENT], subject: `Monday Growth Briefing - ${week}`, html }),
    });
    emailSent = r.ok;
    if (!r.ok) console.error("resend", r.status, await r.text());
  }
  await db.from("growth_reports").update({ email_sent: emailSent }).eq("week", week);
  return json({ success: true, week, emailSent, opportunities: opportunities.length, errors });
});

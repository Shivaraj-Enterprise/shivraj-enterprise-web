// Weekly trending-topic discovery: three separate AI steps over live web/news data.
import { isDuplicate, normalize, preferredScope, type Scope } from "./topics.ts";

export type Topic = { keyword: string; angle: string; category: string; tags: string[]; scope: Scope; kind: string; sources: { title: string; url: string; date?: string }[]; reason?: string };
type NewsItem = { title: string; url: string; date: string; source: string };

const QUERIES: Record<Scope | "upcoming", string[]> = {
  local: ["Vapi GIDC industry", "Valsad factory workers", "Gujarat labour department", "Silvassa Daman industrial"],
  india: ["minimum wages notification India", "Labour Codes implementation", "EPFO ESIC new rule", "contract labour India", "manpower staffing India hiring", "factory safety India"],
  global: ["global workforce staffing trends", "factory worker safety heatwave", "manufacturing labour shortage", "automation factory jobs"],
  upcoming: ["minimum wage revision April October India", "labour code effective date", "EPFO deadline employers", "festive season hiring manufacturing"],
};

function decode(s: string) {
  return s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

/** Google News RSS limited to the last 7 days. No API key needed. */
export async function searchNews(q: string, max = 6): Promise<NewsItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q + " when:7d")}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 ShivrajBlogBot" } });
    if (!r.ok) return [];
    const xml = await r.text();
    const cutoff = Date.now() - 7 * 86400000;
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
      const b = m[1];
      const g = (t: string) => decode(b.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`))?.[1] ?? "");
      return { title: g("title"), url: g("link"), date: g("pubDate"), source: g("source") };
    }).filter((i) => i.title && (!i.date || Date.parse(i.date) >= cutoff)).slice(0, max);
  } catch { return []; }
}

export class GatewayStop extends Error { constructor(public status: number, msg: string) { super(msg); } }

async function ai(apiKey: string, system: string, user: string): Promise<any> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_object" },
    }),
  });
  if (resp.status === 402 || resp.status === 403 || resp.status === 429) throw new GatewayStop(resp.status, await resp.text());
  if (!resp.ok) throw new Error(`AI gateway ${resp.status}: ${await resp.text()}`);
  const j = await resp.json();
  return JSON.parse(j.choices?.[0]?.message?.content ?? "{}");
}

const COMPANY = "Shivraj Enterprise: a manpower supply, labour contractor, industrial housekeeping and security company in Vapi GIDC, Gujarat (since 2016). Buyers: factory owners, HR, plant heads, purchase teams at chemical, pharma and engineering units. Never job-seeker topics, never home or residential cleaning.";

/** Helper 1: trend finder. */
export async function findTrends(apiKey: string, today: string): Promise<Topic[]> {
  const all: Record<string, NewsItem[]> = {};
  for (const [scope, qs] of Object.entries(QUERIES)) {
    all[scope] = (await Promise.all(qs.map((q) => searchNews(q, 5)))).flat();
  }
  const out = await ai(apiKey,
    `You are a trend researcher for a B2B blog. ${COMPANY} Use ONLY the news items provided as facts. Never invent dates, amounts or rules.`,
    `Today is ${today}. Below are news headlines from the LAST 7 DAYS grouped by reach (local, india, global, upcoming).
${JSON.stringify(all)}

Produce 8-10 article topic ideas that fit the company. Mix: trending (news this week), upcoming (announced future dates/changes — publish early), wider (a trending subject outside usual topics that still ties to workforce/factories). If headlines are weak, add evergreen buyer questions people search often.
Return JSON {"topics":[{"keyword": search phrase a buyer would type (3-7 words), "angle": 1-2 sentences, "category": one of "Compliance","Manpower Supply","Housekeeping","Security","Workforce Trends","Safety", "tags": 3 short tags, "scope":"local"|"india"|"global", "kind":"trending"|"upcoming"|"wider"|"evergreen", "sources":[{"title","url","date"}] copied from the headlines (empty only for evergreen)}]}`);
  return Array.isArray(out.topics) ? out.topics.filter((t: Topic) => t?.keyword && t?.angle) : [];
}

/** Helper 2: topic picker. Removes duplicates, checks search interest, picks one. */
export async function pickBest(apiKey: string, candidates: Topic[], existingTitles: string[], usedScopes: Scope[]): Promise<{ chosen: Topic | null; all: (Topic & { score?: number; rejected?: string })[] }> {
  const all: (Topic & { score?: number; rejected?: string })[] = candidates.map((c) => isDuplicate(c.keyword, existingTitles) ? { ...c, rejected: "too similar to an existing article" } : { ...c });
  const fresh = all.filter((c) => !c.rejected);
  if (!fresh.length) return { chosen: null, all };
  // Second search pass: how much fresh coverage each topic has right now.
  const coverage = await Promise.all(fresh.map(async (c) => ({ keyword: c.keyword, recent_articles: (await searchNews(c.keyword, 10)).length })));
  const want = preferredScope(usedScopes);
  const out = await ai(apiKey,
    `You are an SEO strategist. ${COMPANY} Pick topics likely to bring Google visitors who could become buyer enquiries.`,
    `Candidates: ${JSON.stringify(fresh.map((c, i) => ({ i, keyword: c.keyword, angle: c.angle, scope: c.scope, kind: c.kind })))}
Recent news volume per keyword (last 7 days, signal of trending interest): ${JSON.stringify(coverage)}
This month we still need a "${want}" article; prefer that reach if quality is similar. Score each 0-100 for search demand, buyer intent, how winnable it is for a small site, and freshness.
Return JSON {"scores":[{"i":number,"score":number}],"best":number,"reason":"one sentence"}`);
  for (const s of out.scores ?? []) if (fresh[s.i]) (fresh[s.i] as any).score = s.score;
  const best = fresh[out.best] ?? fresh[0];
  best.reason = out.reason ?? "highest score";
  return { chosen: best, all };
}

export { normalize };

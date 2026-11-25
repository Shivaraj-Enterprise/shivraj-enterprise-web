import { freshSources, type NewsSource } from "./news-rules.ts";
export type { NewsSource } from "./news-rules.ts";

const decode = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

/** Free fallback and a cheap coverage check, always applying the same freshness rules. */
export async function googleNewsSearch(query: string, max = 5, now = new Date()): Promise<NewsSource[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query + " when:7d")}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const response = await fetch(url, { headers: { "User-Agent": "ShivrajBlogBot/1.0" } });
    if (!response.ok) return [];
    const xml = await response.text();
    const rows = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
      const get = (tag: string) => decode(match[1].match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "");
      return { title: get("title"), url: get("link"), date: get("pubDate") };
    });
    return freshSources(rows, "google-news", now, max);
  } catch { return []; }
}

/** One session per scheduled run; no crawl jobs, retries, or persistent process cache. */
export function createNewsResearch(now = new Date()) {
  const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
  const connectionKey = Deno.env.get("FIRECRAWL_API_KEY");
  const cache = new Map<string, Promise<NewsSource[]>>();
  const collected = new Map<string, NewsSource>();
  const warnings: string[] = [];
  let calls = 0, creditsUsed = 0, paidUnavailable = false;
  const search = (query: string, max = 5): Promise<NewsSource[]> => {
    const cleaned = query.trim().slice(0, 300);
    if (!cleaned) return Promise.resolve([]);
    const key = cleaned.toLowerCase();
    const cached = cache.get(key);
    if (cached) return cached.then(rows => rows.slice(0, max));
    const run = async () => {
      let sources: NewsSource[] = [];
      if (gatewayKey && connectionKey && !paidUnavailable && calls < 4) {
        calls++;
        try {
          const response = await fetch("https://connector-gateway.lovable.dev/firecrawl/v2/search", {
            method: "POST",
            headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json" },
            body: JSON.stringify({ query: cleaned, sources: ["news"], country: "IN", tbs: "qdr:w", limit: 5, scrapeOptions: { formats: ["markdown"] } }),
          });
          if (!response.ok) {
            const details = await response.text();
            paidUnavailable = true;
            console.error(`Firecrawl [${response.status}]: ${details}`);
            warnings.push(`Firecrawl [${response.status}]: ${details.slice(0, 500)}; using free Google News`);
          } else {
            const result = await response.json();
            if (result.success === false) throw new Error(String(result.error ?? "Search failed"));
            creditsUsed += Number(result.creditsUsed) || 0;
            sources = freshSources(Array.isArray(result.data?.news) ? result.data.news : [], "firecrawl", now, 5);
          }
        } catch (error) {
          paidUnavailable = true;
          warnings.push(`Firecrawl: ${error instanceof Error ? error.message : String(error)}; using free Google News`);
        }
      }
      if (!sources.length) sources = await googleNewsSearch(cleaned, 5, now);
      for (const source of sources) collected.set(source.url, source);
      return sources;
    };
    const promise = run();
    cache.set(key, promise);
    return promise.then(rows => rows.slice(0, max));
  };
  return {
    search,
    snapshot: () => ({ from: new Date(now.getTime() - 7 * 86400000).toISOString(), to: now.toISOString(), sources: [...collected.values()], warnings: [...warnings], firecrawlCalls: calls, firecrawlCreditsUsed: creditsUsed }),
  };
}

export type NewsResearch = ReturnType<typeof createNewsResearch>;

export async function researchBuyerNews(research: NewsResearch, buyerQueries: string[] = []) {
  const strongest = buyerQueries.find(q => /manpower|labou?r|staffing|factory|industrial|housekeeping|security|compliance|epf|esic|wage/i.test(q) && !/\bjobs?\b|vacanc|salary|login/i.test(q));
  await Promise.all([
    research.search("Gujarat Vapi GIDC manufacturing labour industry", 5),
    research.search(strongest ? `${strongest} India industry` : "India industrial employers labour EPFO ESIC compliance", 5),
  ]);
  return research.snapshot();
}
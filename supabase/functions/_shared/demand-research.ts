import { googleNewsSearch } from "./news-research.ts";
import { freshSources, type NewsSource } from "./news-rules.ts";

// Fixed search scope, not a fixed list of trends: every run needs new dated evidence.
const QUERIES = [
  "Vapi Sarigam Umbergaon chemical pharmaceutical factory expansion new plant manufacturing",
  "Daman Silvassa plastics engineering manufacturing plant expansion industrial investment",
  "Vapi Sarigam Umbergaon Daman Silvassa GIDC industrial tender factory labour manpower",
];
const LOCAL = /\b(vapi|sarigam|umbergaon|umargam|daman|silvassa)\b/i;
const INDUSTRY = /\b(factory|factories|plant|manufactur\w*|industrial|gidc|chemical|pharma\w*|plastic\w*|engineering)\b/i;
const SIGNAL = /\b(expan\w*|new|invest\w*|tender\w*|commission\w*|opening|capacity|labou?r|manpower|workforce)\b/i;
const DIRECTORY = /\b(upcoming projects|industry projects|factories in|page \d+ of|approved & planned)\b/i;
const STOCK = /\b(stock\w*|share price|target rs|posts .?buy|brokerage)\b/i;

export function localDemandSources(sources: NewsSource[]): NewsSource[] {
  const unique = new Map<string, NewsSource>();
  for (const source of sources) {
    // Directory refresh dates and stock-price stories do not establish a new plant event.
    if (DIRECTORY.test(source.title) || STOCK.test(source.title)) continue;
    const evidence = `${source.title} ${source.summary}`;
    if (LOCAL.test(evidence) && INDUSTRY.test(evidence) && SIGNAL.test(evidence)) unique.set(source.url, source);
  }
  return [...unique.values()].slice(0, 8);
}

/** One batched Search API request per Monday; no Perplexity models or extra AI calls. */
export function createDemandResearch(now = new Date()) {
  let pending: Promise<ReturnType<typeof snapshot>> | undefined;
  let calls = 0;
  const warnings: string[] = [];
  let sources: NewsSource[] = [];
  let fallbackUsed = false;
  const snapshot = () => ({ from: new Date(now.getTime() - 7 * 86400000).toISOString(), to: now.toISOString(), sources, warnings, perplexityCalls: calls, fallbackUsed });
  const run = async () => {
    const gatewayKey = Deno.env.get("LOVABLE_API_KEY");
    const connectionKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (gatewayKey && connectionKey) {
      calls++;
      try {
        const response = await fetch("https://connector-gateway.lovable.dev/perplexity/search", {
          method: "POST",
          headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json" },
          body: JSON.stringify({ query: QUERIES, max_results: 10, search_recency_filter: "week" }),
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) {
          const details = await response.text();
          console.error(`Perplexity [${response.status}]: ${details}`);
          warnings.push(`Perplexity [${response.status}]: ${details.slice(0, 500)}; using free Google News`);
        } else {
          const body = await response.json();
          const rows = Array.isArray(body.results) ? body.results : [];
          sources = localDemandSources(freshSources(rows.map((row: Record<string, unknown>) => ({ ...row, description: row.snippet })), "perplexity", now, 30));
        }
      } catch (error) {
        warnings.push(`Perplexity: ${error instanceof Error ? error.message : String(error)}; using free Google News`);
      }
    } else warnings.push("Perplexity not connected; using free Google News");
    if (!sources.length) {
      fallbackUsed = true;
      sources = localDemandSources((await Promise.all(QUERIES.map(query => googleNewsSearch(query, 5, now)))).flat());
    }
    return snapshot();
  };
  return { research: () => { pending ??= run(); return pending; } };
}
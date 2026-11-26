import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createDemandResearch, localDemandSources } from "../_shared/demand-research.ts";
import { freshSources } from "../_shared/news-rules.ts";

const now = new Date("2026-11-26T05:49:00Z");
const row = { title: "Vapi chemical plant announces expansion", date: "2026-11-25", url: "https://example.org/vapi", description: "New manufacturing capacity" };
Deno.test("local demand requires evidence in the five service areas, not national industry news", () => {
  const rows = [row, { ...row, title: "Mumbai chemical plant announces expansion", url: "https://example.org/mumbai" }, { ...row, title: "Vapi football team announces expansion", description: "New team", url: "https://example.org/sport" }];
  assertEquals(localDemandSources(freshSources(rows, "perplexity", now)).map(s => s.url), [row.url]);
});
Deno.test("demand evidence rejects stale, future, undated and unsafe sources", () => {
  const rows = [row, { ...row, date: "2026-11-18", url: "https://example.org/old" }, { ...row, date: "2026-11-27", url: "https://example.org/future" }, { ...row, date: "", url: "https://example.org/unknown" }, { ...row, url: "javascript:alert(1)" }];
  assertEquals(localDemandSources(freshSources(rows, "perplexity", now)).map(s => s.url), [row.url]);
});
Deno.test("live search directory refreshes and stock recommendations are not new local demand events", () => {
  const rows = [row,
    { ...row, title: "Factories in Valsad, 2026: 283 Planned, 79 Awaiting Approval", url: "https://example.org/directory" },
    { ...row, title: "Upcoming Projects in Valsad, 2026: 571 Projects", url: "https://example.org/projects" },
    { ...row, title: "Industry projects in Valsad – Page 4 of 6, 2026", url: "https://example.org/page4" },
    { ...row, title: "Saaras Chemicals Upcoming Projects in Valsad: 4 Approved & Planned", url: "https://example.org/company" },
    { ...row, title: "Networth posts 'buy' on Kalpana Industries for target Rs 250", url: "https://example.org/stock" },
  ];
  assertEquals(localDemandSources(freshSources(rows, "perplexity", now, 10)).map(s => s.url), [row.url]);
});

async function mockedResearch(fail: boolean) {
  const oldFetch = globalThis.fetch;
  const gateway = Deno.env.get("LOVABLE_API_KEY"), connection = Deno.env.get("PERPLEXITY_API_KEY");
  Deno.env.set("LOVABLE_API_KEY", "test-only"); Deno.env.set("PERPLEXITY_API_KEY", "test-only");
  let calls = 0, fallbacks = 0;
  globalThis.fetch = async (input, init) => {
    if (String(input).includes("perplexity")) {
      calls++;
      assertEquals(String(input), "https://connector-gateway.lovable.dev/perplexity/search");
      const body = JSON.parse(String(init?.body));
      assertEquals(body.query.length, 3);
      assertEquals(body.search_recency_filter, "week");
      return fail ? new Response("quota used", { status: 402 }) : Response.json({ results: [{ ...row, snippet: row.description }] });
    }
    fallbacks++;
    return new Response("<rss></rss>");
  };
  try {
    const session = createDemandResearch(now);
    const [a, b] = await Promise.all([session.research(), session.research()]);
    assertEquals(calls, 1);
    assertEquals(a, b);
    assertEquals(a.perplexityCalls, 1);
    assertEquals(a.fallbackUsed, fail);
    assertEquals(fallbacks, fail ? 3 : 0);
    assertEquals(a.sources.length, fail ? 0 : 1);
    if (fail) assertEquals(a.warnings[0].includes("[402]: quota used"), true);
    else assertEquals(a.sources[0].summary, row.description);
  } finally {
    globalThis.fetch = oldFetch;
    if (gateway === undefined) Deno.env.delete("LOVABLE_API_KEY"); else Deno.env.set("LOVABLE_API_KEY", gateway);
    if (connection === undefined) Deno.env.delete("PERPLEXITY_API_KEY"); else Deno.env.set("PERPLEXITY_API_KEY", connection);
  }
}
Deno.test("Monday demand search batches once and caches repeated research", () => mockedResearch(false));
Deno.test("Perplexity failure preserves provider status and falls back without paid retries", () => mockedResearch(true));
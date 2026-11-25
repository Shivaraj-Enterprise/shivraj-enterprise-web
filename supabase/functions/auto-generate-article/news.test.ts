import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { freshSources, publicationDate } from "../_shared/news-rules.ts";
import { createNewsResearch } from "../_shared/news-research.ts";

const now = new Date("2026-11-25T06:40:00Z");
Deno.test("weekly news accepts the last seven days but rejects older and future news", () => {
  assertEquals(publicationDate("2026-11-18T06:40:00Z", now), "2026-11-18T06:40:00.000Z");
  assertEquals(publicationDate("2026-11-18T06:39:59Z", now), null);
  assertEquals(publicationDate("2026-11-26T00:00:00Z", now), null);
});
Deno.test("undated or invalid results cannot become fresh weekly sources", () => {
  assertEquals(publicationDate("", now), null);
  assertEquals(publicationDate("sometime recently", now), null);
});
Deno.test("Firecrawl relative news dates are resolved against the research run", () => {
  assertEquals(publicationDate("6 days ago", now), "2026-11-19T06:40:00.000Z");
  assertEquals(publicationDate("8 days ago", now), null);
});
Deno.test("source links are safe, deduplicated and retain publisher evidence", () => {
  const row = { title: "Gujarat employer news", date: "6 days ago", url: "https://www.pib.gov.in/news#section", markdown: "Employer compliance programme" };
  const sources = freshSources([row, row, { ...row, url: "javascript:alert(1)" }], "firecrawl", now);
  assertEquals(sources.length, 1);
  assertEquals(sources[0].url, "https://www.pib.gov.in/news");
  assertEquals(sources[0].summary, "Employer compliance programme");
});
Deno.test("research caps paid searches at four per run and reuses repeat queries", async () => {
  const oldFetch = globalThis.fetch;
  const oldGateway = Deno.env.get("LOVABLE_API_KEY"), oldConnection = Deno.env.get("FIRECRAWL_API_KEY");
  Deno.env.set("LOVABLE_API_KEY", "test-only"); Deno.env.set("FIRECRAWL_API_KEY", "test-only");
  let paid = 0;
  globalThis.fetch = async (input) => {
    if (String(input).includes("firecrawl")) {
      paid++;
      return Response.json({ success: true, creditsUsed: 2, data: { news: [{ title: "Employer news", url: `https://example.com/news/${paid}`, date: "1 day ago" }] } });
    }
    return new Response("<rss></rss>");
  };
  try {
    const research = createNewsResearch(now);
    await Promise.all(["one", "two", "three", "four", "five", "one"].map(q => research.search(q)));
    assertEquals(paid, 4);
    assertEquals(research.snapshot().firecrawlCreditsUsed, 8);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldGateway === undefined) Deno.env.delete("LOVABLE_API_KEY"); else Deno.env.set("LOVABLE_API_KEY", oldGateway);
    if (oldConnection === undefined) Deno.env.delete("FIRECRAWL_API_KEY"); else Deno.env.set("FIRECRAWL_API_KEY", oldConnection);
  }
});
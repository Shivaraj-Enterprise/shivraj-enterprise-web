export type NewsSource = { title: string; url: string; date: string; source: string; summary: string; provider: "firecrawl" | "google-news" | "perplexity" };

const WEEK_MS = 7 * 86400000;

/** Search providers sometimes return relative publication dates. Reject unknown or future dates. */
export function publicationDate(value: unknown, now = new Date()): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const relative = value.trim().match(/^(\d+)\s+(minute|hour|day|week)s?\s+ago$/i);
  const units: Record<string, number> = { minute: 60000, hour: 3600000, day: 86400000, week: WEEK_MS };
  const timestamp = relative ? now.getTime() - Number(relative[1]) * units[relative[2].toLowerCase()] : Date.parse(value);
  if (!Number.isFinite(timestamp) || timestamp > now.getTime() || timestamp < now.getTime() - WEEK_MS) return null;
  return new Date(timestamp).toISOString();
}

export function publisherUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    url.hash = "";
    return url.href;
  } catch { return null; }
}

export function freshSources(rows: unknown[], provider: NewsSource["provider"], now = new Date(), max = 5): NewsSource[] {
  const found = new Map<string, NewsSource>();
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const url = publisherUrl(item.url);
    const date = publicationDate(item.date, now);
    const title = typeof item.title === "string" ? item.title.trim().slice(0, 250) : "";
    if (!url || !date || !title || found.has(url)) continue;
    const text = typeof item.markdown === "string" ? item.markdown : typeof item.description === "string" ? item.description : "";
    const summary = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 4000);
    found.set(url, { title, url, date, summary, source: new URL(url).hostname, provider });
  }
  return [...found.values()].slice(0, max);
}
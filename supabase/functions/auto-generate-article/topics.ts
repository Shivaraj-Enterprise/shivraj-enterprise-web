// Pure helpers for weekly trending-topic discovery (testable without network).
const STOP = new Set(["the","a","an","of","for","in","on","and","to","with","how","what","is","are","your","you","guide","2025","2026","2027","india","vs"]);

export function tokens(s: string): Set<string> {
  return new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));
}

export function jaccard(a: string, b: string): number {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter);
}

export const SIMILARITY_LIMIT = 0.5;

export function isDuplicate(candidate: string, existing: string[]): boolean {
  return existing.some((e) => jaccard(candidate, e) >= SIMILARITY_LIMIT);
}

export type Scope = "local" | "india" | "global";

/** Monthly balance target: 2 local, 1 india, 1 global. Returns the scope most under target this month. */
export function preferredScope(usedThisMonth: Scope[]): Scope {
  const target: Record<Scope, number> = { local: 2, india: 1, global: 1 };
  const count: Record<Scope, number> = { local: 0, india: 0, global: 0 };
  for (const s of usedThisMonth) if (s in count) count[s]++;
  const order: Scope[] = ["local", "india", "global"];
  let best: Scope = "local", gap = -Infinity;
  for (const s of order) {
    const g = target[s] - count[s];
    if (g > gap) { gap = g; best = s; }
  }
  return best;
}

/** ISO week label like 2026-W46, used for once-per-week limits. */
export function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const wk = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${String(wk).padStart(2, "0")}`;
}

export function normalize(s: string): string {
  return [...tokens(s)].sort().join(" ");
}

/** Only successful publication proves a paused generator has recovered. */
export function weeklyPublicationState(week: string) {
  return { last_week: week, paused_reason: null };
}

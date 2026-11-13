import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { isDuplicate, preferredScope, isoWeek, jaccard, weeklyPublicationState } from "./topics.ts";

Deno.test("near-identical topics are rejected as duplicates", () => {
  assertEquals(isDuplicate("Minimum wages Gujarat 2026 update", ["Minimum Wages in Gujarat 2026"]), true);
});
Deno.test("different topics are allowed", () => {
  assertEquals(isDuplicate("Heatwave safety rules for factory workers", ["GST on manpower supply services"]), false);
});
Deno.test("similarity at 0.5 counts as duplicate", () => {
  assertEquals(jaccard("alpha beta", "alpha gamma beta delta") >= 0.5, true);
});
Deno.test("monthly mix starts local, then india, then global", () => {
  assertEquals(preferredScope([]), "local");
  assertEquals(preferredScope(["local", "local"]), "india");
  assertEquals(preferredScope(["local", "local", "india"]), "global");
  assertEquals(preferredScope(["local", "india", "global"]), "local");
});
Deno.test("iso week label", () => {
  assertEquals(isoWeek(new Date("2026-11-16T03:30:00Z")), "2026-W47");
});

for (const status of [402, 403]) {
  Deno.test(`successful manual publication clears an AI ${status} pause for next week's cron`, () => {
    const paused = { paused_reason: `AI ${status}: credits or permission problem`, last_week: "2026-W45" };
    const recovered = { ...paused, ...weeklyPublicationState("2026-W46") };
    assertEquals(recovered.paused_reason, null);
    assertEquals(recovered.last_week, "2026-W46");
    const nextWeek = isoWeek(new Date("2026-11-16T03:30:00Z"));
    assertEquals(Boolean(recovered.paused_reason) || recovered.last_week === nextWeek, false);
    // Cron still skips the week that was already published manually.
    assertEquals(recovered.last_week === "2026-W46", true);
  });
}

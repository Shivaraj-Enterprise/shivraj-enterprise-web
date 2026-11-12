import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { isDuplicate, preferredScope, isoWeek, jaccard } from "./topics.ts";

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

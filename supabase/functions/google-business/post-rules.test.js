import { describe, expect, it } from "bun:test";
import { validatePost, canRetry, mondayKey, weeklyDraft } from "./post-rules.ts";
describe("Google Business publishing safeguards", () => {
  it("enforces Google's 1500-character update limit", () => {
    expect(validatePost("a".repeat(1500), "https://shivraj-enterprise.lovable.app/services").content.length).toBe(1500);
    expect(() => validatePost("a".repeat(1501), "https://shivraj-enterprise.lovable.app/services")).toThrow();
  });
  it("only attaches the published company website", () => {
    expect(() => validatePost("Factory staffing", "https://example.com")).toThrow();
    expect(validatePost("Factory staffing", "https://shivraj-enterprise.lovable.app/labour-cost-calculator").link).toContain("/labour-cost-calculator");
  });
  it("never replays submitted, publishing or unknown outcomes", () => {
    expect(canRetry("failed")).toBe(true);
    for (const status of ["submitted", "publishing", "unknown"]) expect(canRetry(status)).toBe(false);
  });
  it("uses one Monday key across the Indian calendar week", () => {
    expect(mondayKey(new Date("2026-11-29T18:29:59Z"))).toBe("2026-11-23");
    expect(mondayKey(new Date("2026-11-29T18:30:00Z"))).toBe("2026-11-30");
    expect(mondayKey(new Date("2026-12-06T18:29:59Z"))).toBe("2026-11-30");
  });
  it("reuses stored FAQs with an attributable company link", () => {
    const draft = weeklyDraft({ faqs: [{ question: "How should a factory plan staffing?", answer: "Review shift coverage and discuss workforce requirements with your contractor." }] });
    expect(draft.content).toContain("Review shift coverage");
    expect(new URL(draft.link).searchParams.get("utm_campaign")).toBe("monday_business_update");
    expect(draft.content.length).toBeLessThanOrEqual(1500);
  });
  it("uses a factual service update when this week's FAQ is unavailable", () => {
    const draft = weeklyDraft(null);
    expect(draft.content).toContain("industrial manpower supply");
    expect(draft.content).not.toMatch(/tender|expansion|breaking|guaranteed/i);
  });
});
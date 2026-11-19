import { describe, expect, it } from "bun:test";
import { validatePost, canRetry } from "./post-rules.ts";
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
});
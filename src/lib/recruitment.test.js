import { expect, it } from "bun:test";
import { candidateMatches, candidateWhatsapp, recruitmentMessage } from "./recruitment";
it("sources role-specific candidates by skill and location", () => {
  const candidate = { name: "Test Worker", role: "General Helper", current_location: "Vapi", skill_level: "Unskilled" };
  expect(candidateMatches(candidate, "vapi", "Unskilled", "General Helper")).toBe(true);
  expect(candidateMatches(candidate, "vapi", "Skilled", "General Helper")).toBe(false);
  expect(candidateMatches(candidate, "vapi", "All", "Supervisor")).toBe(false);
});
it("shares a recruitment link without disclosing private candidate data", () => {
  expect(recruitmentMessage("CNC Helper")).toContain("Role: CNC Helper");
  expect(recruitmentMessage("CNC Helper")).toContain("https://shivraj-enterprise.lovable.app/careers");
});
it("does not invent a WhatsApp number when none was provided", () => {
  expect(candidateWhatsapp(null)).toBe(null);
  expect(candidateWhatsapp("9998498311")).toBe("https://wa.me/919998498311");
});
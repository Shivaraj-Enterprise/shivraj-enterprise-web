import { describe, expect, it } from "bun:test";
import { clampWorkers, pageEnquiry, quickEnquiry, whatsappEnquiry } from "./enquiryLinks";

const base = { service: "Loading, Unloading & Material Handling", area: "Sarigam GIDC", workers: 15, shift: "Night shift (8 hrs)", start: "Within a week" };

describe("WhatsApp quick enquiry", () => {
  it("prefills every chosen detail with no blanks", () => {
    const text = new URL(whatsappEnquiry(quickEnquiry(base))).searchParams.get("text");
    expect(text).toBe("Hello Shivraj Enterprise, I need 15 workers for Loading, Unloading & Material Handling in Sarigam GIDC. Shift: Night shift (8 hrs). Start: Within a week. Please confirm availability and quotation.");
  });
  it("keeps the worker count between 1 and 500", () => {
    expect(clampWorkers(0)).toBe(1);
    expect(clampWorkers(Number.NaN)).toBe(1);
    expect(clampWorkers(9999)).toBe(500);
    expect(quickEnquiry({ ...base, workers: 1 })).toContain("I need 1 worker for");
  });
  it("carries the service page context into the mobile WhatsApp button", () => {
    const labels = { "fitter-labour": "Fitter Labour" };
    expect(pageEnquiry("/services/fitter-labour", labels)).toContain("I need Fitter Labour");
    expect(pageEnquiry("/services/unknown", labels)).toContain("I need manpower for my factory");
    expect(pageEnquiry("/locations", labels)).toContain("in the Vapi industrial belt");
  });
});

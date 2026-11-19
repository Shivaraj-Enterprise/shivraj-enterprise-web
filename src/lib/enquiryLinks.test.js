import { describe, expect, it } from "bun:test";
import { REVIEW_URL, quoteEnquiry, serviceEnquiry, whatsappEnquiry } from "./enquiryLinks";

describe("industrial enquiry context", () => {
  it("preserves the exact service and location in WhatsApp", () => {
    const url = new URL(whatsappEnquiry(serviceEnquiry("Machine Operators", "Sarigam GIDC")));
    expect(url.pathname).toBe("/919998498311");
    expect(url.searchParams.get("text")).toContain("Machine Operators in Sarigam GIDC");
  });
  it("carries the enquiry into the existing quote form", () => {
    const url = new URL(quoteEnquiry("Industrial housekeeping & 20 workers"), "https://shivraj-enterprise.lovable.app");
    expect(url.searchParams.get("inquiry")).toBe("quote");
    expect(url.searchParams.get("message")).toBe("Industrial housekeeping & 20 workers");
  });
  it("requests reviews for the managed company listing", () => {
    expect(new URL(REVIEW_URL).searchParams.get("placeid")).toBe("ChIJxWwqylXP4DsRZgmbPfacN6M");
  });
});
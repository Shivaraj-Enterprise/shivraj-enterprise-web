import { defineTool } from "@lovable.dev/mcp-js";

const COMPANY_INFO = {
  name: "SHIVRAJ ENTERPRISE PVT. LTD.",
  tagline: "Manpower supply, outsourcing and industrial housekeeping in Vapi GIDC, Gujarat.",
  services: [
    "Manpower Outsourcing Services (with PF, ESIC and wages compliance)",
    "Manpower Supply Services for factories, warehouses and commercial sites",
    "Industrial Housekeeping Solutions",
    "Loading, unloading and general helpers",
    "Security and support staff deployment",
  ],
  compliance: [
    "GST-compliant invoicing (18% on manpower supply)",
    "TDS handling under Section 194C",
    "ESI and EPF managed for deployed workers",
    "Registered under the Contract Labour (Regulation & Abolition) Act",
  ],
  primaryLocation: "Vapi GIDC, Gujarat, India",
  contact: {
    email: "shivrajenterprise1234@gmail.com",
    phone: "+91 99984 98311",
    website: "https://shivraj-enterprise.lovable.app",
  },
  contactPage: "https://shivraj-enterprise.lovable.app/#/contact",
};

export default defineTool({
  name: "get_company_info",
  title: "Get Shivraj Enterprise company info",
  description:
    "Get public company profile for Shivraj Enterprise Pvt. Ltd.: services offered, compliance handled, location, and how to contact them for a quote.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(COMPANY_INFO) }],
    structuredContent: COMPANY_INFO,
  }),
});

// Static long-form guides that live as dedicated routes (not in the DB).
// Keep in sync with src/data/staticPosts.ts.
export type StaticGuide = {
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
  url: string;
  tags: string[];
};

const BASE = "https://shivraj-enterprise.lovable.app/blog";

export const STATIC_GUIDES: StaticGuide[] = [
  {
    slug: "statutory-compliance-manpower-supply-guide",
    title: "Statutory Compliance for Manpower Supply in India: The 2026 Buyer's Guide",
    excerpt:
      "EPF, ESI, GST and labour law obligations that separate a compliant manpower agency from a risky one — with a monthly verification routine for industrial plants in Vapi GIDC.",
    published_at: "2026-08-01",
    url: `${BASE}/statutory-compliance-manpower-supply-guide`,
    tags: ["Compliance", "Manpower Agency", "EPF & ESI"],
  },
  {
    slug: "hr-compliance-checklist-vapi-gidc",
    title: "2026 HR Compliance Checklist for Industrial Plants in Vapi GIDC",
    excerpt:
      "A practical, audit-ready 2026 HR compliance checklist for Vapi GIDC plants — PF, ESIC, Factories Act, Contract Labour Act, wages, POSH and manpower supply due diligence.",
    published_at: "2026-07-26",
    url: `${BASE}/hr-compliance-checklist-vapi-gidc`,
    tags: ["Compliance", "Vapi GIDC", "HR"],
  },
  {
    slug: "manpower-outsourcing-vs-in-house-hiring",
    title: "Manpower Outsourcing vs In-House Hiring in Vapi GIDC: A 2026 Cost-Benefit Guide",
    excerpt:
      "Compare manpower outsourcing benefits with in-house hiring for Vapi GIDC plants — PF/ESIC compliance, recruitment overhead and the true cost of labour supply in Vapi.",
    published_at: "2026-07-14",
    url: `${BASE}/manpower-outsourcing-vs-in-house-hiring`,
    tags: ["Outsourcing", "Vapi GIDC", "Compliance"],
  },
  {
    slug: "gst-tds-manpower-supply-guide",
    title: "GST & TDS on Manpower Supply Services in India – A Compliance Guide",
    excerpt:
      "A practical guide to GST (18% Forward Charge, RCM) and TDS Section 194C for manpower outsourcing in India — for procurement, finance and HR managers.",
    published_at: "2026-07-03",
    url: `${BASE}/gst-tds-manpower-supply-guide`,
    tags: ["Compliance", "GST", "TDS"],
  },
];

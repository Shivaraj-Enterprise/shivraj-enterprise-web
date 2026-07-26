import type { BlogPostCard } from "@/components/blog/PostCard";

// Static/featured guides that live as their own routes (not in the DB).
export const STATIC_POSTS: BlogPostCard[] = [
  {
    id: "static-hr-compliance-checklist-vapi-gidc",
    slug: "hr-compliance-checklist-vapi-gidc",
    title: "2026 HR Compliance Checklist for Industrial Plants in Vapi GIDC",
    excerpt:
      "A practical, audit-ready 2026 HR compliance checklist for Vapi GIDC plants — PF, ESIC, Factories Act, Contract Labour Act, wages, POSH and manpower supply due diligence.",
    cover_image_url: null,
    published_at: "2026-07-26",
    tags: [
      { slug: "compliance", name: "Compliance" },
      { slug: "vapi-gidc", name: "Vapi GIDC" },
      { slug: "hr", name: "HR" },
    ],
  },
  {
    id: "static-manpower-outsourcing-vs-in-house-hiring",
    slug: "manpower-outsourcing-vs-in-house-hiring",
    title: "Manpower Outsourcing vs In-House Hiring in Vapi GIDC: A 2026 Cost-Benefit Guide",
    excerpt:
      "Compare manpower outsourcing benefits with in-house hiring for Vapi GIDC plants — PF/ESIC compliance, recruitment overhead and the true cost of labour supply in Vapi.",
    cover_image_url: null,
    published_at: "2026-07-14",
    tags: [
      { slug: "outsourcing", name: "Outsourcing" },
      { slug: "vapi-gidc", name: "Vapi GIDC" },
      { slug: "compliance", name: "Compliance" },
    ],
  },
  {
    id: "static-gst-tds-manpower-supply-guide",
    slug: "gst-tds-manpower-supply-guide",
    title: "GST & TDS on Manpower Supply Services in India – A Compliance Guide",
    excerpt:
      "A practical guide to GST (18% Forward Charge, RCM) and TDS Section 194C for manpower outsourcing in India — for procurement, finance and HR managers.",
    cover_image_url: null,
    published_at: "2026-07-03",
    tags: [
      { slug: "compliance", name: "Compliance" },
      { slug: "gst", name: "GST" },
      { slug: "tds", name: "TDS" },
    ],
  },
];

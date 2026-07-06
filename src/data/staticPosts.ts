import type { BlogPostCard } from "@/components/blog/PostCard";

// Static/featured guides that live as their own routes (not in the DB).
export const STATIC_POSTS: BlogPostCard[] = [
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

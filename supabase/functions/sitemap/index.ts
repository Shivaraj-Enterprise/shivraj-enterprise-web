// Dynamic sitemap.xml — always reflects the latest published blog posts.
// Also serves an RSS feed when path ends in /rss.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const SITE = "https://shivraj-enterprise.lovable.app";

const STATIC_URLS: Array<{ loc: string; changefreq: string; priority: string }> = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/services", changefreq: "monthly", priority: "0.8" },
  { loc: "/locations", changefreq: "monthly", priority: "0.8" },
  { loc: "/blog", changefreq: "weekly", priority: "0.7" },
  { loc: "/blog/gst-tds-manpower-supply-guide", changefreq: "monthly", priority: "0.7" },
  { loc: "/blog/manpower-outsourcing-vs-in-house-hiring", changefreq: "monthly", priority: "0.7" },
  { loc: "/contact", changefreq: "monthly", priority: "0.8" },
  { loc: "/terms", changefreq: "yearly", priority: "0.5" },
];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function fetchPosts() {
  const { data } = await supabase
    .from("blog_posts")
    .select("slug,title,excerpt,published_at,updated_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(500);
  return data ?? [];
}

function buildSitemap(posts: Awaited<ReturnType<typeof fetchPosts>>) {
  const urls: string[] = [];
  for (const u of STATIC_URLS) {
    urls.push(`  <url><loc>${SITE}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`);
  }
  for (const p of posts) {
    const lastmod = (p.updated_at ?? p.published_at ?? new Date().toISOString()).slice(0, 10);
    urls.push(`  <url><loc>${SITE}/blog/${xmlEscape(p.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildRss(posts: Awaited<ReturnType<typeof fetchPosts>>) {
  const items = posts.slice(0, 50).map((p) => {
    const pub = new Date(p.published_at ?? Date.now()).toUTCString();
    return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${SITE}/blog/${xmlEscape(p.slug)}</link>
      <guid isPermaLink="true">${SITE}/blog/${xmlEscape(p.slug)}</guid>
      <description>${xmlEscape(p.excerpt ?? "")}</description>
      <pubDate>${pub}</pubDate>
    </item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Shivraj Enterprise — Blog</title>
  <link>${SITE}/blog</link>
  <description>Manpower supply, housekeeping and compliance insights from Vapi GIDC.</description>
  <language>en-in</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel></rss>
`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const url = new URL(req.url);
  const isRss = url.pathname.endsWith("/rss") || url.searchParams.get("format") === "rss";
  const posts = await fetchPosts();
  const body = isRss ? buildRss(posts) : buildSitemap(posts);
  return new Response(body, {
    headers: {
      ...cors,
      "Content-Type": isRss ? "application/rss+xml; charset=utf-8" : "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
});

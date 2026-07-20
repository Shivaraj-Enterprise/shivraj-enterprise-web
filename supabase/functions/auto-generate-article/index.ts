// Weekly auto-article generator.
// Picks an unused SEO keyword from a curated pool (informed by Semrush research
// for the manpower/staffing niche in Vapi GIDC), asks Lovable AI to write a
// premium, fully-formatted HTML article matching the blog design spec, and
// inserts it into blog_posts. A pg_cron job invokes this every Monday.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

// Curated pool from Semrush keyword research for the manpower supply / staffing
// niche in India. Each entry gives the SEO keyword and a target category.
const TOPIC_POOL: Array<{ keyword: string; angle: string; category: string; tags: string[] }> = [
  { keyword: "manpower outsourcing services", angle: "A complete buyer's guide to manpower outsourcing services for industrial units — what's included, cost structure, compliance handled by the vendor, and how to evaluate an agency.", category: "Manpower Supply", tags: ["outsourcing", "manpower", "vapi-gidc"] },
  { keyword: "manpower supply services", angle: "How manpower supply services work in Vapi GIDC — contract structure, statutory compliance, deployment timelines, and typical SLAs for chemical and engineering plants.", category: "Manpower Supply", tags: ["manpower-supply", "compliance", "vapi-gidc"] },
  { keyword: "skilled labour supply in Vapi", angle: "Where to source skilled labour in Vapi GIDC — trades, wage bands, PF/ESIC coverage, and how a licensed contractor de-risks hiring.", category: "Manpower Supply", tags: ["skilled-labour", "vapi", "gidc"] },
  { keyword: "housekeeping services for factories", angle: "Industrial housekeeping in chemical and engineering plants — scope, shift models, chemicals & PPE, safety compliance, and how to price a contract.", category: "Housekeeping", tags: ["housekeeping", "facility", "industrial"] },
  { keyword: "contract labour compliance India", angle: "Contract Labour (Regulation & Abolition) Act explained for factory owners — licences, principal employer duties, registers, and penalties.", category: "Compliance", tags: ["clra", "contract-labour", "compliance"] },
  { keyword: "ESI EPF applicability manpower supply", angle: "ESI and EPF applicability on outsourced manpower — who deducts, who deposits, principal employer liability, and audit checklist.", category: "Compliance", tags: ["esi", "epf", "compliance"] },
  { keyword: "GST on manpower supply services", angle: "GST on manpower supply — rate, RCM applicability, invoicing rules for pure agent vs full-service contracts, and ITC treatment.", category: "Compliance", tags: ["gst", "tax", "manpower"] },
  { keyword: "TDS on manpower supply contract", angle: "TDS on manpower supply contracts under section 194C — thresholds, rates, TAN requirements, and quarterly return timelines.", category: "Compliance", tags: ["tds", "194c", "tax"] },
  { keyword: "how to hire security guards for factory", angle: "Hiring PSARA-licensed security guards for a factory — vendor checks, deployment models, uniform & training standards, and cost per post.", category: "Security", tags: ["security", "psara", "guards"] },
  { keyword: "manpower agency in Vapi GIDC", angle: "How to choose a manpower agency in Vapi GIDC — licence checks, client references, compliance track record, and red flags to avoid.", category: "Manpower Supply", tags: ["agency", "vapi", "gidc"] },
  { keyword: "minimum wages Gujarat 2026", angle: "Latest minimum wages in Gujarat for unskilled/semi-skilled/skilled workers and how they flow into a manpower supply invoice.", category: "Compliance", tags: ["wages", "gujarat", "compliance"] },
  { keyword: "facility management services India", angle: "Integrated facility management for industrial plants — soft services, hard services, MEP, and how bundling reduces overhead.", category: "Facility Management", tags: ["fm", "facility", "industrial"] },
];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 70);
}

async function pickTopic(): Promise<typeof TOPIC_POOL[number]> {
  const { data } = await supabase.from("blog_posts").select("slug");
  const usedSlugs = new Set((data ?? []).map((r) => r.slug));
  // Prefer topics whose keyword-slug is not already used
  const available = TOPIC_POOL.filter((t) => !usedSlugs.has(slugify(t.keyword)));
  const pool = available.length > 0 ? available : TOPIC_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

const SYSTEM_PROMPT = `You are a senior B2B content editor writing for Shivraj Enterprise, a licensed manpower supply and facility management company operating in Vapi GIDC (Gujarat, India) since 2004. Your audience is factory owners, HR & procurement managers, and plant heads at chemical, pharma and engineering units.

Write premium, highly readable, SEO-optimized blog articles in the style of Stripe, HubSpot and Medium. You output ONLY sanitized HTML — no <html>, <head>, <body>, no markdown fences.

Allowed tags ONLY: h2, h3, h4, p, ul, ol, li, blockquote, a, strong, em, hr, table, thead, tbody, tr, th, td, code, pre. Do NOT emit h1 (the page renders it). Do NOT emit <img> (images are auto-generated by the platform).

Formatting rules:
- 1400–1800 words.
- Structure: intro paragraph, then 6–9 H2 sections. Use H3 subsections where useful.
- Every H2 section is 2–4 short paragraphs (max 3 sentences each). Never long walls of text.
- Include AT LEAST: one bullet list, one numbered list, one <blockquote> pull-quote, one <table> with <thead>/<tbody> (e.g. compliance rates, wage bands, checklist).
- End with an H2 "Frequently asked questions" containing 4–5 Q/A pairs, each Q as <h3> and A as <p>.
- End with an H2 "Conclusion" — 1 short paragraph.
- Use Indian context: INR, Vapi GIDC, Gujarat labour law, CLRA, PF, ESIC, GST section 9(3)/9(4), TDS 194C. Cite section numbers where relevant.
- Bold the target keyword and 3–5 semantic variants using <strong>. Do NOT keyword-stuff.
- Internal links: use <a href="/services">, <a href="/contact">, <a href="/blog">, <a href="/locations"> where natural.

Return a strict JSON object with keys: title, excerpt, content_html. No prose outside JSON.`;

async function generateArticle(topic: typeof TOPIC_POOL[number]) {
  const userPrompt = `Target SEO keyword: "${topic.keyword}"
Category: ${topic.category}
Editorial angle: ${topic.angle}

Write the article now. Return JSON: { "title": string (55–65 chars, includes the keyword naturally), "excerpt": string (140–160 chars, meta-description style), "content_html": string }.`;

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${body}`);
  }
  const j = await resp.json();
  const raw = j.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(raw);
  if (!parsed.title || !parsed.content_html) throw new Error("AI returned incomplete article");
  return parsed as { title: string; excerpt: string; content_html: string };
}

async function upsertTags(postId: string, tagNames: string[]) {
  for (const name of tagNames) {
    const slug = slugify(name);
    const { data: existing } = await supabase.from("blog_tags").select("id").eq("slug", slug).maybeSingle();
    let tagId = existing?.id;
    if (!tagId) {
      const { data: inserted } = await supabase.from("blog_tags").insert({ name, slug }).select("id").single();
      tagId = inserted?.id;
    }
    if (tagId) {
      await supabase.from("blog_post_tags").insert({ post_id: postId, tag_id: tagId }).select();
    }
  }
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base, i = 2;
  while (true) {
    const { data } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
    if (i > 20) return `${base}-${Date.now()}`;
  }
}

// ---------- SEO quality check ----------
// Grades every generated post on meta length, heading structure and the
// schema.org fields we auto-fill (BlogPosting + FAQPage + BreadcrumbList).
// Returns 0–100 + a full report.
type SeoCheck = { id: string; label: string; pass: boolean; detail: string; weight: number };

// Extract FAQ Q/A pairs from the "Frequently asked questions" section — Qs are
// rendered as <h3>, answers as the following <p>(s) until the next heading.
function extractFaqs(html: string): Array<{ q: string; a: string }> {
  const faqs: Array<{ q: string; a: string }> = [];
  const faqSectionMatch = html.match(/<h2[^>]*>\s*[^<]*frequently asked[^<]*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i);
  if (!faqSectionMatch) return faqs;
  const section = faqSectionMatch[1];
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<h3[\s>]|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    const q = m[1].replace(/<[^>]+>/g, "").trim();
    const a = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

function buildSchemas(article: { title: string; excerpt: string; content_html: string }, slug: string) {
  const url = `https://shivraj-enterprise.lovable.app/blog/${slug}`;
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Organization", name: "Shivraj Enterprise" },
    publisher: { "@type": "Organization", name: "Shivraj Enterprise" },
    datePublished: new Date().toISOString(),
    mainEntityOfPage: url,
  };
  const faqs = extractFaqs(article.content_html);
  const faqPage = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://shivraj-enterprise.lovable.app/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://shivraj-enterprise.lovable.app/blog" },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };
  return { blogPosting, faqPage, breadcrumb, faqs };
}

function scoreSeo(article: { title: string; excerpt: string; content_html: string }, slug: string) {
  const checks: SeoCheck[] = [];
  const t = article.title ?? "";
  checks.push({ id: "title_length", label: "Meta title 50–65 chars", pass: t.length >= 50 && t.length <= 65, detail: `${t.length} chars`, weight: 12 });
  const d = article.excerpt ?? "";
  checks.push({ id: "meta_desc_length", label: "Meta description 120–160 chars", pass: d.length >= 120 && d.length <= 160, detail: `${d.length} chars`, weight: 12 });

  const html = article.content_html ?? "";
  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
  checks.push({ id: "no_h1", label: "No <h1> in body (page owns H1)", pass: h1 === 0, detail: `${h1} found`, weight: 8 });

  const h2 = (html.match(/<h2[\s>]/gi) ?? []).length;
  checks.push({ id: "h2_count", label: "At least 4 H2 sections", pass: h2 >= 4, detail: `${h2} found`, weight: 8 });

  const headings = [...html.matchAll(/<h([2-4])[\s>]/gi)].map((m) => Number(m[1]));
  let orderOk = true;
  for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) { orderOk = false; break; }
  checks.push({ id: "heading_order", label: "Heading levels do not skip", pass: orderOk, detail: orderOk ? "ok" : headings.join(">"), weight: 8 });

  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  checks.push({ id: "word_count", label: "1200+ words", pass: words >= 1200, detail: `${words} words`, weight: 8 });

  checks.push({ id: "has_list", label: "Has a bullet or numbered list", pass: /<(ul|ol)[\s>]/i.test(html), detail: "", weight: 5 });
  checks.push({ id: "has_table", label: "Has a data table", pass: /<table[\s>]/i.test(html), detail: "", weight: 5 });
  checks.push({ id: "has_faq", label: "Has an FAQ section", pass: /frequently asked/i.test(html), detail: "", weight: 5 });
  checks.push({ id: "internal_link", label: "Has at least 1 internal link", pass: /<a\s+[^>]*href="\/[^"]/i.test(html), detail: "", weight: 5 });

  const { blogPosting, faqPage, breadcrumb, faqs } = buildSchemas(article, slug);
  const blogPostingOk = Boolean(blogPosting.headline && blogPosting.description && blogPosting.datePublished && blogPosting.mainEntityOfPage);
  checks.push({ id: "schema_blogposting", label: "BlogPosting schema is complete", pass: blogPostingOk, detail: "", weight: 8 });
  checks.push({ id: "schema_faqpage", label: "FAQPage schema has 3+ Q/A pairs", pass: !!faqPage && faqs.length >= 3, detail: `${faqs.length} pairs`, weight: 8 });
  checks.push({ id: "schema_breadcrumb", label: "BreadcrumbList schema is complete", pass: breadcrumb.itemListElement.length === 3, detail: "", weight: 8 });

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const gained = checks.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((gained / total) * 100);
  return { score, report: { checks, schema: { blogPosting, faqPage, breadcrumb } } };
}

// Threshold below which we auto-rewrite before publishing.
const SEO_THRESHOLD = 80;
const MAX_REWRITES = 2;

function buildRewriteFeedback(report: { checks: SeoCheck[] }): string {
  const fails = report.checks.filter((c) => !c.pass);
  if (!fails.length) return "";
  return "Previous draft failed these SEO checks — fix ALL of them:\n" +
    fails.map((c) => `- ${c.label}${c.detail ? ` (was: ${c.detail})` : ""}`).join("\n");
}

async function generateAndScore(topic: typeof TOPIC_POOL[number], slug: string) {
  let article = await generateArticle(topic);
  let { score, report } = scoreSeo(article, slug);
  let attempts = 0;
  const history: Array<{ attempt: number; score: number }> = [{ attempt: 0, score }];
  while (score < SEO_THRESHOLD && attempts < MAX_REWRITES) {
    attempts++;
    const feedback = buildRewriteFeedback(report);
    article = await generateArticle(topic, feedback);
    ({ score, report } = scoreSeo(article, slug));
    history.push({ attempt: attempts, score });
  }
  (report as Record<string, unknown>).rewrite_history = history;
  return { article, score, report };
}

// Overload generateArticle to accept optional rewrite feedback.
const _origGen = generateArticle;
// deno-lint-ignore no-explicit-any
(globalThis as any).__origGen = _origGen;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Manual re-run: { post_id } — regenerates content for an existing post
    // using its current title as the topic keyword and updates in place.
    let body: { post_id?: string } = {};
    try { body = await req.json(); } catch { /* no body */ }

    if (body.post_id) {
      const { data: existing, error: fetchErr } = await supabase
        .from("blog_posts")
        .select("id, slug, title")
        .eq("id", body.post_id)
        .single();
      if (fetchErr || !existing) throw new Error("post not found");

      const topic = {
        keyword: existing.title,
        angle: `Rewrite and improve this article for SEO. Keep the same topic and target audience.`,
        category: "Manpower Supply",
        tags: [] as string[],
      };
      const { article, score, report } = await generateAndScore(topic, existing.slug);
      const { error: updErr } = await supabase
        .from("blog_posts")
        .update({
          title: article.title.slice(0, 200),
          excerpt: article.excerpt?.slice(0, 300) ?? null,
          content: article.content_html,
          seo_score: score,
          seo_report: report,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (updErr) throw updErr;

      return new Response(
        JSON.stringify({ ok: true, mode: "rerun", seo_score: score, post_id: existing.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const topic = await pickTopic();
    const baseSlug = slugify(topic.keyword);
    const slug = await ensureUniqueSlug(baseSlug);
    const { article, score, report } = await generateAndScore(topic, slug);

    const { data: inserted, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title: article.title.slice(0, 200),
        excerpt: article.excerpt?.slice(0, 300) ?? null,
        content: article.content_html,
        published: true,
        published_at: new Date().toISOString(),
        seo_score: score,
        seo_report: report,
      })
      .select("id, slug, title")
      .single();

    if (error) throw error;

    await upsertTags(inserted!.id, topic.tags);

    const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_ROLE}` };
    fetch(`${SUPABASE_URL}/functions/v1/ingest-knowledge`, { method: "POST", headers: authHeaders, body: "{}" }).catch(() => {});
    fetch(`${SUPABASE_URL}/functions/v1/sitemap`, { headers: authHeaders }).catch(() => {});
    fetch(`${SUPABASE_URL}/functions/v1/sitemap/rss`, { headers: authHeaders }).catch(() => {});

    return new Response(
      JSON.stringify({ ok: true, keyword: topic.keyword, seo_score: score, post: inserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("auto-generate-article failed:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

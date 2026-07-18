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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const topic = await pickTopic();
    const article = await generateArticle(topic);
    const baseSlug = slugify(article.title) || slugify(topic.keyword);
    const slug = await ensureUniqueSlug(baseSlug);

    const { data: inserted, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title: article.title.slice(0, 200),
        excerpt: article.excerpt?.slice(0, 300) ?? null,
        content: article.content_html,
        published: true,
        published_at: new Date().toISOString(),
      })
      .select("id, slug, title")
      .single();

    if (error) throw error;

    await upsertTags(inserted!.id, topic.tags);

    // Fire-and-forget: refresh the AI knowledge base so the new post is
    // available to the sales chat immediately.
    fetch(`${SUPABASE_URL}/functions/v1/ingest-knowledge`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_ROLE}` },
      body: "{}",
    }).catch(() => {});

    return new Response(
      JSON.stringify({ ok: true, keyword: topic.keyword, post: inserted }),
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

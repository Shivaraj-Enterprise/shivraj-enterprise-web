// Scheduled ingestion: crawls sitemap.xml, fetches every page, extracts text,
// chunks it, and upserts into knowledge_chunks. Also ingests published blog
// posts and any PDF URLs provided in the request body.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DEFAULT_SITE = "https://shivraj-enterprise.lovable.app";
const CHUNK_SIZE = 1200; // chars
const CHUNK_OVERLAP = 150;

function stripHtml(html: string): { title: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return { title, text: cleaned };
}

function chunkText(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text];
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function fetchSitemapUrls(base: string): Promise<string[]> {
  try {
    const res = await fetch(`${base}/sitemap.xml`);
    if (!res.ok) return [];
    const xml = await res.text();
    const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
    return urls;
  } catch {
    return [];
  }
}

async function ingestUrl(url: string, sourceType: string): Promise<{ url: string; chunks: number; skipped?: boolean; error?: string }> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "ShivrajBot/1.0" } });
    if (!res.ok) return { url, chunks: 0, error: `HTTP ${res.status}` };
    const html = await res.text();
    const { title, text } = stripHtml(html);
    if (!text || text.length < 80) return { url, chunks: 0, skipped: true };

    const chunks = chunkText(text);
    // Clear old chunks for this url
    await supabase.from("knowledge_chunks").delete().eq("url", url);

    const rows = await Promise.all(chunks.map(async (c, idx) => ({
      url,
      title: title || url,
      source_type: sourceType,
      chunk_index: idx,
      content: c,
      content_hash: await sha256(c),
      tokens: Math.ceil(c.length / 4),
      last_ingested_at: new Date().toISOString(),
    })));

    const { error } = await supabase.from("knowledge_chunks").insert(rows);
    if (error) return { url, chunks: 0, error: error.message };
    return { url, chunks: rows.length };
  } catch (e) {
    return { url, chunks: 0, error: (e as Error).message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const site: string = body.site ?? DEFAULT_SITE;
    const pdfUrls: string[] = Array.isArray(body.pdf_urls) ? body.pdf_urls : [];
    const extraUrls: string[] = Array.isArray(body.urls) ? body.urls : [];

    // 1. Discover pages via sitemap
    const sitemapUrls = await fetchSitemapUrls(site);
    const pageUrls = Array.from(new Set([...sitemapUrls, ...extraUrls]));

    // 2. Ingest published blog posts directly from DB (fast, accurate)
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, content, published_at")
      .eq("published", true);

    const results: Array<Record<string, unknown>> = [];

    // Pages (throttled — max 5 concurrent)
    const queue = [...pageUrls];
    async function worker() {
      while (queue.length) {
        const u = queue.shift()!;
        results.push(await ingestUrl(u, u.includes("/blog/") ? "blog" : "page"));
      }
    }
    await Promise.all([worker(), worker(), worker(), worker(), worker()]);

    // Blog posts from DB
    if (posts?.length) {
      for (const p of posts) {
        const url = `${site}/blog/${p.slug}`;
        const rawContent = typeof p.content === "string"
          ? p.content
          : JSON.stringify(p.content ?? "");
        const { text } = stripHtml(rawContent);
        const full = `${p.title}\n\n${p.excerpt ?? ""}\n\n${text}`.trim();
        if (full.length < 40) continue;
        const chunks = chunkText(full);
        await supabase.from("knowledge_chunks").delete().eq("url", url);
        const rows = await Promise.all(chunks.map(async (c, idx) => ({
          url,
          title: p.title,
          source_type: "blog_db",
          chunk_index: idx,
          content: c,
          content_hash: await sha256(c),
          tokens: Math.ceil(c.length / 4),
          last_ingested_at: new Date().toISOString(),
        })));
        await supabase.from("knowledge_chunks").insert(rows);
        results.push({ url, chunks: rows.length, source: "blog_db" });
      }
    }

    // PDFs — store URL + title placeholder (binary PDF text extraction requires a lib; we store metadata so the agent can link).
    for (const pdf of pdfUrls) {
      const url = pdf;
      const title = pdf.split("/").pop() ?? pdf;
      const content = `PDF document: ${title}. Available at ${url}.`;
      await supabase.from("knowledge_chunks").delete().eq("url", url);
      await supabase.from("knowledge_chunks").insert({
        url,
        title,
        source_type: "pdf",
        chunk_index: 0,
        content,
        content_hash: await sha256(content),
        tokens: Math.ceil(content.length / 4),
        last_ingested_at: new Date().toISOString(),
      });
      results.push({ url, chunks: 1, source: "pdf" });
    }

    const totalChunks = results.reduce((s, r) => s + (typeof r.chunks === "number" ? r.chunks : 0), 0);

    return new Response(JSON.stringify({
      ok: true,
      site,
      pages_discovered: pageUrls.length,
      blog_posts: posts?.length ?? 0,
      pdfs: pdfUrls.length,
      total_chunks: totalChunks,
      results,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ingest-knowledge error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

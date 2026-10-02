// IndexNow submission — pings api.indexnow.org so Bing, Yandex, Seznam and
// other participating engines index new or updated URLs immediately.
// Accepts POST { urls?: string[] } (same-origin URLs only); when no URLs are
// given, submits every URL from sitemap.xml. Server-to-server only: requires
// the shared internal secret or the service-role bearer.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const SITE = "https://shivraj-enterprise.lovable.app";
const HOST = "shivraj-enterprise.lovable.app";
const INDEXNOW_KEY = "e9935731781953cd0f51c64defa585b6";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const ALLOWED_HOSTS = new Set([
  HOST,
  "id-preview--db2d17b4-0983-4eea-ba06-5a9e8f594602.lovable.app",
]);

function isAllowedUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    return ALLOWED_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

async function fetchSitemapUrls(): Promise<string[]> {
  try {
    const res = await fetch(`${SITE}/sitemap.xml`);
    if (!res.ok) return [];
    const xml = await res.text();
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  } catch {
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Auth: service-role bearer OR shared internal secret OR the public anon key
  // (anon key may only trigger the site-wide sitemap submission, which is
  // harmless — it always submits the same public URLs).
  const provided = req.headers.get("x-internal-secret");
  const bearer = (req.headers.get("Authorization") ?? req.headers.get("apikey") ?? "")
    .replace(/^Bearer\s+/i, "");
  const anonKeys = [Deno.env.get("SUPABASE_ANON_KEY"), Deno.env.get("SUPABASE_PUBLISHABLE_KEY")].filter(Boolean) as string[];
  let authorized = false;
  if (provided) {
    const { data: expected } = await supabase.rpc("get_monthly_report_secret");
    authorized = !!expected && provided === expected;
  }
  if (!authorized && bearer && bearer === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
    authorized = true;
  }
  let parsedBody: unknown = null;
  if (!authorized && anonKeys.includes(bearer) && req.method === "POST") {
    parsedBody = await req.json().catch(() => ({}));
    if (!Array.isArray((parsedBody as Record<string, unknown>)?.urls)) authorized = true;
  }
  if (!authorized) {
    if (true) { // TEMP DEBUG — revert to env check after diagnosing
      return new Response(JSON.stringify({
        error: "Unauthorized",
        debug: {
          bearer_present: !!bearer,
          bearer_len: bearer.length,
          matches_anon: anonKeys.includes(bearer),
          matches_service: bearer === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
          provided_secret: !!provided,
        },
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (parsedBody as Record<string, unknown>) ??
      (req.method === "POST" ? await req.json().catch(() => ({})) : {});
    const raw: string[] = Array.isArray(body.urls) ? body.urls : [];
    const urls = Array.from(new Set(raw.filter(isAllowedUrl)));
    const list = urls.length ? urls : (await fetchSitemapUrls()).filter(isAllowedUrl);

    if (!list.length) {
      return new Response(JSON.stringify({ ok: false, error: "no urls to submit" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // IndexNow accepts up to 10,000 URLs per request; submit in batches of 100
    const results: Array<{ submitted: number; status: number }> = [];
    for (let i = 0; i < list.length; i += 100) {
      const batch = list.slice(i, i + 100);
      const res = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
          urlList: batch,
        }),
      });
      results.push({ submitted: batch.length, status: res.status });
      // 200/202 = accepted; 429 = too many requests, back off briefly
      if (res.status === 429) await new Promise((r) => setTimeout(r, 1500));
    }

    const ok = results.every((r) => r.status === 200 || r.status === 202);
    return new Response(
      JSON.stringify({ ok, endpoint: INDEXNOW_ENDPOINT, total: list.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("indexnow-submit error:", e);
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

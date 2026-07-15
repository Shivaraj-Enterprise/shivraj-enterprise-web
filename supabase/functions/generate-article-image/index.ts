import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "article-images";
// 10-year signed URL (~315M seconds)
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

type Aspect =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9";

interface Body {
  slug: string;
  section_key: string;
  prompt: string;
  aspect_ratio?: Aspect;
}

function slugSafe(s: string) {
  return s.replace(/[^a-z0-9-_]/gi, "-").toLowerCase().slice(0, 80);
}

async function callCloudflare(prompt: string, aspect_ratio: Aspect) {
  const accountId = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
  const token = Deno.env.get("CLOUDFLARE_API_TOKEN");
  if (!accountId || !token) throw new Error("Cloudflare credentials missing");

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/google/nano-banana-2-lite`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio,
      output_format: "jpg",
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Cloudflare ${res.status}: ${t.slice(0, 500)}`);
  }
  const json = await res.json();
  // Workers AI wraps model output in { result, success, errors, messages }
  const image: string | undefined = json?.result?.image ?? json?.image;
  if (!image) throw new Error(`No image in Cloudflare response: ${JSON.stringify(json).slice(0, 300)}`);
  return image;
}

function imageStringToBytes(image: string): { bytes: Uint8Array; contentType: string } {
  // Handle data URI, plain base64, or (unlikely) hex.
  let contentType = "image/jpeg";
  let b64 = image;
  const dataMatch = image.match(/^data:(image\/[a-z+.-]+);base64,(.+)$/i);
  if (dataMatch) {
    contentType = dataMatch[1];
    b64 = dataMatch[2];
  }
  // Strip whitespace/newlines
  b64 = b64.replace(/\s+/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, contentType };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Body;
    const slug = slugSafe(body.slug || "");
    const section_key = slugSafe(body.section_key || "");
    const prompt = (body.prompt || "").trim();
    const aspect_ratio: Aspect = body.aspect_ratio ?? "16:9";

    if (!slug || !section_key || !prompt) {
      return new Response(
        JSON.stringify({ error: "slug, section_key and prompt are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1) Cache lookup
    const { data: existing } = await supabase
      .from("article_images")
      .select("storage_path, image_url, url_expires_at")
      .eq("slug", slug)
      .eq("section_key", section_key)
      .maybeSingle();

    const now = Date.now();
    if (existing?.image_url) {
      const stillValid =
        !existing.url_expires_at || new Date(existing.url_expires_at).getTime() - now > 60_000;
      if (stillValid) {
        return new Response(JSON.stringify({ url: existing.image_url, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Refresh signed URL
      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(existing.storage_path, SIGNED_URL_TTL);
      if (!signErr && signed?.signedUrl) {
        const expires_at = new Date(now + SIGNED_URL_TTL * 1000).toISOString();
        await supabase
          .from("article_images")
          .update({ image_url: signed.signedUrl, url_expires_at: expires_at })
          .eq("slug", slug)
          .eq("section_key", section_key);
        return new Response(
          JSON.stringify({ url: signed.signedUrl, cached: true, refreshed: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // 2) Generate via Cloudflare
    const image = await callCloudflare(prompt, aspect_ratio);
    const { bytes, contentType } = imageStringToBytes(image);

    const ext = contentType.includes("png") ? "png" : "jpg";
    const storage_path = `${slug}/${section_key}-${Date.now()}.${ext}`;

    // 3) Upload
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storage_path, bytes, { contentType, upsert: true });
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

    // 4) Sign
    const { data: signed, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storage_path, SIGNED_URL_TTL);
    if (signErr || !signed?.signedUrl) throw new Error(`Signing failed: ${signErr?.message}`);

    const expires_at = new Date(now + SIGNED_URL_TTL * 1000).toISOString();

    // 5) Cache row
    await supabase.from("article_images").upsert(
      {
        slug,
        section_key,
        prompt,
        aspect_ratio,
        storage_path,
        image_url: signed.signedUrl,
        url_expires_at: expires_at,
      },
      { onConflict: "slug,section_key" },
    );

    return new Response(JSON.stringify({ url: signed.signedUrl, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("generate-article-image error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

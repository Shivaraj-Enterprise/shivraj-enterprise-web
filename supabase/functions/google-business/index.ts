import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { localSearchInsights } from "../_shared/local-search.ts";
import { validatePost, canRetry } from "./post-rules.ts";

const Body = z.object({
  action: z.enum(["status", "preview", "publish", "retry", "auto_publish", "search_insights"]),
  post_id: z.string().uuid().optional(), retry_id: z.string().uuid().optional(),
  content: z.string().max(1500).optional(), link: z.string().url().optional(), enabled: z.boolean().optional(),
});
const SITE = "https://shivraj-enterprise.lovable.app";
const LOCATION = "accounts/105859058877017554865/locations/3479985456859544818";
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
class ProviderError extends Error { constructor(public status: number, public details: string) { super(`Google ${status}: ${details}`); } }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  const url = Deno.env.get("SUPABASE_URL"), serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !serviceKey || !anonKey) return json({ error: "Publishing configuration unavailable" }, 503);
  const db = createClient(url, serviceKey);
  let internal = false;
  const secret = req.headers.get("x-internal-secret");
  if (secret) { const { data, error } = await db.rpc("get_monthly_report_secret"); internal = !error && typeof data === "string" && data.length > 0 && secret === data; }
  if (!internal) {
    const auth = req.headers.get("Authorization") ?? "";
    const client = createClient(url, anonKey, { global: { headers: { Authorization: auth } } });
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user || user.is_anonymous) return json({ error: "Administrator sign-in required" }, 401);
    const { data: admin } = await db.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (admin !== true) return json({ error: "Administrator access required" }, 403);
  }
  let input;
  try { input = Body.parse(await req.json()); } catch { return json({ error: "Invalid publishing request" }, 400); }
  if (internal && (input.action !== "publish" || !input.post_id)) return json({ error: "Scheduled calls may only publish an article" }, 403);
  const gatewayKey = Deno.env.get("LOVABLE_API_KEY"), connectionKey = Deno.env.get("GOOGLE_BUSINESS_PROFILE_API_KEY");
  const google = async (path: string, method = "GET", body?: unknown) => {
    if (!gatewayKey || !connectionKey) throw new Error("Google Business Profile is not connected");
    const response = await fetch(`https://connector-gateway.lovable.dev/google_business_profile${path}`, {
      method, headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new ProviderError(response.status, await response.text());
    return response.json();
  };
  let claimedId: string | null = null;
  let sent = false;
  try {
    const { data: settings, error: settingsError } = await db.from("google_business_settings").select("*").eq("id", "primary").maybeSingle();
    if (settingsError) throw settingsError;
    if (!settings) return json({ error: "Google Business settings are not configured" }, 503);
    if (input.action === "status") {
      const state = await google("/verifications/v1/locations/3479985456859544818/VoiceOfMerchantState");
      const { data: posts, error } = await db.from("google_business_posts").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return json({ settings, verified: state.hasVoiceOfMerchant === true, posts });
    }
    if (input.action === "search_insights") return json(await localSearchInsights());
    if (input.action === "auto_publish") {
      if (typeof input.enabled !== "boolean") return json({ error: "Choose enabled or disabled" }, 400);
      const { error } = await db.from("google_business_settings").update({ auto_publish: input.enabled, updated_at: new Date().toISOString() }).eq("id", "primary");
      if (error) throw error;
      return json({ ok: true });
    }
    if (internal && !settings.auto_publish) return json({ skipped: "Weekly Google updates are switched off" });
    let content = input.content ?? "", link = input.link ?? `${SITE}/labour-cost-calculator`, articleId = input.post_id;
    if (articleId) {
      const { data: post, error } = await db.from("blog_posts").select("id,title,excerpt,slug,published").eq("id", articleId).maybeSingle();
      if (error) throw error;
      if (!post?.published) return json({ error: "Published article not found" }, 404);
      link = `${SITE}/blog/${post.slug}`;
      if (!content || internal) content = `${post.title}\n\n${(post.excerpt ?? "").replace(/<[^>]*>/g, "").slice(0, 600)}\n\nFor factory owners, plant heads and HR teams across Vapi GIDC, Sarigam, Umbergaon, Silvassa and Daman.\n\nEstimate your labour budget: ${SITE}/labour-cost-calculator`;
    }
    if (input.action === "preview") return json({ content, link });
    if (input.action === "retry") {
      if (!input.retry_id) return json({ error: "Failed update required" }, 400);
      const { data: row, error } = await db.from("google_business_posts").select("*").eq("id", input.retry_id).maybeSingle();
      if (error) throw error;
      if (!row || !canRetry(row.status)) return json({ error: "Only updates explicitly rejected by Google can be retried" }, 409);
      const { data: claim, error: claimError } = await db.from("google_business_posts").update({ status: "publishing", error_message: null }).eq("id", row.id).eq("status", "failed").select("id").maybeSingle();
      if (claimError) throw claimError;
      if (!claim) return json({ skipped: "Retry already in progress" });
      claimedId = claim.id; content = row.content; link = row.link;
    }
    const valid = validatePost(content, link);
    if (!claimedId) {
      const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${valid.content}\n${valid.link}`));
      const dedupe = articleId ? `article:${articleId}` : [...new Uint8Array(hash)].map((n) => n.toString(16).padStart(2, "0")).join("");
      const { data: claim, error } = await db.from("google_business_posts").insert({ location_name: LOCATION, dedupe_key: dedupe, blog_post_id: articleId ?? null, content: valid.content, link: valid.link, status: "publishing", source: internal ? "auto" : "manual" }).select("id").single();
      if (error?.code === "23505") return json({ skipped: "This update has already been submitted or is in progress; check its history" });
      if (error) throw error;
      claimedId = claim.id;
    }
    sent = true;
    const post = await google(`/my_business/v4/${LOCATION}/localPosts`, "POST", { languageCode: "en", summary: valid.content, topicType: "STANDARD", callToAction: { actionType: "LEARN_MORE", url: valid.link } });
    const { error } = await db.from("google_business_posts").update({ status: post.state === "REJECTED" ? "failed" : "submitted", google_state: post.state ?? "PROCESSING", external_name: post.name, external_url: post.searchUrl ?? null, published_at: new Date().toISOString(), error_message: post.state === "REJECTED" ? "Google rejected this update" : null }).eq("id", claimedId);
    if (error) throw error;
    return json({ ok: true, state: post.state ?? "PROCESSING", url: post.searchUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("google-business:", message);
    // A lost response or 5xx may mean Google created the update: never replay automatically.
    const knownRejection = error instanceof ProviderError && error.status >= 400 && error.status < 500;
    if (claimedId) await db.from("google_business_posts").update({ status: !sent || knownRejection ? "failed" : "unknown", error_message: message.slice(0, 1500) }).eq("id", claimedId);
    return json({ error: message, ...(error instanceof ProviderError ? { status: error.status, details: error.details } : {}) }, error instanceof ProviderError ? error.status : claimedId ? 502 : 400);
  }
});
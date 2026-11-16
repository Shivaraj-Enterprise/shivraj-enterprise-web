// Publishes a LinkedIn post for a blog article on the connected company LinkedIn profile.
// Called by auto-generate-article after a Monday article is published (internal secret),
// or by an admin. Every attempt is logged in social_posts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const LINKEDIN_API_KEY = Deno.env.get("LINKEDIN_API_KEY");
const GW = "https://connector-gateway.lovable.dev/linkedin";
const SITE = "https://shivraj-enterprise.lovable.app";
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function isAuthorized(req: Request): Promise<boolean> {
  const provided = req.headers.get("x-internal-secret");
  if (provided) {
    const { data } = await supabase.rpc("get_monthly_report_secret");
    if (data && provided === data) return true;
  }
  const authz = req.headers.get("Authorization") ?? "";
  const token = authz.toLowerCase().startsWith("bearer ") ? authz.slice(7) : "";
  if (!token) return false;
  const uc = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: u } = await uc.auth.getUser();
  if (!u?.user?.id) return false;
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  return isAdmin === true;
}

async function writeCopy(title: string, excerpt: string, url: string): Promise<string> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You write LinkedIn posts for Shivraj Enterprise, a manpower supply and labour contractor (sole proprietorship, since 2016) in Vapi GIDC, Gujarat. Audience: factory owners, plant heads, HR managers. Plain text only, no markdown. Format: one bold-sounding hook line, a blank line, 3 short bullet lines starting with '•', a blank line, a call to read the article with the URL, a blank line, 4-6 hashtags including #VapiGIDC #LabourContractor #IndustrialStaffing. Max 1200 characters. Do not invent facts beyond the article summary." },
        { role: "user", content: `Article title: ${title}\nSummary: ${excerpt}\nURL: ${url}` },
      ],
    }),
  });
  if (!r.ok) throw new Error(`AI ${r.status}: ${await r.text()}`);
  const text = ((await r.json()).choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw new Error("AI returned empty post");
  return text.includes(url) ? text : `${text}\n\n${url}`;
}

async function publish(text: string, url: string, title: string, excerpt: string): Promise<string> {
  if (!LINKEDIN_API_KEY) throw new Error("LinkedIn is not connected");
  const h = { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": LINKEDIN_API_KEY };
  const me = await fetch(`${GW}/v2/userinfo`, { headers: h });
  if (!me.ok) throw new Error(`userinfo ${me.status}: ${await me.text()}`);
  const sub = (await me.json()).sub;
  const r = await fetch(`${GW}/v2/ugcPosts`, {
    method: "POST",
    headers: { ...h, "Content-Type": "application/json", "X-Restli-Protocol-Version": "2.0.0" },
    body: JSON.stringify({
      author: `urn:li:person:${sub}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: text.slice(0, 2900) },
          shareMediaCategory: "ARTICLE",
          media: [{ status: "READY", originalUrl: url, title: { text: title.slice(0, 200) }, description: { text: (excerpt || "").slice(0, 250) } }],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  if (!r.ok) throw new Error(`ugcPosts ${r.status}: ${await r.text()}`);
  return r.headers.get("x-restli-id") ?? (await r.json().catch(() => ({}))).id ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (!(await isAuthorized(req))) return json({ ok: false, error: "Unauthorized" }, 401);

  let body: { post_id?: string; source?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }
  if (!body.post_id || !/^[0-9a-f-]{36}$/i.test(body.post_id)) return json({ ok: false, error: "post_id required" }, 400);

  const { data: post } = await supabase.from("blog_posts").select("id, slug, title, excerpt, published").eq("id", body.post_id).maybeSingle();
  if (!post || !post.published) return json({ ok: false, error: "published post not found" }, 404);

  const { data: already } = await supabase.from("social_posts").select("id").eq("blog_post_id", post.id).eq("platform", "linkedin").eq("status", "published").maybeSingle();
  if (already) return json({ ok: true, skipped: "already posted" });

  const url = `${SITE}/blog/${post.slug}`;
  const source = body.source === "manual" ? "manual" : "auto";
  let content = "";
  try {
    content = await writeCopy(post.title, post.excerpt ?? "", url);
    const urn = await publish(content, url, post.title, post.excerpt ?? "");
    await supabase.from("social_posts").insert({ blog_post_id: post.id, content, article_url: url, status: "published", external_urn: urn, source, published_at: new Date().toISOString() });
    return json({ ok: true, urn });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("publish-linkedin failed:", msg);
    await supabase.from("social_posts").insert({ blog_post_id: post.id, content: content || post.title, article_url: url, status: "failed", error_message: msg.slice(0, 1000), source });
    return json({ ok: false, error: msg }, 502);
  }
});

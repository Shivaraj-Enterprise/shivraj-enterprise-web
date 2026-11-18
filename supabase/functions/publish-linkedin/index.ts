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

async function writeCopy(title: string, excerpt: string, url: string, custom = false): Promise<string> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You write LinkedIn posts for Shivraj Enterprise, a manpower supply and labour contractor (sole proprietorship, since 2016) in Vapi GIDC, Gujarat. Audience: factory owners, plant heads, HR managers. Plain text only, no markdown. Format: one bold-sounding hook line, a blank line, 3 short bullet lines starting with '•', a blank line, a call to read the article with the URL, one line inviting plant managers to estimate their monthly labour budget with the free calculator at https://shivraj-enterprise.lovable.app/labour-cost-calculator, a blank line, 4-6 hashtags including #VapiGIDC #LabourContractor #IndustrialStaffing. Max 1200 characters. Do not invent facts beyond the article summary." },
        { role: "user", content: custom ? `Write a practical post on this topic for factory decision-makers: ${title}\n${excerpt ? `Notes: ${excerpt}\n` : ""}Link to include: ${url}` : `Article title: ${title}\nSummary: ${excerpt}\nURL: ${url}` },
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

  let body: { post_id?: string; source?: string; retry_of?: string; action?: string; topic?: string; notes?: string; link?: string; content?: string; draft_id?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }
  const uuid = /^[0-9a-f-]{36}$/i;
  if (body.action) return studio(body);
  if (body.retry_of && !uuid.test(body.retry_of)) return json({ ok: false, error: "invalid retry_of" }, 400);

  // Retrying a failed attempt: resolve the article from the failed row.
  let retryRow: { id: string; blog_post_id: string | null; status: string } | null = null;
  if (body.retry_of) {
    const { data } = await supabase.from("social_posts").select("id, blog_post_id, status").eq("id", body.retry_of).maybeSingle();
    if (!data) return json({ ok: false, error: "post not found" }, 404);
    if (data.status !== "failed") return json({ ok: false, error: `only failed posts can be retried (status: ${data.status})` }, 409);
    retryRow = data;
    body.post_id = data.blog_post_id ?? undefined;
    body.source = "manual";
  }
  if (!body.post_id || !uuid.test(body.post_id)) return json({ ok: false, error: "post_id required" }, 400);

  const { data: post } = await supabase.from("blog_posts").select("id, slug, title, excerpt, published").eq("id", body.post_id).maybeSingle();
  if (!post || !post.published) return json({ ok: false, error: "published post not found" }, 404);

  const url = `${SITE}/blog/${post.slug}`;
  const source = body.source === "manual" ? "manual" : "auto";

  // Duplicate guard: a unique index allows only one 'publishing' or 'published' row per article.
  let rowId: string;
  if (retryRow) {
    const { data: claimed, error } = await supabase.from("social_posts")
      .update({ status: "publishing", error_message: null, source }).eq("id", retryRow.id).eq("status", "failed").select("id").maybeSingle();
    if (error?.code === "23505") return json({ ok: true, skipped: "already posted or in progress" });
    if (error) return json({ ok: false, error: error.message }, 500);
    if (!claimed) return json({ ok: true, skipped: "retry already in progress" });
    rowId = claimed.id;
  } else {
    const { data: claimed, error } = await supabase.from("social_posts")
      .insert({ blog_post_id: post.id, content: post.title, article_url: url, status: "publishing", source }).select("id").single();
    if (error?.code === "23505") return json({ ok: true, skipped: "already posted or in progress" });
    if (error) return json({ ok: false, error: error.message }, 500);
    rowId = claimed.id;
  }

  let content = "";
  try {
    content = await writeCopy(post.title, post.excerpt ?? "", url);
    const urn = await publish(content, url, post.title, post.excerpt ?? "");
    await supabase.from("social_posts").update({ content, status: "published", external_urn: urn, published_at: new Date().toISOString() }).eq("id", rowId);
    return json({ ok: true, urn });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("publish-linkedin failed:", msg);
    await supabase.from("social_posts").update({ content: content || post.title, status: "failed", error_message: msg.slice(0, 1000) }).eq("id", rowId);
    return json({ ok: false, error: msg }, 502);
  }
});

// ---- Phase 2: Social Studio composer (generate, drafts, custom publish) ----
const okLink = (l?: string) => { try { const u = new URL(l ?? ""); return u.protocol === "https:" ? u.toString() : null; } catch { return null; } };

async function studio(b: { action?: string; post_id?: string; topic?: string; notes?: string; link?: string; content?: string; draft_id?: string }) {
  const uuid = /^[0-9a-f-]{36}$/i;
  const link = b.link ? okLink(b.link) : null;
  if (b.link && !link) return json({ ok: false, error: "link must be an https URL" }, 400);
  if (b.draft_id && !uuid.test(b.draft_id)) return json({ ok: false, error: "invalid draft_id" }, 400);
  const content = (b.content ?? "").trim();

  if (b.action === "generate") {
    try {
      if (b.post_id) {
        if (!uuid.test(b.post_id)) return json({ ok: false, error: "invalid post_id" }, 400);
        const { data: post } = await supabase.from("blog_posts").select("slug, title, excerpt, published").eq("id", b.post_id).maybeSingle();
        if (!post?.published) return json({ ok: false, error: "published post not found" }, 404);
        const url = `${SITE}/blog/${post.slug}`;
        return json({ ok: true, content: await writeCopy(post.title, post.excerpt ?? "", url), link: url });
      }
      const topic = (b.topic ?? "").trim().slice(0, 300);
      if (!topic) return json({ ok: false, error: "topic or article required" }, 400);
      const url = link ?? `${SITE}/labour-cost-calculator`;
      return json({ ok: true, content: await writeCopy(topic, (b.notes ?? "").slice(0, 1000), url, true), link: url });
    } catch (e) { return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 502); }
  }

  if (b.action === "save_draft") {
    if (!content || content.length > 2900) return json({ ok: false, error: "post text must be 1-2900 characters" }, 400);
    const row = { content, article_url: link, status: "draft", source: "manual", platform: "linkedin" };
    const q = b.draft_id
      ? supabase.from("social_posts").update(row).eq("id", b.draft_id).eq("status", "draft").select("id").maybeSingle()
      : supabase.from("social_posts").insert(row).select("id").single();
    const { data, error } = await q;
    if (error) return json({ ok: false, error: error.message }, 500);
    if (!data) return json({ ok: false, error: "draft not found" }, 404);
    return json({ ok: true, id: data.id });
  }

  if (b.action === "delete_draft") {
    if (!b.draft_id) return json({ ok: false, error: "draft_id required" }, 400);
    const { error } = await supabase.from("social_posts").delete().eq("id", b.draft_id).eq("status", "draft");
    return error ? json({ ok: false, error: error.message }, 500) : json({ ok: true });
  }

  if (b.action === "publish_custom") {
    if (!content || content.length > 2900) return json({ ok: false, error: "post text must be 1-2900 characters" }, 400);
    let rowId: string;
    if (b.draft_id) {
      // Atomic claim: only one click can move a draft to publishing.
      const { data } = await supabase.from("social_posts").update({ content, article_url: link, status: "publishing", error_message: null })
        .eq("id", b.draft_id).eq("status", "draft").select("id").maybeSingle();
      if (!data) return json({ ok: true, skipped: "draft already published or in progress" });
      rowId = data.id;
    } else {
      const { data, error } = await supabase.from("social_posts").insert({ content, article_url: link, status: "publishing", source: "manual", platform: "linkedin" }).select("id").single();
      if (error) return json({ ok: false, error: error.message }, 500);
      rowId = data.id;
    }
    try {
      const urn = await publishText(content, link);
      await supabase.from("social_posts").update({ status: "published", external_urn: urn, published_at: new Date().toISOString() }).eq("id", rowId);
      return json({ ok: true, urn });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabase.from("social_posts").update({ status: "failed", error_message: msg.slice(0, 1000) }).eq("id", rowId);
      return json({ ok: false, error: msg }, 502);
    }
  }
  return json({ ok: false, error: "unknown action" }, 400);
}

async function publishText(text: string, link: string | null): Promise<string> {
  if (!LINKEDIN_API_KEY) throw new Error("LinkedIn is not connected");
  const h = { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": LINKEDIN_API_KEY };
  const me = await fetch(`${GW}/v2/userinfo`, { headers: h });
  if (!me.ok) throw new Error(`userinfo ${me.status}: ${await me.text()}`);
  const sub = (await me.json()).sub;
  const share: Record<string, unknown> = { shareCommentary: { text: text.slice(0, 2900) }, shareMediaCategory: link ? "ARTICLE" : "NONE" };
  if (link) share.media = [{ status: "READY", originalUrl: link }];
  const r = await fetch(`${GW}/v2/ugcPosts`, {
    method: "POST",
    headers: { ...h, "Content-Type": "application/json", "X-Restli-Protocol-Version": "2.0.0" },
    body: JSON.stringify({ author: `urn:li:person:${sub}`, lifecycleState: "PUBLISHED", specificContent: { "com.linkedin.ugc.ShareContent": share }, visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" } }),
  });
  if (!r.ok) throw new Error(`ugcPosts ${r.status}: ${await r.text()}`);
  return r.headers.get("x-restli-id") ?? (await r.json().catch(() => ({}))).id ?? "";
}

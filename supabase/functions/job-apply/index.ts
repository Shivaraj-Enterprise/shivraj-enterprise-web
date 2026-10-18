import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { Resend } from "npm:resend@2.0.0";
import { z } from "npm:zod@3.25.76";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const OWNER = "shivrajenterprise1234@gmail.com";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const Schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  role: z.string().trim().min(2).max(100),
  skill_level: z.enum(["Skilled", "Semi-Skilled", "Unskilled"]),
  experience_years: z.string().trim().max(20).optional().or(z.literal("")),
  qualification: z.string().trim().max(100).optional().or(z.literal("")),
  current_location: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const ALLOWED = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg", "image/png", "image/webp"];
const EXT: Record<string, string> = { "application/pdf": "pdf", "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const hits = new Map<string, { n: number; t: number }>();
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const now = Date.now(); const h = hits.get(ip);
  if (h && h.t > now) { if (h.n >= 5) return json({ error: "Too many applications, try later" }, 429); h.n++; }
  else hits.set(ip, { n: 1, t: now + 3600_000 });

  try {
    const form = await req.formData();
    const raw: Record<string, string> = {};
    for (const k of Object.keys(Schema.shape)) raw[k] = String(form.get(k) ?? "");
    const parsed = Schema.safeParse(raw);
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const d = parsed.data;

    let cv_path: string | null = null;
    const file = form.get("cv");
    if (file instanceof File && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) return json({ error: "CV must be under 5 MB" }, 400);
      if (!ALLOWED.includes(file.type)) return json({ error: "CV must be PDF, Word or a photo" }, 400);
      cv_path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${EXT[file.type]}`;
      const { error } = await admin.storage.from("job-cvs").upload(cv_path, file, { contentType: file.type });
      if (error) throw new Error(`CV upload failed: ${error.message}`);
    }

    const row = { ...d, whatsapp: d.whatsapp || null, email: d.email || null,
      experience_years: d.experience_years || null, qualification: d.qualification || null,
      current_location: d.current_location || null, message: d.message || null, cv_path };
    const { data: ins, error: insErr } = await admin.from("job_applications").insert(row).select("id").single();
    if (insErr) throw new Error(insErr.message);

    let cvLink = "";
    if (cv_path) {
      const { data: s } = await admin.storage.from("job-cvs").createSignedUrl(cv_path, 7 * 24 * 3600);
      if (s?.signedUrl) cvLink = `<p><a href="${esc(s.signedUrl)}">Download CV</a> (link valid 7 days; also in admin → Job Applications)</p>`;
    }
    const rows = [["Name", d.name], ["Phone", d.phone], ["WhatsApp", d.whatsapp], ["Email", d.email],
      ["Role", d.role], ["Skill level", d.skill_level], ["Experience (years)", d.experience_years],
      ["Qualification", d.qualification], ["Location", d.current_location], ["Message", d.message]]
      .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v || "-")}</td></tr>`).join("");
    try {
      const r = await resend.emails.send({
        from: "Shivraj Enterprise <onboarding@resend.dev>", to: [OWNER],
        subject: `New job application: ${d.role} – ${d.name}`.slice(0, 150),
        html: `<h2>New job application</h2><table cellpadding="6">${rows}</table>${cvLink || "<p>No CV attached.</p>"}`,
      });
      if (!r.error) await admin.from("job_applications").update({ email_sent: true }).eq("id", ins.id);
      else console.error("Email failed", r.error);
    } catch (e) { console.error("Email error", e); }

    return json({ ok: true, id: ins.id });
  } catch (e) {
    console.error(e);
    return json({ error: "Could not submit application" }, 500);
  }
});

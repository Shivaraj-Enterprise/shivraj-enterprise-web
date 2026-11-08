import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

import { contactColumns, jobColumns, leadColumns, reportPeriod, splitLeads, toCsv, type ReportRow } from "./report.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RECIPIENT = "shivrajenterprise1234@gmail.com";
const FROM = "Shivraj Reports <onboarding@resend.dev>";

const escHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] ?? char));
const attachment = (name: string, rows: ReportRow[], columns: string[]) => ({
  filename: name,
  content: btoa(Array.from(new TextEncoder().encode(toCsv(rows, columns)), byte => String.fromCharCode(byte)).join("")),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Shared-secret auth: required for all non-OPTIONS requests.
  // The expected value is stored in Vault and read via a service-role RPC.
  const authClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const { data: expected, error: secretErr } = await authClient.rpc("get_monthly_report_secret");
  const provided = req.headers.get("x-report-secret");
  if (secretErr || !expected || !provided || provided !== expected) {
    if (secretErr) console.error("monthly-report secret lookup failed", secretErr);
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    let period;
    try {
      period = reportPeriod(new Date(), url.searchParams.get("from"), url.searchParams.get("to"));
    } catch {
      return new Response(JSON.stringify({ success: false, error: "Invalid date range" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { from, to, start, end } = period;
    const supabase = authClient;
    // Page through every source; the API's default row limit must not truncate reports.
    const readAll = async (table: string, columns: string): Promise<ReportRow[]> => {
      const rows: ReportRow[] = [];
      for (let offset = 0; ; offset += 1000) {
        const { data, error } = await supabase.from(table).select(columns)
          .gte("created_at", start).lt("created_at", end)
          .order("created_at", { ascending: false }).order("id", { ascending: false })
          .range(offset, offset + 999);
        if (error) throw error;
        const page = (data ?? []) as unknown as ReportRow[];
        rows.push(...page);
        if (page.length < 1000) return rows;
      }
    };
    const [contacts, jobs, leads] = await Promise.all([
      readAll("contact_submissions", contactColumns.join(",")),
      readAll("job_applications", jobColumns.filter(column => column !== "cv_download_url").join(",")),
      readAll("leads", leadColumns.join(",")),
    ]);
    const { profiles, chats, other } = splitLeads(leads);
    const cvFailures: string[] = [];
    // Private CVs stay private; each report provides a seven-day download link.
    for (const job of jobs) {
      if (typeof job.cv_path !== "string" || !job.cv_path) continue;
      const { data, error } = await supabase.storage.from("job-cvs").createSignedUrl(job.cv_path, 7 * 24 * 60 * 60);
      if (error) cvFailures.push(String(job.id));
      else job.cv_download_url = data?.signedUrl ?? "";
    }
    const attachments = [
      attachment(`contact_enquiries_${from}.csv`, contacts, contactColumns),
      attachment(`job_applications_${from}.csv`, jobs, jobColumns),
      attachment(`company_profile_requests_${from}.csv`, profiles, leadColumns),
      attachment(`ai_chat_leads_${from}.csv`, chats, leadColumns),
      ...(other.length ? [attachment(`other_leads_${from}.csv`, other, leadColumns)] : []),
    ];
    const total = contacts.length + jobs.length + leads.length;
    const breakdown = (rows: ReportRow[], key: string) => {
      const counts: Record<string, number> = {};
      rows.forEach(row => { const label = String(row[key] ?? "Not specified"); counts[label] = (counts[label] ?? 0) + 1; });
      return Object.entries(counts).map(([label, count]) => `${escHtml(label)}: ${count}`).join(", ") || "None";
    };
    const html = `
      <h2>Shivraj Enterprise — Monthly Activity Report</h2>
      <p><strong>Period:</strong> ${from} to ${to} (end date excluded; India time)</p>
      <p><strong>Total saved submissions:</strong> ${total}</p>
      <ul>
        <li>Contact enquiries: ${contacts.length}</li>
        <li>Job applications: ${jobs.length}</li>
        <li>Company-profile requests: ${profiles.length}</li>
        <li>Saved AI-chat leads: ${chats.length}</li>
        <li>AI-chat handoffs: ${chats.filter(row => row.handoff === true).length} (included above)</li>
        ${other.length ? `<li>Other leads: ${other.length}</li>` : ""}
      </ul>
      <p><strong>Enquiry types:</strong> ${breakdown(contacts, "inquiry_type")}</p>
      <p><strong>Jobs by role:</strong> ${breakdown(jobs, "role")}</p>
      <p><strong>Jobs by skill level:</strong> ${breakdown(jobs, "skill_level")}</p>
      <p>The attached spreadsheets contain all saved form details, manpower requirements, notes and recorded AI conversations.</p>
      <p>Company-profile figures count submitted download requests, not confirmed file downloads. AI figures include saved leads only, not every chat visitor. Counts are submissions, not unique people.</p>
      <p>CV download links expire seven days after this report. CV files remain available in the owner job-applications page.</p>
      ${cvFailures.length ? `<p>CV links could not be created for ${cvFailures.length} applications. Use the owner job-applications page.</p>` : ""}
      <p>Monthly cycle: the 1st of each month at 8:30 a.m. India time, covering the previous calendar month.</p>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY missing");

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [RECIPIENT],
        subject: `Monthly Report — ${from} to ${to} (${total} submissions)`,
        html,
        attachments,
      }),
    });

    const emailJson = await emailRes.json();
    if (!emailRes.ok) {
      console.error("monthly-report resend error", emailRes.status, emailJson);
      throw new Error("Email delivery failed");
    }

    return new Response(
      JSON.stringify({ success: true, email_id: emailJson.id, counts: { contacts: contacts.length, jobs: jobs.length, profiles: profiles.length, chats: chats.length, other: other.length }, period: { from, to } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("monthly-report error", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

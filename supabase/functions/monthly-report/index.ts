import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RECIPIENT = "shivrajenterprise1234@gmail.com";
const FROM = "Shivraj Reports <onboarding@resend.dev>";

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "No submissions for this period.\n";
  const headers = ["created_at", "name", "email", "phone", "whatsapp", "inquiry_type", "message", "email_sent"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(","));
  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    // Optional overrides for manual runs: ?from=YYYY-MM-DD&to=YYYY-MM-DD
    const now = new Date();
    const defaultTo = new Date(now.getFullYear(), now.getMonth(), 1); // first of current month
    const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1); // first of previous month
    const from = url.searchParams.get("from") ?? defaultFrom.toISOString().slice(0, 10);
    const to = url.searchParams.get("to") ?? defaultTo.toISOString().slice(0, 10);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("created_at,name,email,phone,whatsapp,inquiry_type,message,email_sent")
      .gte("created_at", `${from}T00:00:00.000Z`)
      .lt("created_at", `${to}T00:00:00.000Z`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const csv = toCsv((data ?? []) as Record<string, unknown>[]);
    const filename = `submissions_${from}_to_${to}.csv`;
    const base64 = btoa(unescape(encodeURIComponent(csv)));

    const counts: Record<string, number> = {};
    (data ?? []).forEach((r: any) => { counts[r.inquiry_type] = (counts[r.inquiry_type] ?? 0) + 1; });
    const summary = Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(", ") || "none";

    const html = `
      <h2>Monthly Submissions Report</h2>
      <p><strong>Period:</strong> ${from} → ${to}</p>
      <p><strong>Total submissions:</strong> ${data?.length ?? 0}</p>
      <p><strong>Breakdown:</strong> ${summary}</p>
      <p>The full CSV is attached.</p>
      <hr/>
      <p style="color:#888;font-size:12px">Shivraj Enterprise Pvt. Ltd. — automated report</p>
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
        subject: `Monthly Report — ${from} to ${to} (${data?.length ?? 0} submissions)`,
        html,
        attachments: [{ filename, content: base64 }],
      }),
    });

    const emailJson = await emailRes.json();
    if (!emailRes.ok) throw new Error(`Resend error: ${JSON.stringify(emailJson)}`);

    return new Response(
      JSON.stringify({ success: true, count: data?.length ?? 0, from, to, email: emailJson }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("monthly-report error", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

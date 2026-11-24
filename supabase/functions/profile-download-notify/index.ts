import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendLeadAlert } from "../_shared/lead-alert.ts";
import { sendCustomerConfirmation } from "../_shared/gmail.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DownloadRequest {
  company: string;
  email: string;
  phone: string;
  whatsapp?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s: string): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DownloadRequest = await req.json();

    if (!data.company || !data.email || !data.phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (
      typeof data.company !== "string" ||
      typeof data.email !== "string" ||
      typeof data.phone !== "string" ||
      (data.whatsapp !== undefined && typeof data.whatsapp !== "string")
    ) {
      return new Response(JSON.stringify({ error: "Invalid field types" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (
      data.company.length > 150 ||
      data.email.length > 255 ||
      data.phone.length > 30 ||
      (data.whatsapp ?? "").length > 30 ||
      !EMAIL_REGEX.test(data.email)
    ) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const whatsapp = data.whatsapp?.trim() || "Not provided";

    // Save lead so we never lose it even if email fails
    const { data: lead, error: insertError } = await supabaseAdmin.from("leads").insert({
      company_name: data.company,
      email: data.email,
      mobile: data.phone,
      source: "company-profile-download",
      notes: `Company profile download request. WhatsApp: ${whatsapp}`,
    }).select("id").single();

    if (insertError) {
      console.error("Lead insert error:", insertError);
      return new Response(JSON.stringify({ error: "Could not save your details. Please try again." }), {
        status: 503, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">New Company Profile Download</h1>
        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>🏢 Company:</strong> ${esc(data.company)}</p>
          <p style="margin: 10px 0;"><strong>📧 Email:</strong> ${esc(data.email)}</p>
          <p style="margin: 10px 0;"><strong>📞 Phone:</strong> ${esc(data.phone)}</p>
          <p style="margin: 10px 0;"><strong>💬 WhatsApp:</strong> ${esc(whatsapp)}</p>
        </div>
        <div style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          Automated notification from the Shivraj Enterprise website.
        </div>
      </div>
    `;

    const emailResponse = await sendLeadAlert({
      id: lead.id,
      subject: `📥 Company profile request — ${data.company}`.slice(0, 150),
      html: emailHtml,
      replyTo: data.email,
    });

    // One automatic reply per email address per day, so the form can't be used to spam anyone.
    const { count: recent } = await supabaseAdmin.from("leads").select("id", { count: "exact", head: true })
      .ilike("email", data.email).gte("created_at", new Date(Date.now() - 864e5).toISOString());
    const confirmation = (recent ?? 0) <= 1
      ? await sendCustomerConfirmation({ to: data.email, name: data.company, kind: "profile" })
      : { status: "skipped" };

    const { error: statusError } = await supabaseAdmin.from("leads").update({
      notes: `Company profile download request. WhatsApp: ${whatsapp}\nEmail alert: ${emailResponse.status}\nCustomer reply: ${confirmation.status}`,
    }).eq("id", lead.id);
    if (statusError) console.error("Could not record profile alert status:", statusError.message);

    return new Response(JSON.stringify({ success: true, id: lead.id, alert_status: emailResponse.status }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in profile-download-notify:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

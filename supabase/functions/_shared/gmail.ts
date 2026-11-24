// Sends email from the business Gmail (shivrajenterprise1234@gmail.com) through the connector gateway.
const GMAIL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const b64 = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);
const clean = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

export async function sendGmail(input: { to: string; subject: string; html: string; replyTo?: string }) {
  const lovKey = Deno.env.get("LOVABLE_API_KEY");
  const gmailKey = Deno.env.get("GOOGLE_MAIL_API_KEY");
  if (!lovKey || !gmailKey) return { status: "failed", error: "Gmail credentials missing" };
  const raw = [
    `From: ${header("Shivraj Enterprise")} <shivrajenterprise1234@gmail.com>`,
    `To: ${clean(input.to)}`,
    ...(input.replyTo ? [`Reply-To: ${clean(input.replyTo)}`] : []),
    `Subject: ${header(clean(input.subject))}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64(input.html),
  ].join("\r\n");
  try {
    const r = await fetch(`${GMAIL}/users/me/messages/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${lovKey}`, "X-Connection-Api-Key": gmailKey, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: b64(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") }),
    });
    if (!r.ok) {
      console.error(`Gmail send failed [${r.status}]: ${await r.text()}`);
      return { status: "failed", error: `Gmail returned ${r.status}` };
    }
    return { status: "accepted" };
  } catch {
    return { status: "unknown", error: "Gmail acceptance could not be confirmed" };
  }
}

const esc = (s: string) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));

// Instant "we got your request" reply to the customer, sent from the business Gmail so they can reply directly.
export function sendCustomerConfirmation(input: { to: string; name: string; kind: "quote" | "service" | "job" | "other" | "profile" }) {
  const lines: Record<string, string> = {
    quote: "Thank you for your quotation request. Our team will review your manpower requirement and get back to you with a detailed quote, usually within a few working hours.",
    service: "Thank you for your enquiry about our manpower services. Our team will contact you shortly to understand your requirement.",
    job: "Thank you for your interest in working with us. Our team will review your details and contact you when a suitable opening is available.",
    other: "Thank you for contacting us. Our team will get back to you shortly.",
    profile: "Thank you for downloading our company profile. If you need manpower for your factory or warehouse, simply reply to this email and we will share a quotation.",
  };
  const html = `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:600px">
<p>Dear ${esc(input.name)},</p>
<p>${lines[input.kind]}</p>
<p>For a faster response, call or WhatsApp us at <a href="tel:+919998498311">+91 99984 98311</a> or <a href="https://wa.me/919998498311">chat on WhatsApp</a>.</p>
<p>Regards,<br/><b>Shivraj Enterprise</b><br/>Manpower Supply &amp; Labour Contractor since 2016<br/>Vapi, Gujarat &middot; <a href="https://shivraj-enterprise.lovable.app/">shivraj-enterprise.lovable.app</a></p>
</div>`;
  const subject = input.kind === "profile" ? "Shivraj Enterprise - Company Profile" : "We received your request - Shivraj Enterprise";
  return sendGmail({ to: input.to, subject, html });
}

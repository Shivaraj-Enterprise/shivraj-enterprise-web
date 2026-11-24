import { sendGmail } from "./gmail.ts";

// Owner alert: Resend first (idempotent per lead); if Resend rejects it, fall back to the business Gmail.
export async function sendLeadAlert(input: { id: string; subject: string; html: string; replyTo: string }) {
  const first = await sendViaResend(input);
  if (first.status !== "failed") return first;
  const fallback = await sendGmail({ to: "shivrajenterprise1234@gmail.com", subject: input.subject, html: input.html, replyTo: input.replyTo });
  return fallback.status === "accepted" ? fallback : first;
}

async function sendViaResend(input: { id: string; subject: string; html: string; replyTo: string }) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { status: "failed", error: "Email credentials missing" };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `lead-alert-${input.id}` },
      body: JSON.stringify({ from: "Shivraj Enterprise <onboarding@resend.dev>", to: ["shivrajenterprise1234@gmail.com"],
        subject: input.subject, html: input.html, reply_to: input.replyTo }),
    });
    if (!response.ok) {
      const details = await response.text();
      console.error(`Lead alert rejected [${response.status}]: ${details}`);
      return { status: "failed", error: `Email provider returned ${response.status}` };
    }
    return { status: "accepted" };
  } catch {
    return { status: "unknown", error: "Email acceptance could not be confirmed" };
  }
}
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  inquiryType: "service" | "job" | "quote" | "other";
  message: string;
}

const ALLOWED_INQUIRY_TYPES = ["service", "job", "quote", "other"] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Escape HTML special characters to prevent HTML injection in email body
const esc = (s: string): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// In-memory rate limit (per isolate). Limits abuse from a single IP.
const RATE_LIMIT_MAX = 5; // requests
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
};

const getClientIp = (req: Request): string => {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "unknown";
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit per IP
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const formData: ContactFormRequest = await req.json();

    // Required fields
    if (
      !formData.name || !formData.email || !formData.phone ||
      !formData.inquiryType || !formData.message
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Type checks
    if (
      typeof formData.name !== "string" ||
      typeof formData.email !== "string" ||
      typeof formData.phone !== "string" ||
      typeof formData.message !== "string" ||
      typeof formData.inquiryType !== "string" ||
      (formData.whatsapp !== undefined && typeof formData.whatsapp !== "string")
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid field types" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Length limits
    if (
      formData.name.length > 100 ||
      formData.email.length > 255 ||
      formData.phone.length > 30 ||
      (formData.whatsapp ?? "").length > 30 ||
      formData.message.length > 2000
    ) {
      return new Response(
        JSON.stringify({ error: "One or more fields exceed maximum length" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Email format
    if (!EMAIL_REGEX.test(formData.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Enum validation
    if (!ALLOWED_INQUIRY_TYPES.includes(formData.inquiryType as typeof ALLOWED_INQUIRY_TYPES[number])) {
      return new Response(
        JSON.stringify({ error: "Invalid inquiry type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const inquiryTypeLabels: Record<string, string> = {
      service: "Service Inquiry",
      job: "Job Application",
      quote: "Quote Request",
      other: "Other Inquiry",
    };

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">New Contact Form Submission</h1>
        
        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>👤 Full Name:</strong> ${esc(formData.name)}</p>
          <p style="margin: 10px 0;"><strong>📧 Email Address:</strong> ${esc(formData.email)}</p>
          <p style="margin: 10px 0;"><strong>📞 Phone Number:</strong> ${esc(formData.phone)}</p>
          ${formData.whatsapp ? `<p style="margin: 10px 0;"><strong>💬 WhatsApp Number:</strong> ${esc(formData.whatsapp)}</p>` : ''}
          <p style="margin: 10px 0;"><strong>📌 Inquiry Type:</strong> ${esc(inquiryTypeLabels[formData.inquiryType])}</p>
        </div>

        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">📝 Message:</h3>
          <p style="white-space: pre-line;">${esc(formData.message)}</p>
        </div>

        <div style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          This is an automated message from the Shivraj Enterprise website contact form. 
          Please do not reply to this email directly.
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Shivraj Enterprise <onboarding@resend.dev>",
      to: ["shivrajenterprise1234@gmail.com"],
      subject: "📩 New Contact Us Message - SHIVRAJ Website",
      html: emailHtml,
      reply_to: formData.email,
    });

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact form submitted successfully",
        data: emailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: unknown) {
    console.error("Error in contact-us function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);

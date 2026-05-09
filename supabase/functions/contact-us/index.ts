
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormRequest = await req.json();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.inquiryType || !formData.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Set up inquiry type label mapping
    const inquiryTypeLabels = {
      service: "Service Inquiry",
      job: "Job Application",
      quote: "Quote Request",
      other: "Other Inquiry"
    };

    // Create email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">New Contact Form Submission</h1>
        
        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>👤 Full Name:</strong> ${formData.name}</p>
          <p style="margin: 10px 0;"><strong>📧 Email Address:</strong> ${formData.email}</p>
          <p style="margin: 10px 0;"><strong>📞 Phone Number:</strong> ${formData.phone}</p>
          ${formData.whatsapp ? `<p style="margin: 10px 0;"><strong>💬 WhatsApp Number:</strong> ${formData.whatsapp}</p>` : ''}
          <p style="margin: 10px 0;"><strong>📌 Inquiry Type:</strong> ${inquiryTypeLabels[formData.inquiryType]}</p>
        </div>

        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">📝 Message:</h3>
          <p style="white-space: pre-line;">${formData.message}</p>
        </div>

        <div style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          This is an automated message from the Shivraj Enterprise website contact form. 
          Please do not reply to this email directly.
        </div>
      </div>
    `;

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Shivraj Enterprise <onboarding@resend.dev>", // Default sender from Resend
      to: ["shivrajenterprise1234@gmail.com"], // Recipient email
      subject: "📩 New Contact Us Message - SHIVRAJ Website",
      html: emailHtml,
      reply_to: formData.email, // Set reply-to as the submitter's email
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact form submitted successfully",
        data: emailResponse
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in contact-us function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

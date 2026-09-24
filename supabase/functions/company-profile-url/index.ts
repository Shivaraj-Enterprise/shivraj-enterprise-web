import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await admin.storage.from("company-assets").createSignedUrl("company-profile.pdf", 60 * 60);
  return new Response(JSON.stringify(error ? { error: error.message } : { url: data.signedUrl }), {
    status: error ? 500 : 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

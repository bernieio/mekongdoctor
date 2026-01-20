import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SaveApplicationRequest {
  clerkUserId: string;
  applicationType: "scholarship" | "loan" | "venture";
  fullName?: string;
  email?: string;
  phone: string;
  businessName?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: SaveApplicationRequest = await req.json();
    const { clerkUserId, applicationType, fullName, email, phone, businessName } = body;

    console.log("Saving community application:", { clerkUserId, applicationType });

    // Validate required fields
    if (!clerkUserId || !applicationType || !phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get profile_id from clerk_user_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (profileError || !profile) {
      console.error("Profile not found:", profileError);
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;

    switch (applicationType) {
      case "scholarship":
        if (!fullName || !email) {
          return new Response(
            JSON.stringify({ error: "Full name and email required for scholarship" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await supabase
          .from("scholarship_applications")
          .insert({
            user_id: profile.id,
            full_name: fullName,
            email: email,
            phone: phone,
          })
          .select()
          .single();
        break;

      case "loan":
        if (!fullName) {
          return new Response(
            JSON.stringify({ error: "Full name required for loan application" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await supabase
          .from("loan_applications")
          .insert({
            user_id: profile.id,
            full_name: fullName,
            phone: phone,
          })
          .select()
          .single();
        break;

      case "venture":
        if (!businessName) {
          return new Response(
            JSON.stringify({ error: "Business name required for venture application" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await supabase
          .from("venture_applications")
          .insert({
            user_id: profile.id,
            business_name: businessName,
            phone: phone,
          })
          .select()
          .single();
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid application type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (result.error) {
      console.error("Insert error:", result.error);
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Application saved successfully:", result.data);

    return new Response(
      JSON.stringify({ success: true, application: result.data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving application:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

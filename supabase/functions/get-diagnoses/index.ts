import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GetDiagnosesRequest {
  clerkUserId: string;
  limit?: number;
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

    const body: GetDiagnosesRequest = await req.json();
    const { clerkUserId, limit = 20 } = body;

    console.log("Fetching diagnoses for user:", clerkUserId);

    if (!clerkUserId) {
      return new Response(
        JSON.stringify({ error: "clerkUserId is required" }),
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
        JSON.stringify({ diagnoses: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch diagnoses for this user
    const { data: diagnoses, error: diagnosesError } = await supabase
      .from("diagnoses")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (diagnosesError) {
      console.error("Error fetching diagnoses:", diagnosesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch diagnoses" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${diagnoses?.length || 0} diagnoses for user`);

    return new Response(
      JSON.stringify({ diagnoses: diagnoses || [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-diagnoses:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

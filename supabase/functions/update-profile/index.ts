import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateProfileRequest {
  clerkUserId: string;
  full_name?: string;
  phone?: string;
  province?: string;
  district?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: UpdateProfileRequest = await req.json();

    if (!body.clerkUserId) {
      return new Response(
        JSON.stringify({ error: "clerk_user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update profile
    const updateData: Record<string, string | undefined> = {};
    if (body.full_name !== undefined) updateData.full_name = body.full_name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.province !== undefined) updateData.province = body.province;
    if (body.district !== undefined) updateData.district = body.district;

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("clerk_user_id", body.clerkUserId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ profile }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

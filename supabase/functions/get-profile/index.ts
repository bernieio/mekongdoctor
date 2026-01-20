import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const GetProfileSchema = z.object({
  clerkUserId: z.string().min(1).max(100).optional(),
});

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify JWT and get user
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !userData?.user) {
      console.error("Failed to verify user:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    const body = await req.json();
    const parseResult = GetProfileSchema.safeParse(body);
    
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use the authenticated user's ID from JWT, not from request body
    const clerkUserId = userData.user.id;

    // If a different clerkUserId was provided in the body, deny access
    if (parseResult.data.clerkUserId && parseResult.data.clerkUserId !== clerkUserId) {
      console.error("Attempted to access another user's profile");
      return new Response(
        JSON.stringify({ error: "Forbidden - cannot access other users data" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch profile for the authenticated user only
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!profile) {
      return new Response(
        JSON.stringify({ profile: null, roles: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", profile.id);

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
    }

    console.log("Profile fetched successfully for user:", clerkUserId);

    return new Response(
      JSON.stringify({ 
        profile,
        roles: roles?.map(r => r.role) || []
      }),
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

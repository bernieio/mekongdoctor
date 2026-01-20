import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const UpdateProfileSchema = z.object({
  clerkUserId: z.string().min(1).max(100).optional(),
  full_name: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  province: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
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
    const parseResult = UpdateProfileSchema.safeParse(body);
    
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validatedBody = parseResult.data;

    // Use the authenticated user's ID from JWT
    const clerkUserId = userData.user.id;

    // If a different clerkUserId was provided, deny access
    if (validatedBody.clerkUserId && validatedBody.clerkUserId !== clerkUserId) {
      console.error("Attempted to update another user's profile");
      return new Response(
        JSON.stringify({ error: "Forbidden - cannot modify other users data" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build update data
    const updateData: Record<string, string | undefined> = {};
    if (validatedBody.full_name !== undefined) updateData.full_name = validatedBody.full_name;
    if (validatedBody.phone !== undefined) updateData.phone = validatedBody.phone;
    if (validatedBody.province !== undefined) updateData.province = validatedBody.province;
    if (validatedBody.district !== undefined) updateData.district = validatedBody.district;

    // Update only the authenticated user's profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("clerk_user_id", clerkUserId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Profile updated successfully for user:", clerkUserId);

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

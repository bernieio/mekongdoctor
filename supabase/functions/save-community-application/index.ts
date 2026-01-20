import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema with proper field validation
const SaveApplicationSchema = z.object({
  clerkUserId: z.string().min(1).max(100).optional(),
  applicationType: z.enum(["scholarship", "loan", "venture"]),
  fullName: z.string().min(1).max(200).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().regex(/^[+]?[0-9\s\-()]{8,20}$/, "Invalid phone format"),
  businessName: z.string().min(1).max(200).optional(),
});

serve(async (req) => {
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
    const parseResult = SaveApplicationSchema.safeParse(body);
    
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
      console.error("Attempted to create application for another user");
      return new Response(
        JSON.stringify({ error: "Forbidden - cannot create data for other users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Saving community application:", { clerkUserId, applicationType: validatedBody.applicationType });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    switch (validatedBody.applicationType) {
      case "scholarship":
        if (!validatedBody.fullName || !validatedBody.email) {
          return new Response(
            JSON.stringify({ error: "Full name and email required for scholarship" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await supabase
          .from("scholarship_applications")
          .insert({
            user_id: profile.id,
            full_name: validatedBody.fullName,
            email: validatedBody.email,
            phone: validatedBody.phone,
          })
          .select()
          .single();
        break;

      case "loan":
        if (!validatedBody.fullName) {
          return new Response(
            JSON.stringify({ error: "Full name required for loan application" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await supabase
          .from("loan_applications")
          .insert({
            user_id: profile.id,
            full_name: validatedBody.fullName,
            phone: validatedBody.phone,
          })
          .select()
          .single();
        break;

      case "venture":
        if (!validatedBody.businessName) {
          return new Response(
            JSON.stringify({ error: "Business name required for venture application" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = await supabase
          .from("venture_applications")
          .insert({
            user_id: profile.id,
            business_name: validatedBody.businessName,
            phone: validatedBody.phone,
          })
          .select()
          .single();
        break;
    }

    if (result.error) {
      console.error("Insert error:", result.error);
      return new Response(
        JSON.stringify({ error: "Failed to save application" }),
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

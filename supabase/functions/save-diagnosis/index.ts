import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Input validation schema
const SaveDiagnosisSchema = z.object({
  clerkUserId: z.string().min(1).max(100).nullable().optional(),
  province: z.string().min(1).max(100),
  district: z.string().max(100).optional(),
  cropType: z.string().min(1).max(50),
  salinityLevel: z.number().min(0).max(100),
  symptoms: z.string().max(5000).optional(),
  imageUrls: z.array(z.string().url().max(500)).max(10).optional(),
  diagnosisStatus: z.enum(["safe", "warning", "danger"]),
  diagnosisMessage: z.string().min(1).max(2000),
  solutions: z.array(z.string().max(500)).max(20),
  policyInfo: z.string().max(2000).optional(),
});

serve(async (req) => {
  const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",");
  const origin = req.headers.get("origin") ?? "";
  const isAllowed = allowedOrigins.includes(origin);

  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowed ? origin : "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!isAllowed) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Initialize Supabase with Service Role (to bypass RLS for anonymous insert)
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Parse and validate input
    const body = await req.json();
    const parseResult = SaveDiagnosisSchema.safeParse(body);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validatedBody = parseResult.data;

    // Insert diagnosis record (user_id is now nullable)
    const { data: diagnosis, error: insertError } = await supabase
      .from("diagnoses")
      .insert({
        user_id: null, // Always null for anonymous
        province: validatedBody.province,
        district: validatedBody.district,
        crop_type: validatedBody.cropType,
        salinity_level: validatedBody.salinityLevel,
        symptoms: validatedBody.symptoms,
        image_urls: validatedBody.imageUrls || [],
        diagnosis_status: validatedBody.diagnosisStatus,
        diagnosis_message: validatedBody.diagnosisMessage,
        solutions: validatedBody.solutions,
        policy_info: validatedBody.policyInfo
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting diagnosis:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save diagnosis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Diagnosis saved successfully:", diagnosis.id);

    return new Response(
      JSON.stringify({ success: true, diagnosis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Save diagnosis error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to save diagnosis"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SaveDiagnosisRequest {
  clerkUserId: string;
  province: string;
  district?: string;
  cropType: string;
  salinityLevel: number;
  symptoms?: string;
  imageUrls?: string[];
  diagnosisStatus: "safe" | "warning" | "danger";
  diagnosisMessage: string;
  solutions: string[];
  policyInfo?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body: SaveDiagnosisRequest = await req.json();
    const {
      clerkUserId,
      province,
      district,
      cropType,
      salinityLevel,
      symptoms,
      imageUrls,
      diagnosisStatus,
      diagnosisMessage,
      solutions,
      policyInfo
    } = body;

    // Get user profile ID from clerk_user_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw new Error("Failed to fetch user profile");
    }

    // Insert diagnosis record
    const { data: diagnosis, error: insertError } = await supabase
      .from("diagnoses")
      .insert({
        user_id: profile?.id || null,
        province,
        district,
        crop_type: cropType,
        salinity_level: salinityLevel,
        symptoms,
        image_urls: imageUrls || [],
        diagnosis_status: diagnosisStatus,
        diagnosis_message: diagnosisMessage,
        solutions,
        policy_info: policyInfo
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting diagnosis:", insertError);
      throw new Error("Failed to save diagnosis");
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

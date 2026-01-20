import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
};

interface ClerkUserData {
  id: string;
  email_addresses?: Array<{ email_address: string; id: string }>;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  phone_numbers?: Array<{ phone_number: string }>;
  public_metadata?: {
    role?: string;
  };
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserData;
}

// Simple signature verification for Clerk webhooks
async function verifyClerkSignature(
  payload: string,
  headers: Headers,
  secret: string
): Promise<boolean> {
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing svix headers");
    return false;
  }

  // Check timestamp to prevent replay attacks (5 minute tolerance)
  const timestamp = parseInt(svixTimestamp);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    console.error("Timestamp too old or in future");
    return false;
  }

  // Create the signed content
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;

  // Get the secret key (remove 'whsec_' prefix if present)
  const secretKey = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  
  try {
    // Decode the base64 secret
    const secretBytes = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0));
    
    // Import the key for HMAC-SHA256
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    // Sign the content
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedContent)
    );
    
    // Convert to base64
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    // Check against provided signatures (there may be multiple)
    const signatures = svixSignature.split(" ");
    for (const sig of signatures) {
      const [version, providedSig] = sig.split(",");
      if (version === "v1" && providedSig === expectedSignature) {
        return true;
      }
    }
    
    console.error("Signature mismatch");
    return false;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("CLERK_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the raw body for signature verification
    const payload = await req.text();
    
    // Verify the webhook signature
    const isValid = await verifyClerkSignature(payload, req.headers, webhookSecret);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the webhook event
    const event: ClerkWebhookEvent = JSON.parse(payload);
    console.log("Received Clerk webhook:", event.type);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userData = event.data;

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const email = userData.email_addresses?.[0]?.email_address;
        const fullName = [userData.first_name, userData.last_name]
          .filter(Boolean)
          .join(" ") || null;
        const phone = userData.phone_numbers?.[0]?.phone_number || null;
        const role = userData.public_metadata?.role || "farmer";

        console.log(`Processing ${event.type} for user:`, userData.id, email);

        // Upsert profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              clerk_user_id: userData.id,
              email,
              full_name: fullName,
              avatar_url: userData.image_url,
              phone,
            },
            { onConflict: "clerk_user_id" }
          )
          .select()
          .single();

        if (profileError) {
          console.error("Error upserting profile:", profileError);
          throw profileError;
        }

        console.log("Profile upserted:", profile.id);

        // Handle role assignment for new users
        if (event.type === "user.created" && profile) {
          const validRoles = ["farmer", "expert", "admin"];
          const userRole = validRoles.includes(role) ? role : "farmer";

          const { error: roleError } = await supabase
            .from("user_roles")
            .upsert(
              {
                user_id: profile.id,
                role: userRole,
              },
              { onConflict: "user_id,role" }
            );

          if (roleError) {
            console.error("Error assigning role:", roleError);
            // Don't throw - profile was created successfully
          } else {
            console.log("Role assigned:", userRole);
          }
        }

        break;
      }

      case "user.deleted": {
        console.log("Processing user.deleted for:", userData.id);

        // Delete profile (cascade will handle user_roles)
        const { error: deleteError } = await supabase
          .from("profiles")
          .delete()
          .eq("clerk_user_id", userData.id);

        if (deleteError) {
          console.error("Error deleting profile:", deleteError);
          throw deleteError;
        }

        console.log("Profile deleted successfully");
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

const corsHeaders = (origin: string) => {
  const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",");
  const isAllowed = allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // Check origin
  if (!corsHeaders(origin)["Access-Control-Allow-Origin"] || corsHeaders(origin)["Access-Control-Allow-Origin"] === "null") {
    return new Response(
      JSON.stringify({ error: "Forbidden: Unauthorized origin" }),
      { status: 403, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }

  try {
    const mapboxToken = Deno.env.get("MAPBOX_ACCESS_TOKEN");

    if (!mapboxToken) {
      console.error("MAPBOX_ACCESS_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Mapbox token not configured" }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    console.log("Mapbox token requested (anonymous)");

    return new Response(
      JSON.stringify({ token: mapboxToken }),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
});

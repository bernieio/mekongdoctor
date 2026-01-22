import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Universal CORS
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    console.log("Translation request received from:", req.headers.get("origin"));

    try {
        const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
        if (!OPENROUTER_API_KEY) {
            console.error("CRITICAL: OPENROUTER_API_KEY is missing!");
            throw new Error("Server configuration error: Missing API Key");
        }

        const { originalResult, targetLanguage, sourceLanguage } = await req.json();

        if (!originalResult || !targetLanguage) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: originalResult, targetLanguage" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`Translating from ${sourceLanguage || 'unknown'} to ${targetLanguage}`);

        const languageNames = {
            vi: "Vietnamese",
            en: "English",
            ko: "Korean"
        };

        const targetLangName = languageNames[targetLanguage] || targetLanguage;
        const sourceLangName = sourceLanguage ? (languageNames[sourceLanguage] || sourceLanguage) : "the original language";

        const translationPrompt = `You are a professional translator specializing in agricultural and technical content.

Translate the following agricultural diagnosis result from ${sourceLangName} to ${targetLangName}.

CRITICAL RULES:
1. Maintain the EXACT JSON structure
2. DO NOT translate the "status" field - keep it as is ("safe", "warning", or "danger")
3. Translate ONLY the text content in "message", "solutions" array, and "policy" fields
4. Preserve technical agricultural terms accurately
5. Return ONLY valid JSON, no markdown code blocks

Original JSON:
${JSON.stringify(originalResult, null, 2)}

Return the translated JSON now:`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://mekongdoctor.lovable.app",
                "X-Title": "Mekong Doctor Translation",
            },
            body: JSON.stringify({
                model: "google/gemma-3-27b-it:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional translator. Always return valid JSON without markdown formatting."
                    },
                    {
                        role: "user",
                        content: translationPrompt
                    }
                ],
                temperature: 0.3, // Lower temperature for more consistent translation
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("OpenRouter API Error:", errText);
            throw new Error(`Translation API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content;

        if (!aiContent) {
            throw new Error("No translation content received from AI");
        }

        console.log("AI translation response:", aiContent);

        // Parse the translated JSON
        let translatedResult;
        try {
            // Try to extract JSON from markdown code blocks if present
            const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                translatedResult = JSON.parse(jsonMatch[1]);
            } else if (aiContent.trim().startsWith("{")) {
                translatedResult = JSON.parse(aiContent);
            } else {
                throw new Error("AI response is not valid JSON");
            }
        } catch (parseError) {
            console.error("Failed to parse AI translation:", parseError);
            // Return original result if parsing fails
            return new Response(
                JSON.stringify({
                    error: "Translation parsing failed",
                    fallback: originalResult
                }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Validate that required fields exist
        if (!translatedResult.status || !translatedResult.message || !translatedResult.solutions) {
            console.warn("Translated result missing required fields, using original");
            return new Response(
                JSON.stringify(originalResult),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log("Translation successful");

        return new Response(
            JSON.stringify(translatedResult),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Translation error:", error);

        return new Response(
            JSON.stringify({
                error: error.message || "Translation failed",
                details: "Check Supabase Function Logs"
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
});

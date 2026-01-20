import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema with limits to prevent resource exhaustion
const DiagnosisRequestSchema = z.object({
  province: z.string().min(1).max(100),
  district: z.string().max(100).optional(),
  cropType: z.string().min(1).max(50),
  cropLabel: z.string().min(1).max(100),
  salinityLevel: z.number().min(0).max(100),
  threshold: z.number().min(0).max(100),
  symptoms: z.string().max(2000).optional(),
  imageUrls: z.array(z.string().url().max(500)).max(10).optional(),
  language: z.enum(["vi", "en", "ko"]),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
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

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    // Parse and validate input
    const body = await req.json();
    const parseResult = DiagnosisRequestSchema.safeParse(body);
    
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validatedBody = parseResult.data;
    const { province, district, cropType, cropLabel, salinityLevel, threshold, symptoms, imageUrls, language } = validatedBody;

    // Sanitize symptoms to prevent prompt injection - remove control characters
    const sanitizedSymptoms = symptoms 
      ? symptoms.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 2000) 
      : undefined;

    console.log("AI diagnosis request for user:", userData.user.id);

    // Build the prompt for AI
    const systemPrompt = `Bạn là "Mekong Doctor" - chuyên gia tư vấn nông nghiệp về xâm nhập mặn tại Đồng bằng sông Cửu Long, Việt Nam. 
Bạn có kiến thức sâu về:
- Ngưỡng chịu mặn của các loại cây trồng
- Biện pháp ứng phó với xâm nhập mặn
- Chính sách hỗ trợ nông dân của Chính phủ Việt Nam
- Kỹ thuật canh tác thích ứng với biến đổi khí hậu

Hãy trả lời dưới dạng JSON với cấu trúc sau:
{
  "status": "safe" | "warning" | "danger",
  "message": "Thông điệp chính về tình trạng",
  "solutions": ["Giải pháp 1", "Giải pháp 2", ...],
  "policy": "Thông tin về chính sách hỗ trợ nếu có"
}

Quy tắc đánh giá:
- safe: Độ mặn <= 50% ngưỡng chịu đựng
- warning: Độ mặn từ 50% đến 100% ngưỡng
- danger: Độ mặn vượt quá ngưỡng chịu đựng

Ngôn ngữ trả lời: ${language === 'vi' ? 'Tiếng Việt' : language === 'en' ? 'English' : '한국어'}`;

    const userPrompt = `Thông tin chẩn đoán:
- Vị trí: ${province}${district ? `, ${district}` : ''}
- Loại cây trồng: ${cropLabel} (${cropType})
- Ngưỡng chịu mặn: ${threshold}g/L
- Độ mặn đo được: ${salinityLevel}g/L
- Triệu chứng: ${sanitizedSymptoms || 'Không có mô tả cụ thể'}
${imageUrls && imageUrls.length > 0 ? `- Có ${imageUrls.length} ảnh đính kèm` : ''}

Hãy phân tích và đưa ra chẩn đoán chi tiết.`;

    console.log("Calling OpenRouter API with qwen/qwen3-4b:free model");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mekongdoctor.lovable.app",
        "X-Title": "Mekong Doctor",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-4b:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenRouter response received");

    const aiContent = data.choices?.[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from AI response (handle markdown code blocks)
    let diagnosisResult;
    try {
      // Try to extract JSON from markdown code block if present
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : aiContent.trim();
      diagnosisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", aiContent);
      // Fallback to rule-based diagnosis
      const ratio = salinityLevel / threshold;
      let status: "safe" | "warning" | "danger";
      let message: string;
      let solutions: string[];
      let policy: string | undefined;

      if (ratio <= 0.5) {
        status = "safe";
        message = language === "vi" 
          ? `Độ mặn ${salinityLevel}g/L nằm trong ngưỡng an toàn cho ${cropLabel}.`
          : language === "en"
          ? `Salinity ${salinityLevel}g/L is within safe range for ${cropLabel}.`
          : `염도 ${salinityLevel}g/L은 ${cropLabel}에 안전한 범위입니다.`;
        solutions = language === "vi" ? [
          "Tiếp tục theo dõi độ mặn định kỳ",
          "Duy trì chế độ tưới tiêu hiện tại"
        ] : language === "en" ? [
          "Continue regular salinity monitoring",
          "Maintain current irrigation regime"
        ] : [
          "정기적인 염도 모니터링 계속",
          "현재 관개 체제 유지"
        ];
      } else if (ratio <= 1) {
        status = "warning";
        message = language === "vi"
          ? `Độ mặn ${salinityLevel}g/L đang ở mức cảnh báo cho ${cropLabel}.`
          : language === "en"
          ? `Salinity ${salinityLevel}g/L is at warning level for ${cropLabel}.`
          : `염도 ${salinityLevel}g/L은 ${cropLabel}에 경고 수준입니다.`;
        solutions = language === "vi" ? [
          "Tăng cường trữ nước ngọt",
          "Hạn chế lấy nước vào lúc triều cường",
          "Bón thêm vôi để cải thiện đất"
        ] : language === "en" ? [
          "Increase freshwater storage",
          "Limit water intake during high tide",
          "Apply lime to improve soil"
        ] : [
          "담수 저장량 증가",
          "만조 시 물 섭취 제한",
          "토양 개선을 위해 석회 적용"
        ];
        policy = language === "vi" 
          ? "Bạn có thể đăng ký hỗ trợ kỹ thuật từ Trạm Khuyến nông địa phương."
          : language === "en"
          ? "You can register for technical support from local Agricultural Extension Station."
          : "지역 농업지도소에서 기술 지원을 신청할 수 있습니다.";
      } else {
        status = "danger";
        message = language === "vi"
          ? `CẢNH BÁO: Độ mặn ${salinityLevel}g/L vượt ngưỡng chịu đựng của ${cropLabel} (${threshold}g/L)!`
          : language === "en"
          ? `WARNING: Salinity ${salinityLevel}g/L exceeds ${cropLabel} tolerance (${threshold}g/L)!`
          : `경고: 염도 ${salinityLevel}g/L이 ${cropLabel} 내성(${threshold}g/L)을 초과!`;
        solutions = language === "vi" ? [
          "NGỪNG lấy nước từ nguồn nhiễm mặn",
          "Xả nước mặn và thay nước ngọt",
          "Bón vôi gấp đôi liều thông thường",
          "Xem xét chuyển đổi giống chịu mặn",
          "Liên hệ cơ quan nông nghiệp địa phương"
        ] : language === "en" ? [
          "STOP taking water from saline sources",
          "Drain saline water and replace with freshwater",
          "Apply double lime dose",
          "Consider salt-tolerant varieties",
          "Contact local agricultural agency"
        ] : [
          "염분 수원에서 취수 중단",
          "염수 배수 후 담수로 교체",
          "석회 용량 두 배 적용",
          "내염성 품종 고려",
          "지역 농업 기관에 연락"
        ];
        policy = language === "vi"
          ? "Bạn có thể được hỗ trợ thiệt hại theo Nghị định 02/2017/NĐ-CP."
          : language === "en"
          ? "You may be eligible for damage support under Decree 02/2017/ND-CP."
          : "법령 02/2017/ND-CP에 따른 피해 지원을 받을 수 있습니다.";
      }

      diagnosisResult = { status, message, solutions, policy };
    }

    return new Response(JSON.stringify(diagnosisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI Diagnosis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        status: "warning",
        message: "Không thể kết nối AI. Vui lòng thử lại sau.",
        solutions: ["Kiểm tra kết nối mạng", "Thử lại sau vài phút"]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

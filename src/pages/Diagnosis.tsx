import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Droplets, MapPin, Leaf, Upload, Send, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const provinces = [
  "An Giang", "Bạc Liêu", "Bến Tre", "Cà Mau", "Cần Thơ",
  "Đồng Tháp", "Hậu Giang", "Kiên Giang", "Long An", "Sóc Trăng",
  "Tiền Giang", "Trà Vinh", "Vĩnh Long"
];

const cropTypes = [
  { value: "lua", label: "Lúa", labelEn: "Rice", labelKo: "쌀", threshold: 2 },
  { value: "tom", label: "Tôm", labelEn: "Shrimp", labelKo: "새우", threshold: 15 },
  { value: "sau-rieng", label: "Sầu riêng", labelEn: "Durian", labelKo: "두리안", threshold: 1 },
  { value: "xoai", label: "Xoài", labelEn: "Mango", labelKo: "망고", threshold: 2 },
  { value: "buoi", label: "Bưởi", labelEn: "Pomelo", labelKo: "포멜로", threshold: 2 },
  { value: "khom", label: "Khóm (Dứa)", labelEn: "Pineapple", labelKo: "파인애플", threshold: 3 },
  { value: "rau-mau", label: "Rau màu", labelEn: "Vegetables", labelKo: "채소", threshold: 1.5 },
];

interface DiagnosisResult {
  status: "safe" | "warning" | "danger";
  message: string;
  solutions: string[];
  policy?: string;
}

export default function Diagnosis() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    cropType: "",
    salinityLevel: "",
    symptoms: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const getCropLabel = (crop: typeof cropTypes[0]) => {
    if (language === "en") return crop.labelEn;
    if (language === "ko") return crop.labelKo;
    return crop.label;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate AI diagnosis (will be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const salinity = parseFloat(formData.salinityLevel);
    const crop = cropTypes.find(c => c.value === formData.cropType);
    
    let diagnosisResult: DiagnosisResult;

    if (crop) {
      const cropLabel = getCropLabel(crop);
      if (salinity <= crop.threshold * 0.5) {
        diagnosisResult = {
          status: "safe",
          message: language === "vi" 
            ? `Độ mặn ${salinity}g/L nằm trong ngưỡng an toàn cho ${cropLabel}. Cây trồng có thể phát triển bình thường.`
            : language === "en"
            ? `Salinity level ${salinity}g/L is within safe threshold for ${cropLabel}. Crops can develop normally.`
            : `염도 ${salinity}g/L은 ${cropLabel}에 대해 안전한 임계값 내에 있습니다. 작물이 정상적으로 발달할 수 있습니다.`,
          solutions: language === "vi" ? [
            "Tiếp tục theo dõi độ mặn định kỳ hàng tuần",
            "Duy trì chế độ tưới tiêu hiện tại",
            "Kiểm tra dự báo thời tiết và triều cường"
          ] : language === "en" ? [
            "Continue monitoring salinity weekly",
            "Maintain current irrigation regime",
            "Check weather and tide forecasts"
          ] : [
            "매주 염도 모니터링 계속",
            "현재 관개 체제 유지",
            "날씨 및 조수 예보 확인"
          ]
        };
      } else if (salinity <= crop.threshold) {
        diagnosisResult = {
          status: "warning",
          message: language === "vi"
            ? `Độ mặn ${salinity}g/L đang ở mức cảnh báo cho ${cropLabel}. Cần có biện pháp phòng ngừa.`
            : language === "en"
            ? `Salinity level ${salinity}g/L is at warning level for ${cropLabel}. Preventive measures needed.`
            : `염도 ${salinity}g/L은 ${cropLabel}에 대해 경고 수준입니다. 예방 조치가 필요합니다.`,
          solutions: language === "vi" ? [
            "Tăng cường trữ nước ngọt trong ao/mương",
            "Hạn chế lấy nước vào lúc triều cường",
            "Bón thêm vôi để cải thiện đất (10-15kg/1000m²)",
            "Cân nhắc che phủ gốc để giảm bốc hơi"
          ] : language === "en" ? [
            "Increase freshwater storage in ponds/canals",
            "Limit water intake during high tide",
            "Apply lime to improve soil (10-15kg/1000m²)",
            "Consider mulching to reduce evaporation"
          ] : [
            "연못/운하에 담수 저장량 증가",
            "만조 시 물 섭취 제한",
            "토양 개선을 위해 석회 적용 (10-15kg/1000m²)",
            "증발 감소를 위한 멀칭 고려"
          ],
          policy: language === "vi" 
            ? "Bạn có thể đăng ký hỗ trợ kỹ thuật miễn phí từ Trạm Khuyến nông địa phương."
            : language === "en"
            ? "You can register for free technical support from the local Agricultural Extension Station."
            : "지역 농업지도소에서 무료 기술 지원을 신청할 수 있습니다."
        };
      } else {
        diagnosisResult = {
          status: "danger",
          message: language === "vi"
            ? `CẢNH BÁO: Độ mặn ${salinity}g/L vượt ngưỡng chịu đựng của ${cropLabel} (${crop.threshold}g/L). Cần hành động khẩn cấp!`
            : language === "en"
            ? `WARNING: Salinity ${salinity}g/L exceeds tolerance threshold of ${cropLabel} (${crop.threshold}g/L). Urgent action needed!`
            : `경고: 염도 ${salinity}g/L이 ${cropLabel}의 내성 임계값(${crop.threshold}g/L)을 초과했습니다. 긴급 조치가 필요합니다!`,
          solutions: language === "vi" ? [
            "NGỪNG ngay việc lấy nước từ nguồn nhiễm mặn",
            "Xả nước mặn và thay thế bằng nước ngọt dự trữ",
            "Bón vôi gấp đôi liều thông thường (20-30kg/1000m²)",
            "Xem xét chuyển đổi sang giống chịu mặn hoặc nuôi tôm",
            "Liên hệ ngay cơ quan nông nghiệp địa phương"
          ] : language === "en" ? [
            "STOP taking water from saline sources immediately",
            "Drain saline water and replace with stored freshwater",
            "Apply double the normal lime dose (20-30kg/1000m²)",
            "Consider switching to salt-tolerant varieties or shrimp farming",
            "Contact local agricultural agency immediately"
          ] : [
            "염분이 있는 수원에서 물 취수를 즉시 중단",
            "염수를 배수하고 저장된 담수로 교체",
            "평소 석회 용량의 두 배 적용 (20-30kg/1000m²)",
            "내염성 품종이나 새우 양식으로 전환 고려",
            "즉시 지역 농업 기관에 연락"
          ],
          policy: language === "vi"
            ? "Bạn có thể được hỗ trợ thiệt hại theo Nghị định 02/2017/NĐ-CP. Hãy liên hệ UBND xã để làm hồ sơ."
            : language === "en"
            ? "You may be eligible for damage support under Decree 02/2017/ND-CP. Contact your commune People's Committee for documentation."
            : "법령 02/2017/ND-CP에 따른 피해 지원을 받을 수 있습니다. 서류 작성을 위해 면 인민위원회에 연락하세요."
        };
      }
    } else {
      diagnosisResult = {
        status: "warning",
        message: language === "vi"
          ? "Không thể xác định ngưỡng cho loại cây trồng. Vui lòng tham khảo chuyên gia."
          : language === "en"
          ? "Cannot determine threshold for crop type. Please consult an expert."
          : "작물 유형에 대한 임계값을 결정할 수 없습니다. 전문가에게 문의하세요.",
        solutions: language === "vi" 
          ? ["Liên hệ Trạm Khuyến nông để được tư vấn"]
          : language === "en"
          ? ["Contact Agricultural Extension Station for consultation"]
          : ["상담을 위해 농업지도소에 연락하세요"]
      };
    }

    setResult(diagnosisResult);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "bg-primary text-primary-foreground";
      case "warning": return "bg-secondary text-secondary-foreground";
      case "danger": return "bg-destructive text-destructive-foreground";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return <CheckCircle className="h-6 w-6" />;
      case "warning": return <AlertTriangle className="h-6 w-6" />;
      case "danger": return <AlertTriangle className="h-6 w-6" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "safe": return t("diagnosis.result.safe");
      case "warning": return t("diagnosis.result.warning");
      case "danger": return t("diagnosis.result.danger");
      default: return "";
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-secondary bg-secondary">
              <Bot className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">{t("diagnosis.title")}</h1>
              <p className="text-primary-foreground/80">{t("diagnosis.subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  {t("diagnosis.form.title")}
                </CardTitle>
                <CardDescription>
                  {t("diagnosis.form.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t("diagnosis.form.province")}
                      </Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
                      >
                        <SelectTrigger id="province" className="border-2">
                          <SelectValue placeholder={t("common.select")} />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">{t("diagnosis.form.district")}</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                        placeholder={t("common.enter")}
                        className="border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cropType" className="flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      {t("diagnosis.form.cropType")}
                    </Label>
                    <Select
                      value={formData.cropType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))}
                    >
                      <SelectTrigger id="cropType" className="border-2">
                        <SelectValue placeholder={t("common.select")} />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map((crop) => (
                          <SelectItem key={crop.value} value={crop.value}>
                            {getCropLabel(crop)} ({t("common.threshold")}: {crop.threshold}g/L)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salinity" className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      {t("diagnosis.form.salinity")}
                    </Label>
                    <Input
                      id="salinity"
                      type="number"
                      step="0.1"
                      value={formData.salinityLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, salinityLevel: e.target.value }))}
                      placeholder="3.5"
                      className="border-2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">{t("diagnosis.form.symptoms")}</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder={language === "vi" ? "Mô tả các triệu chứng: lá vàng, cháy lá, cây héo..." : language === "en" ? "Describe symptoms: yellow leaves, leaf burn, wilting..." : "증상 설명: 노란 잎, 잎 화상, 시들음..."}
                      className="border-2 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {t("diagnosis.form.image")}
                    </Label>
                    <div className="border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {language === "vi" ? "Kéo thả hoặc click để tải ảnh mẫu nước/cây" : language === "en" ? "Drag and drop or click to upload water/plant sample images" : "물/식물 샘플 이미지를 드래그 앤 드롭하거나 클릭하여 업로드"}
                      </p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full border-2 border-foreground shadow-md"
                    disabled={isLoading || !formData.salinityLevel}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("diagnosis.form.analyzing")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t("diagnosis.form.submit")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result */}
            <div className="space-y-6">
              {result ? (
                <Card className={`border-2 ${result.status === 'danger' ? 'border-destructive' : result.status === 'warning' ? 'border-accent' : 'border-primary'}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center border-2 ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                      </div>
                      <div>
                        <CardTitle>{t("diagnosis.result.title")}</CardTitle>
                        <Badge className={`${getStatusColor(result.status)} border-2 border-foreground mt-1`}>
                          {getStatusLabel(result.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 border-2 border-border bg-muted">
                      <p className="font-medium">{result.message}</p>
                    </div>

                    <div>
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        {t("diagnosis.result.solutions")}
                      </h4>
                      <ul className="space-y-2">
                        {result.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2 p-3 border-2 border-border bg-background">
                            <span className="flex h-6 w-6 items-center justify-center border-2 border-primary bg-primary text-primary-foreground text-sm font-bold shrink-0">
                              {index + 1}
                            </span>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.policy && (
                      <div className="p-4 border-2 border-secondary bg-secondary/20">
                        <h4 className="font-bold mb-2 text-secondary-foreground">{t("diagnosis.result.policy")}</h4>
                        <p className="text-sm">{result.policy}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-border border-dashed h-full flex items-center justify-center">
                  <CardContent className="text-center py-16">
                    <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">{t("diagnosis.ready.title")}</h3>
                    <p className="text-muted-foreground max-w-sm">
                      {t("diagnosis.ready.description")}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Tips */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{t("diagnosis.tips.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>{t("diagnosis.tips.1")}</p>
                  <p>{t("diagnosis.tips.2")}</p>
                  <p>{t("diagnosis.tips.3")}</p>
                  <p>{t("diagnosis.tips.4")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Droplets, MapPin, Leaf, Upload, Send, AlertTriangle, CheckCircle, Loader2, X, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    province: "",
    district: "",
    cropType: "",
    salinityLevel: "",
    symptoms: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const getCropLabel = (crop: typeof cropTypes[0]) => {
    if (language === "en") return crop.labelEn;
    if (language === "ko") return crop.labelKo;
    return crop.label;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setUploadedImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    if (uploadedImages.length === 0) return [];

    setIsUploading(true);
    const urls: string[] = [];

    try {
      for (const { file } of uploadedImages) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", "anonymous");

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-r2`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        if (data.success && data.url) {
          urls.push(data.url);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(language === "vi" ? "Lỗi tải ảnh" : "Image upload failed");
    } finally {
      setIsUploading(false);
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload images first if any
      const imageUrls = await uploadImages();
      setUploadedUrls(imageUrls);

      const crop = cropTypes.find(c => c.value === formData.cropType);
      if (!crop) {
        throw new Error("Invalid crop type");
      }

      // Call AI diagnosis API (Anonymous)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-diagnosis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            province: formData.province,
            district: formData.district,
            cropType: formData.cropType,
            cropLabel: getCropLabel(crop),
            salinityLevel: parseFloat(formData.salinityLevel),
            threshold: crop.threshold,
            symptoms: formData.symptoms,
            imageUrls,
            language,
          }),
        }
      );

      const diagnosisResult = await response.json();

      if (diagnosisResult.error && !diagnosisResult.status) {
        throw new Error(diagnosisResult.error);
      }

      setResult(diagnosisResult);

      // Save diagnosis to database (Anonymous allowed)
      try {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-diagnosis`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              clerkUserId: null, // Anonymous user
              province: formData.province,
              district: formData.district,
              cropType: formData.cropType,
              salinityLevel: parseFloat(formData.salinityLevel),
              symptoms: formData.symptoms,
              imageUrls,
              diagnosisStatus: diagnosisResult.status,
              diagnosisMessage: diagnosisResult.message,
              solutions: diagnosisResult.solutions,
              policyInfo: diagnosisResult.policy,
            }),
          }
        );
      } catch (saveError) {
        console.error("Error saving diagnosis:", saveError);
      }

      toast.success(language === "vi" ? "Chẩn đoán hoàn tất!" : "Diagnosis complete!");

    } catch (error) {
      console.error("Diagnosis error:", error);
      toast.error(language === "vi" ? "Lỗi chẩn đoán. Vui lòng thử lại." : "Diagnosis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t("diagnosis.form.province")}
                      </Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
                      >
                        <SelectTrigger id="province" className="border-2 h-12 text-lg">
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
                        className="border-2 h-12 text-lg"
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
                      <SelectTrigger id="cropType" className="border-2 h-12 text-lg">
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
                      {t("diagnosis.form.salinity")} (g/L - phần nghìn)
                    </Label>
                    <Input
                      id="salinity"
                      type="number"
                      step="0.1"
                      value={formData.salinityLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, salinityLevel: e.target.value }))}
                      placeholder="3.5 g/L"
                      className="border-2 h-12 text-lg"
                      required
                    />
                    {parseFloat(formData.salinityLevel) > 40 && (
                      <div className="flex items-center gap-2 mt-2 text-destructive font-bold animate-pulse">
                        <AlertTriangle className="h-5 w-5" />
                        <span>
                          {language === "vi"
                            ? "CẢNH BÁO: Độ mặn > 40 g/L là rất cao! Vui lòng kiểm tra lại đơn vị (ppm vs ppt)."
                            : "WARNING: > 40 g/L is extremely high! Check your units."}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">{t("diagnosis.form.symptoms")}</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder={language === "vi" ? "Mô tả các triệu chứng: lá vàng, cháy lá, cây héo..." : language === "en" ? "Describe symptoms: yellow leaves, leaf burn, wilting..." : "증상 설명: 노란 잎, 잎 화상, 시들음..."}
                      className="border-2 min-h-[100px] text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {t("diagnosis.form.image")}
                    </Label>

                    {/* Image previews */}
                    {uploadedImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover border-2 border-border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    >
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                      ) : (
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      )}
                      <p className="text-sm text-muted-foreground">
                        {language === "vi"
                          ? `Kéo thả hoặc click để tải ảnh (${uploadedImages.length}/5)`
                          : language === "en"
                            ? `Drag and drop or click to upload (${uploadedImages.length}/5)`
                            : `드래그 앤 드롭하거나 클릭하여 업로드 (${uploadedImages.length}/5)`}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full border-2 border-foreground shadow-md h-12 text-lg"
                    disabled={isLoading || !formData.salinityLevel || !formData.cropType}
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
                        <Leaf className="h-4 w-4 text-primary" />
                        {t("diagnosis.result.solutions")}
                      </h4>
                      <ul className="space-y-2">
                        {result.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex h-6 w-6 items-center justify-center border border-primary text-xs font-bold text-primary shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.policy && (
                      <div className="p-4 border-2 border-primary bg-primary/10">
                        <h4 className="font-bold mb-2">{t("diagnosis.result.policy")}</h4>
                        <p className="text-sm text-muted-foreground">{result.policy}</p>
                      </div>
                    )}

                    {uploadedUrls.length > 0 && (
                      <div>
                        <h4 className="font-bold mb-2">
                          {language === "vi" ? "Ảnh đã tải lên" : language === "en" ? "Uploaded Images" : "업로드된 이미지"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uploadedUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Uploaded ${index + 1}`}
                              className="w-16 h-16 object-cover border-2 border-border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-border">
                  <CardContent className="py-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center border-2 border-border bg-muted animate-pulse">
                        <Bot className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-muted rounded animate-pulse w-48" />
                        <div className="h-4 bg-muted rounded animate-pulse w-32" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-full" />
                        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                        <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
                      </div>

                      <div className="space-y-2 pt-4">
                        <div className="h-5 bg-muted rounded animate-pulse w-40" />
                        <div className="flex gap-2">
                          <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                          <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                      {language === "vi"
                        ? "Điền thông tin và gửi để nhận kết quả chẩn đoán AI"
                        : language === "en"
                          ? "Fill in the information and submit to receive AI diagnosis"
                          : "정보를 입력하고 제출하여 AI 진단을 받으세요"}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Tips */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{t("diagnosis.tips.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {t("diagnosis.tips.tip1")}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {t("diagnosis.tips.tip2")}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {t("diagnosis.tips.tip3")}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

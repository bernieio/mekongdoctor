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

const provinces = [
  "An Giang", "Bạc Liêu", "Bến Tre", "Cà Mau", "Cần Thơ",
  "Đồng Tháp", "Hậu Giang", "Kiên Giang", "Long An", "Sóc Trăng",
  "Tiền Giang", "Trà Vinh", "Vĩnh Long"
];

const cropTypes = [
  { value: "lua", label: "Lúa", threshold: 2 },
  { value: "tom", label: "Tôm", threshold: 15 },
  { value: "sau-rieng", label: "Sầu riêng", threshold: 1 },
  { value: "xoai", label: "Xoài", threshold: 2 },
  { value: "buoi", label: "Bưởi", threshold: 2 },
  { value: "khom", label: "Khóm (Dứa)", threshold: 3 },
  { value: "rau-mau", label: "Rau màu", threshold: 1.5 },
];

interface DiagnosisResult {
  status: "safe" | "warning" | "danger";
  message: string;
  solutions: string[];
  policy?: string;
}

export default function Diagnosis() {
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    cropType: "",
    salinityLevel: "",
    symptoms: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate AI diagnosis (will be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const salinity = parseFloat(formData.salinityLevel);
    const crop = cropTypes.find(c => c.value === formData.cropType);
    
    let diagnosisResult: DiagnosisResult;

    if (crop) {
      if (salinity <= crop.threshold * 0.5) {
        diagnosisResult = {
          status: "safe",
          message: `Độ mặn ${salinity}g/L nằm trong ngưỡng an toàn cho ${crop.label}. Cây trồng có thể phát triển bình thường.`,
          solutions: [
            "Tiếp tục theo dõi độ mặn định kỳ hàng tuần",
            "Duy trì chế độ tưới tiêu hiện tại",
            "Kiểm tra dự báo thời tiết và triều cường"
          ]
        };
      } else if (salinity <= crop.threshold) {
        diagnosisResult = {
          status: "warning",
          message: `Độ mặn ${salinity}g/L đang ở mức cảnh báo cho ${crop.label}. Cần có biện pháp phòng ngừa.`,
          solutions: [
            "Tăng cường trữ nước ngọt trong ao/mương",
            "Hạn chế lấy nước vào lúc triều cường",
            "Bón thêm vôi để cải thiện đất (10-15kg/1000m²)",
            "Cân nhắc che phủ gốc để giảm bốc hơi"
          ],
          policy: "Bạn có thể đăng ký hỗ trợ kỹ thuật miễn phí từ Trạm Khuyến nông địa phương."
        };
      } else {
        diagnosisResult = {
          status: "danger",
          message: `CẢNH BÁO: Độ mặn ${salinity}g/L vượt ngưỡng chịu đựng của ${crop.label} (${crop.threshold}g/L). Cần hành động khẩn cấp!`,
          solutions: [
            "NGỪNG ngay việc lấy nước từ nguồn nhiễm mặn",
            "Xả nước mặn và thay thế bằng nước ngọt dự trữ",
            "Bón vôi gấp đôi liều thông thường (20-30kg/1000m²)",
            "Xem xét chuyển đổi sang giống chịu mặn hoặc nuôi tôm",
            "Liên hệ ngay cơ quan nông nghiệp địa phương"
          ],
          policy: "Bạn có thể được hỗ trợ thiệt hại theo Nghị định 02/2017/NĐ-CP. Hãy liên hệ UBND xã để làm hồ sơ."
        };
      }
    } else {
      diagnosisResult = {
        status: "warning",
        message: "Không thể xác định ngưỡng cho loại cây trồng. Vui lòng tham khảo chuyên gia.",
        solutions: ["Liên hệ Trạm Khuyến nông để được tư vấn"]
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
              <h1 className="text-3xl font-bold text-primary-foreground">Bác sĩ Mekong AI</h1>
              <p className="text-primary-foreground/80">Chẩn đoán tình trạng xâm nhập mặn và đề xuất giải pháp</p>
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
                  Nhập thông tin chẩn đoán
                </CardTitle>
                <CardDescription>
                  Điền đầy đủ thông tin để Bác sĩ AI phân tích chính xác
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Tỉnh/Thành phố
                      </Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
                      >
                        <SelectTrigger id="province" className="border-2">
                          <SelectValue placeholder="Chọn tỉnh" />
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
                      <Label htmlFor="district">Quận/Huyện</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                        placeholder="Nhập tên huyện"
                        className="border-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cropType" className="flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      Loại cây trồng
                    </Label>
                    <Select
                      value={formData.cropType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, cropType: value }))}
                    >
                      <SelectTrigger id="cropType" className="border-2">
                        <SelectValue placeholder="Chọn loại cây" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map((crop) => (
                          <SelectItem key={crop.value} value={crop.value}>
                            {crop.label} (ngưỡng: {crop.threshold}g/L)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salinity" className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Độ mặn đo được (g/L hoặc ‰)
                    </Label>
                    <Input
                      id="salinity"
                      type="number"
                      step="0.1"
                      value={formData.salinityLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, salinityLevel: e.target.value }))}
                      placeholder="Ví dụ: 3.5"
                      className="border-2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Triệu chứng quan sát (nếu có)</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="Mô tả các triệu chứng: lá vàng, cháy lá, cây héo..."
                      className="border-2 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Hình ảnh (tùy chọn)
                    </Label>
                    <div className="border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Kéo thả hoặc click để tải ảnh mẫu nước/cây
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
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Gửi chẩn đoán
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
                        <CardTitle>Kết quả Chẩn đoán</CardTitle>
                        <Badge className={`${getStatusColor(result.status)} border-2 border-foreground mt-1`}>
                          {result.status === 'safe' ? 'An toàn' : result.status === 'warning' ? 'Cảnh báo' : 'Nguy hiểm'}
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
                        Giải pháp đề xuất:
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
                        <h4 className="font-bold mb-2 text-secondary-foreground">💡 Chính sách hỗ trợ:</h4>
                        <p className="text-sm">{result.policy}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-border border-dashed h-full flex items-center justify-center">
                  <CardContent className="text-center py-16">
                    <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">Sẵn sàng Chẩn đoán</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Điền thông tin bên trái và nhấn "Gửi chẩn đoán" để nhận kết quả phân tích từ Bác sĩ AI
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Tips */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">📚 Mẹo đo độ mặn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>• Đo vào buổi sáng sớm hoặc chiều mát để kết quả chính xác</p>
                  <p>• Đo ở nhiều điểm trong ruộng/ao và lấy giá trị trung bình</p>
                  <p>• Tránh đo sau khi mưa lớn hoặc xả nước</p>
                  <p>• Kiểm tra định kỳ 2-3 lần/tuần trong mùa khô</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

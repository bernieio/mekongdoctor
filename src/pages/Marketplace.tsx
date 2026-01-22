import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, ShoppingCart, Phone, Star, Filter, Package, Wheat, Shrub } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import salinityMeter from "@/assets/may-do-do-man-dat.jpg";
import organicFertilizer from "@/assets/phan-bon-huu-co.png";
import riceSeeds from "@/assets/lua-om18.png";
import agriculturalLime from "@/assets/voi-nong-nghiep-25kg.webp";

const supplies = [
  {
    id: 1,
    name: {
      vi: "Máy đo độ mặn đất EZDO 8200M",
      en: "EZDO 8200M Soil Salinity Meter",
      ko: "EZDO 8200M 토양 염도 측정기"
    },
    description: {
      vi: "Máy đo đa chức năng: pH, ORP, EC, TDS, độ mặn, nhiệt độ. Hãng EZDO Đài Loan, bảo hành 12 tháng. Độ chính xác cao ±0.01 pH, chống nước, lưu trữ dữ liệu.",
      en: "Multi-function meter: pH, ORP, EC, TDS, salinity, temperature. EZDO Taiwan brand, 12-month warranty. High accuracy ±0.01 pH, waterproof, data storage.",
      ko: "다기능 측정기: pH, ORP, EC, TDS, 염도, 온도. EZDO 대만 브랜드, 12개월 보증. 높은 정확도 ±0.01 pH, 방수, 데이터 저장."
    },
    price: 3090000,
    unit: { vi: "cái", en: "unit", ko: "개" },
    rating: 4.9,
    sold: 156,
    category: { vi: "Thiết bị", en: "Equipment", ko: "장비" },
    image: salinityMeter,
  },
  {
    id: 2,
    name: {
      vi: "Phân bón hữu cơ HCVS MK219 (50kg)",
      en: "HCVS MK219 Organic Fertilizer (50kg)",
      ko: "HCVS MK219 유기 비료 (50kg)"
    },
    description: {
      vi: "Phân hữu cơ 20%, vi sinh vật phân giải lân/xenlulo/cố định đạm 1x10⁶ CFU/g. Giàu Zn, Cu, B, Mn, Fe. Phù hợp đất nhiễm mặn, cải tạo đất hiệu quả.",
      en: "20% organic matter, microorganisms for P/cellulose decomposition and N fixation 1x10⁶ CFU/g. Rich in Zn, Cu, B, Mn, Fe. Suitable for saline soil, effective soil improvement.",
      ko: "유기물 20%, P/셀룰로오스 분해 및 N 고정 미생물 1x10⁶ CFU/g. Zn, Cu, B, Mn, Fe 풍부. 염분 토양에 적합, 효과적인 토양 개선."
    },
    price: 370000,
    unit: { vi: "bao", en: "bag", ko: "포대" },
    rating: 4.7,
    sold: 892,
    category: { vi: "Phân bón", en: "Fertilizer", ko: "비료" },
    image: organicFertilizer,
  },
  {
    id: 3,
    name: {
      vi: "Giống lúa OM18 chịu mặn",
      en: "OM18 Salt-tolerant Rice Seeds",
      ko: "OM18 내염성 벼 종자"
    },
    description: {
      vi: "Giống lúa thuần OM18 do Viện Lúa ĐBSCL chọn tạo. Chịu mặn tốt, năng suất cao 6-7 tấn/ha, thời gian sinh trưởng 95-100 ngày. Phù hợp vùng xâm nhập mặn.",
      en: "Pure OM18 rice variety by Mekong Delta Rice Institute. Good salt tolerance, high yield 6-7 tons/ha, 95-100 day growth period. Suitable for saline intrusion areas.",
      ko: "메콩 델타 쌀 연구소의 순수 OM18 벼 품종. 우수한 내염성, 높은 수확량 6-7톤/ha, 95-100일 생육 기간. 염분 침입 지역에 적합."
    },
    price: 7200,
    unit: { vi: "kg", en: "kg", ko: "kg" },
    rating: 4.8,
    sold: 2340,
    category: { vi: "Giống", en: "Seeds", ko: "종자" },
    image: riceSeeds,
  },
  {
    id: 4,
    name: {
      vi: "Vôi bột nông nghiệp (25kg)",
      en: "Agricultural Lime Powder (25kg)",
      ko: "농업용 석회 분말 (25kg)"
    },
    description: {
      vi: "Vôi bột CaO 65-90%, nung từ đá vôi CaCO₃ ở 900°C. Cải tạo đất phèn mặn, điều chỉnh pH, bổ sung canxi. An toàn, hiệu quả cao cho nông nghiệp ĐBSCL.",
      en: "Lime powder CaO 65-90%, calcined from CaCO₃ limestone at 900°C. Improves acidic saline soil, adjusts pH, supplements calcium. Safe and highly effective for Mekong Delta agriculture.",
      ko: "석회 분말 CaO 65-90%, 900°C에서 CaCO₃ 석회석을 소성. 산성 염분 토양 개선, pH 조정, 칼슘 보충. 메콩 델타 농업에 안전하고 매우 효과적."
    },
    price: 90000,
    unit: { vi: "bao", en: "bag", ko: "포대" },
    rating: 4.6,
    sold: 1580,
    category: { vi: "Vật tư", en: "Supplies", ko: "물자" },
    image: agriculturalLime,
  },
];

const produce = [
  {
    id: 5,
    name: { vi: "Lúa ST25 (Gạo ngon nhất thế giới)", en: "ST25 Rice (World's Best Rice)", ko: "ST25 쌀 (세계 최고의 쌀)" },
    description: {
      vi: "Lúa ST25 mùa mới, đã phơi khô, độ ẩm 14%",
      en: "New season ST25 rice, sun-dried, 14% moisture",
      ko: "새 시즌 ST25 쌀, 건조, 수분 14%"
    },
    price: 12000,
    unit: { vi: "kg", en: "kg", ko: "kg" },
    rating: 4.9,
    sold: 5200,
    category: { vi: "Lúa gạo", en: "Rice", ko: "쌀" },
    location: "Sóc Trăng",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: { vi: "Tôm sú loại 1", en: "Grade A Black Tiger Shrimp", ko: "1급 블랙타이거 새우" },
    description: {
      vi: "Tôm sú size 20 con/kg, tươi sống, giao hàng trong ngày",
      en: "Black tiger shrimp size 20 pcs/kg, live, same-day delivery",
      ko: "블랙타이거 새우 사이즈 20마리/kg, 활어, 당일 배송"
    },
    price: 350000,
    unit: { vi: "kg", en: "kg", ko: "kg" },
    rating: 4.8,
    sold: 890,
    category: { vi: "Thủy sản", en: "Seafood", ko: "해산물" },
    location: "Bạc Liêu",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: { vi: "Sầu riêng Monthong", en: "Monthong Durian", ko: "몬통 두리안" },
    description: {
      vi: "Sầu riêng Monthong chín cây, cơm vàng, hạt lép. Giá sỉ liên hệ",
      en: "Tree-ripened Monthong durian, golden flesh, small seeds. Contact for wholesale",
      ko: "나무 숙성 몬통 두리안, 황금색 과육, 작은 씨. 도매 문의"
    },
    price: 150000,
    unit: { vi: "kg", en: "kg", ko: "kg" },
    rating: 4.7,
    sold: 420,
    category: { vi: "Trái cây", en: "Fruits", ko: "과일" },
    location: "Tiền Giang",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    name: { vi: "Xoài cát Hòa Lộc", en: "Hoa Loc Cat Mango", ko: "호아록 캣 망고" },
    description: {
      vi: "Xoài cát Hòa Lộc loại 1, trái 400-500g, ngọt thơm",
      en: "Grade 1 Hoa Loc cat mango, 400-500g per fruit, sweet and fragrant",
      ko: "1급 호아록 캣 망고, 개당 400-500g, 달콤하고 향기로움"
    },
    price: 65000,
    unit: { vi: "kg", en: "kg", ko: "kg" },
    rating: 4.8,
    sold: 1100,
    category: { vi: "Trái cây", en: "Fruits", ko: "과일" },
    location: "Đồng Tháp",
    image: "/placeholder.svg",
  },
];

export default function Marketplace() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("supplies");

  const getText = (obj: { vi: string; en: string; ko: string }) => {
    return obj[language] || obj.vi;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredSupplies = supplies.filter(item =>
    getText(item.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getText(item.category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProduce = produce.filter(item =>
    getText(item.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getText(item.category).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-secondary bg-secondary">
              <ShoppingBag className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">{t("marketplace.title")}</h1>
              <p className="text-primary-foreground/80">{t("marketplace.subtitle")}</p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t("marketplace.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
                />
              </div>
              <Button variant="secondary" className="border-2 border-foreground">
                <Filter className="mr-2 h-4 w-4" />
                {t("marketplace.filter")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-background">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md h-auto p-1 border-2 border-border">
              <TabsTrigger value="supplies" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Package className="h-5 w-5" />
                <span>{t("marketplace.supplies")}</span>
              </TabsTrigger>
              <TabsTrigger value="produce" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wheat className="h-5 w-5" />
                <span>{t("marketplace.produce")}</span>
              </TabsTrigger>
            </TabsList>

            {/* Supplies Tab */}
            <TabsContent value="supplies">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{t("marketplace.supplies.title")}</h2>
                <p className="text-muted-foreground">{t("marketplace.supplies.description")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredSupplies.map((item) => (
                  <Card key={item.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                    <div className="relative aspect-square bg-muted">
                      <img
                        src={item.image}
                        alt={getText(item.name)}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground border-2 border-border">
                        {getText(item.category)}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{getText(item.name)}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {getText(item.description)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          | {t("marketplace.sold")} {item.sold}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(item.price)}
                        <span className="text-sm font-normal text-muted-foreground">/{getText(item.unit)}</span>
                      </p>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1 border-2 border-foreground" size="sm">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {t("marketplace.buy")}
                      </Button>
                      <Button variant="outline" size="sm" className="border-2">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Produce Tab */}
            <TabsContent value="produce">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{t("marketplace.produce.title")}</h2>
                <p className="text-muted-foreground">{t("marketplace.produce.description")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProduce.map((item) => (
                  <Card key={item.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                    <div className="relative aspect-square bg-muted flex items-center justify-center">
                      <Shrub className="h-16 w-16 text-muted-foreground" />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-2 border-foreground">
                        {item.location}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground border-2 border-border">
                        {getText(item.category)}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{getText(item.name)}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {getText(item.description)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          | {t("marketplace.sold")} {item.sold}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(item.price)}
                        <span className="text-sm font-normal text-muted-foreground">/{getText(item.unit)}</span>
                      </p>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1 border-2 border-foreground" size="sm">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {t("marketplace.order")}
                      </Button>
                      <Button variant="outline" size="sm" className="border-2">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA for sellers */}
          <Card className="mt-12 border-2 border-secondary bg-secondary/10">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">{t("marketplace.seller.title")}</h3>
                <p className="text-muted-foreground">
                  {t("marketplace.seller.description")}
                </p>
              </div>
              <Button size="lg" className="border-2 border-foreground shadow-md shrink-0">
                {t("marketplace.seller.register")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

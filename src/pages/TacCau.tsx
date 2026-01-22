import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Phone, Star, Truck, Shield, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import backgroundImage from "@/assets/khom-tac-cau-background.jpeg";
import pineappleImage from "@/assets/pineapple-taccau.jpg";
import banhKhomImage from "@/assets/banh-khom-taccau.jpg";
import mutKhomImage from "@/assets/mut-khom-taccau.jpg";
import nuocEpKhomImage from "@/assets/nuoc-ep-khom.jpg";

const products = [
  {
    id: 1,
    name: { vi: "Khóm Tắc Cậu tươi", en: "Fresh Tac Cau Pineapple", ko: "신선한 탁카우 파인애플" },
    description: {
      vi: "Khóm tươi nguyên trái, thu hoạch trong ngày. Ngọt thanh, ít chua, thơm đặc trưng.",
      en: "Fresh whole pineapple, harvested same day. Mildly sweet, less sour, distinctive fragrance.",
      ko: "신선한 통 파인애플, 당일 수확. 부드러운 단맛, 적은 신맛, 독특한 향기."
    },
    price: 35000,
    unit: { vi: "trái", en: "fruit", ko: "개" },
    rating: 4.9,
    sold: 1250,
    image: pineappleImage,
    badge: { vi: "Bán chạy", en: "Best Seller", ko: "베스트셀러" },
  },
  {
    id: 2,
    name: { vi: "Bánh khóm Tắc Cậu", en: "Tac Cau Pineapple Cake", ko: "탁카우 파인애플 케이크" },
    description: {
      vi: "Bánh khóm truyền thống, nhân khóm tươi, vỏ bánh giòn tan. Hộp 12 cái.",
      en: "Traditional pineapple cake, fresh pineapple filling, crispy crust. Box of 12.",
      ko: "전통 파인애플 케이크, 신선한 파인애플 속, 바삭한 껍질. 12개입."
    },
    price: 85000,
    unit: { vi: "hộp", en: "box", ko: "박스" },
    rating: 4.8,
    sold: 850,
    image: banhKhomImage,
    badge: { vi: "Đặc sản", en: "Specialty", ko: "특산품" },
  },
  {
    id: 3,
    name: { vi: "Mứt khóm Tắc Cậu", en: "Tac Cau Pineapple Jam", ko: "탁카우 파인애플 잼" },
    description: {
      vi: "Mứt khóm thủ công, nguyên liệu 100% khóm tươi, không chất bảo quản.",
      en: "Handmade pineapple jam, 100% fresh pineapple, no preservatives.",
      ko: "수제 파인애플 잼, 100% 신선한 파인애플, 방부제 무첨가."
    },
    price: 65000,
    unit: { vi: "hũ 500g", en: "500g jar", ko: "500g 병" },
    rating: 4.7,
    sold: 620,
    image: mutKhomImage,
    badge: null,
  },
  {
    id: 4,
    name: { vi: "Nước ép khóm", en: "Pineapple Juice", ko: "파인애플 주스" },
    description: {
      vi: "Nước ép khóm nguyên chất, đóng chai thủy tinh. Thùng 6 chai.",
      en: "Pure pineapple juice, glass bottled. Box of 6 bottles.",
      ko: "순수 파인애플 주스, 유리병. 6병입."
    },
    price: 120000,
    unit: { vi: "thùng", en: "box", ko: "박스" },
    rating: 4.6,
    sold: 380,
    image: nuocEpKhomImage,
    badge: { vi: "Mới", en: "New", ko: "신제품" },
  },
];

export default function TacCau() {
  const { t, language } = useLanguage();

  const getText = (obj: { vi: string; en: string; ko: string } | null) => {
    if (!obj) return null;
    return obj[language] || obj.vi;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const features = [
    {
      icon: Award,
      title: t("taccau.quality"),
      description: t("taccau.quality.desc"),
    },
    {
      icon: Truck,
      title: t("taccau.delivery"),
      description: t("taccau.delivery.desc"),
    },
    {
      icon: Shield,
      title: t("taccau.guarantee"),
      description: t("taccau.guarantee.desc"),
    },
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10">
          <div className="text-center mb-8 text-white">
            <Badge className="bg-primary text-primary-foreground border-2 border-white mb-4">
              {t("taccau.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("taccau.title")}
            </h1>
            <p className="text-xl text-white/90">
              {t("taccau.subtitle")}
            </p>
          </div>

          {/* YouTube Video */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video border-4 border-foreground shadow-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/DDwrtaZ6LAo?si=CdmOELK1AnITwuTu"
                title="Khóm Tắc Cậu - Đặc sản Kiên Giang"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-y-2 border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={pineappleImage}
                alt="Khóm Tắc Cậu"
                className="border-4 border-foreground shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{t("taccau.story.title")}</h2>
              <p className="text-muted-foreground">
                {t("taccau.story.p1")}
              </p>
              <p className="text-muted-foreground">
                {t("taccau.story.p2")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-border bg-muted text-center">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">{t("taccau.stats.hectares")}</p>
                </div>
                <div className="p-4 border-2 border-border bg-muted text-center">
                  <p className="text-3xl font-bold text-secondary">200+</p>
                  <p className="text-sm text-muted-foreground">{t("taccau.stats.farmers")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 bg-muted">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{t("taccau.products.title")}</h2>
            <p className="text-muted-foreground">{t("taccau.products.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={getText(product.name) || ""}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground border-2 border-foreground">
                      {getText(product.badge)}
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{getText(product.name)}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {getText(product.description)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      | {t("marketplace.sold")} {product.sold}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                    <span className="text-sm font-normal text-muted-foreground">/{getText(product.unit)}</span>
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button className="flex-1 border-2 border-foreground" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t("taccau.addcart")}
                  </Button>
                  <Button variant="outline" size="sm" className="border-2">
                    <Phone className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            {t("taccau.cta.title")}
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            {t("taccau.cta.description")}
          </p>
          <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md">
            {t("taccau.cta.register")}
          </Button>
        </div>
      </section>
    </Layout>
  );
}

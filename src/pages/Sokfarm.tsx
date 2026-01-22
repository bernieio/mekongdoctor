import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import backgroundImage from "@/assets/mat-hoa-dua-background.jpeg";
import matHoaDuaCoDac from "@/assets/mat-hoa-dua-co-dac.jpeg";
import matHoaDuaTuoi from "@/assets/mat-hoa-dua-tuoi.jpeg";
import nuocTuongMatHoaDua from "@/assets/nuoc-tuong-mat-hoa-dua.jpeg";
import giamMatHoaDua from "@/assets/giam-mat-hoa-dua.jpeg";

const products = [
    {
        id: 1,
        name: {
            vi: "Mật hoa dừa cô đặc",
            en: "Concentrated Coconut Nectar",
            ko: "농축 코코넛 넥타"
        },
        price: "132.000₫",
        description: {
            vi: "ỔN ĐỊNH ĐƯỜNG HUYẾT – BỔ SUNG KHOÁNG CHẤT. Mật hoa dừa hữu cơ Sokfarm là vị ngọt mới từ dừa. Sản phẩm được thu thủ công bằng kỹ thuật mát-xa hoa dừa và thu mật truyền thống của người Khmer Trà Vinh.",
            en: "STABILIZE BLOOD SUGAR – MINERAL SUPPLEMENT. Sokfarm organic coconut nectar is a new sweetness from coconut. The product is manually harvested using traditional Khmer coconut flower massage and nectar collection techniques from Tra Vinh.",
            ko: "혈당 안정화 – 미네랄 보충. Sokfarm 유기농 코코넛 넥타는 코코넛에서 나온 새로운 단맛입니다. 제품은 Tra Vinh의 전통 크메르 코코넛 꽃 마사지 및 넥타 수집 기술을 사용하여 수동으로 수확됩니다."
        },
        image: matHoaDuaCoDac,
    },
    {
        id: 2,
        name: {
            vi: "Mật hoa dừa tươi Organic Sokfarm 330ml - UHT Single",
            en: "Fresh Organic Coconut Nectar Sokfarm 330ml - UHT Single",
            ko: "신선한 유기농 코코넛 넥타 Sokfarm 330ml - UHT 싱글"
        },
        price: "40.000₫",
        description: {
            vi: "BỔ SUNG NĂNG LƯỢNG, BÙ KHOÁNG ĐIỆN GIẢI. Nước uống mật hoa dừa Sokfarm là sản phẩm được thu thủ công từ hoa dừa, giúp bạn giải khát sảng khoái, bù khoáng điện giải tự nhiên.",
            en: "ENERGY BOOST, ELECTROLYTE REPLENISHMENT. Sokfarm coconut nectar drink is manually harvested from coconut flowers, helping you quench your thirst refreshingly and naturally replenish electrolytes.",
            ko: "에너지 보충, 전해질 보충. Sokfarm 코코넛 넥타 음료는 코코넛 꽃에서 수동으로 수확되어 갈증을 상쾌하게 해소하고 자연스럽게 전해질을 보충합니다."
        },
        image: matHoaDuaTuoi,
    },
    {
        id: 3,
        name: {
            vi: "Nước tương mật hoa dừa organic Sokfarm - Dòng ít muối",
            en: "Organic Coconut Nectar Soy Sauce Sokfarm - Low Sodium",
            ko: "유기농 코코넛 넥타 간장 Sokfarm - 저염"
        },
        price: "86.000₫",
        description: {
            vi: "Nước tương không từ đậu nành – Vị mặn vì sức khỏe. Nước tương mật hoa dừa là nước chấm được lên men tự nhiên từ mật hoa dừa, không chứa gluten, không GMO, ít muối.",
            en: "Soy-free sauce – Healthy saltiness. Coconut nectar sauce is naturally fermented from coconut nectar, gluten-free, non-GMO, low sodium.",
            ko: "콩 없는 소스 – 건강한 짠맛. 코코넛 넥타 소스는 코코넛 넥타에서 자연 발효되며 글루텐 프리, 비 GMO, 저염입니다."
        },
        image: nuocTuongMatHoaDua,
    },
    {
        id: 4,
        name: {
            vi: "Giấm mật hoa dừa organic Sokfarm",
            en: "Organic Coconut Nectar Vinegar Sokfarm",
            ko: "유기농 코코넛 넥타 식초 Sokfarm"
        },
        price: "96.000₫",
        description: {
            vi: "GIẤM CÁI TỰ NHIÊN - VỊ CHUA VÌ SỨC KHOẺ. Giấm mật hoa dừa hữu cơ, có giấm cái tự nhiên, chứa enzyme, giàu khoáng chất. Dùng tương tự như giấm táo.",
            en: "NATURAL MOTHER VINEGAR - HEALTHY SOURNESS. Organic coconut nectar vinegar with natural mother, contains enzymes, rich in minerals. Use similar to apple cider vinegar.",
            ko: "천연 모 식초 - 건강한 신맛. 천연 모가 있는 유기농 코코넛 넥타 식초, 효소 함유, 미네랄 풍부. 사과 사이다 식초와 유사하게 사용."
        },
        image: giamMatHoaDua,
    }
];

export default function Sokfarm() {
    const { language } = useLanguage();

    const getText = (obj: { vi: string; en: string; ko: string }) => {
        return obj[language] || obj.vi;
    };

    const content = {
        badge: {
            vi: "Sản phẩm hữu cơ",
            en: "Organic Products",
            ko: "유기농 제품"
        },
        title: {
            vi: "Sokfarm - Mật Hoa Dừa Trà Vinh",
            en: "Sokfarm - Tra Vinh Coconut Nectar",
            ko: "Sokfarm - 짜빈 코코넛 넥타"
        },
        subtitle: {
            vi: "Vị ngọt tự nhiên từ vùng đất Trà Vinh, kết tinh văn hóa Khmer và công nghệ hiện đại.",
            en: "Natural sweetness from Tra Vinh land, crystallizing Khmer culture and modern technology.",
            ko: "Tra Vinh 땅의 자연스러운 단맛, 크메르 문화와 현대 기술의 결정체."
        },
        videoTitle: {
            vi: "Câu Chuyện Mật Hoa Dừa Sokfarm",
            en: "The Story of Sokfarm Coconut Nectar",
            ko: "Sokfarm 코코넛 넥타 이야기"
        },
        videoSubtitle: {
            vi: "Khám phá hành trình từ vườn dừa đến sản phẩm",
            en: "Discover the journey from coconut garden to product",
            ko: "코코넛 정원에서 제품까지의 여정을 발견하세요"
        },
        productsTitle: {
            vi: "Sản Phẩm Sokfarm",
            en: "Sokfarm Products",
            ko: "Sokfarm 제품"
        },
        productsSubtitle: {
            vi: "Mật hoa dừa hữu cơ và các sản phẩm chế biến",
            en: "Organic coconut nectar and processed products",
            ko: "유기농 코코넛 넥타 및 가공 제품"
        },
        addToCart: {
            vi: "Thêm vào giỏ",
            en: "Add to Cart",
            ko: "장바구니에 추가"
        },
        ctaTitle: {
            vi: "Đặt hàng ngay hôm nay",
            en: "Order Today",
            ko: "오늘 주문하세요"
        },
        ctaDescription: {
            vi: "Liên hệ với chúng tôi để đặt hàng các sản phẩm mật hoa dừa hữu cơ Sokfarm",
            en: "Contact us to order Sokfarm organic coconut nectar products",
            ko: "Sokfarm 유기농 코코넛 넥타 제품을 주문하려면 문의하세요"
        },
        ctaButton: {
            vi: "Liên hệ đặt hàng",
            en: "Contact to Order",
            ko: "주문 문의"
        }
    };

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
                            {getText(content.badge)}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {getText(content.title)}
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            {getText(content.subtitle)}
                        </p>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="py-12 bg-secondary">
                <div className="container">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">{getText(content.videoTitle)}</h2>
                        <p className="text-muted-foreground">{getText(content.videoSubtitle)}</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative aspect-video border-4 border-foreground shadow-lg overflow-hidden">
                            <iframe
                                src="https://www.youtube.com/embed/eynkNEM8MHM"
                                title={getText(content.videoTitle)}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-12 bg-background">
                <div className="container">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">{getText(content.productsTitle)}</h2>
                        <p className="text-muted-foreground">{getText(content.productsSubtitle)}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <Card key={product.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                                <div className="relative aspect-square">
                                    <img
                                        src={product.image}
                                        alt={getText(product.name)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{getText(product.name)}</CardTitle>
                                    <CardDescription className="line-clamp-3 text-sm">
                                        {getText(product.description)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <p className="text-2xl font-bold text-primary">
                                        {product.price}
                                    </p>
                                </CardContent>
                                <CardFooter className="gap-2">
                                    <Button className="flex-1 border-2 border-foreground" size="sm">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        {getText(content.addToCart)}
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
                        {getText(content.ctaTitle)}
                    </h2>
                    <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                        {getText(content.ctaDescription)}
                    </p>
                    <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md">
                        {getText(content.ctaButton)}
                    </Button>
                </div>
            </section>
        </Layout>
    );
}

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Phone } from "lucide-react";
import backgroundImage from "@/assets/mat-hoa-dua-background.jpeg";
import matHoaDuaCoDac from "@/assets/mat-hoa-dua-co-dac.jpeg";
import matHoaDuaTuoi from "@/assets/mat-hoa-dua-tuoi.jpeg";
import nuocTuongMatHoaDua from "@/assets/nuoc-tuong-mat-hoa-dua.jpeg";
import giamMatHoaDua from "@/assets/giam-mat-hoa-dua.jpeg";

const products = [
    {
        id: 1,
        name: "Mật hoa dừa cô đặc",
        price: "132.000₫",
        description: "ỔN ĐỊNH ĐƯỜNG HUYẾT – BỔ SUNG KHOÁNG CHẤT. Mật hoa dừa hữu cơ Sokfarm là vị ngọt mới từ dừa. Sản phẩm được thu thủ công bằng kỹ thuật mát-xa hoa dừa và thu mật truyền thống của người Khmer Trà Vinh.",
        image: matHoaDuaCoDac,
    },
    {
        id: 2,
        name: "Mật hoa dừa tươi Organic Sokfarm 330ml - UHT Single",
        price: "40.000₫",
        description: "BỔ SUNG NĂNG LƯỢNG, BÙ KHOÁNG ĐIỆN GIẢI. Nước uống mật hoa dừa Sokfarm là sản phẩm được thu thủ công từ hoa dừa, giúp bạn giải khát sảng khoái, bù khoáng điện giải tự nhiên.",
        image: matHoaDuaTuoi,
    },
    {
        id: 3,
        name: "Nước tương mật hoa dừa organic Sokfarm - Dòng ít muối",
        price: "86.000₫",
        description: "Nước tương không từ đậu nành – Vị mặn vì sức khỏe. Nước tương mật hoa dừa là nước chấm được lên men tự nhiên từ mật hoa dừa, không chứa gluten, không GMO, ít muối.",
        image: nuocTuongMatHoaDua,
    },
    {
        id: 4,
        name: "Giấm mật hoa dừa organic Sokfarm",
        price: "96.000₫",
        description: "GIẤM CÁI TỰ NHIÊN - VỊ CHUA VÌ SỨC KHOẺ. Giấm mật hoa dừa hữu cơ, có giấm cái tự nhiên, chứa enzyme, giàu khoáng chất. Dùng tương tự như giấm táo.",
        image: giamMatHoaDua,
    }
];

export default function Sokfarm() {
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
                            Sản phẩm hữu cơ
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Sokfarm - Mật Hoa Dừa Trà Vinh
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Vị ngọt tự nhiên từ vùng đất Trà Vinh, kết tinh văn hóa Khmer và công nghệ hiện đại.
                        </p>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="py-12 bg-secondary">
                <div className="container">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Câu Chuyện Mật Hoa Dừa Sokfarm</h2>
                        <p className="text-muted-foreground">Khám phá hành trình từ vườn dừa đến sản phẩm</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative aspect-video border-4 border-foreground shadow-lg overflow-hidden">
                            <iframe
                                src="https://www.youtube.com/embed/eynkNEM8MHM"
                                title="Câu Chuyện Mật Hoa Dừa Sokfarm"
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
                        <h2 className="text-3xl font-bold mb-2">Sản Phẩm Sokfarm</h2>
                        <p className="text-muted-foreground">Mật hoa dừa hữu cơ và các sản phẩm chế biến</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <Card key={product.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                                <div className="relative aspect-square">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <CardDescription className="line-clamp-3 text-sm">
                                        {product.description}
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
                                        Thêm vào giỏ
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
                        Đặt hàng ngay hôm nay
                    </h2>
                    <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                        Liên hệ với chúng tôi để đặt hàng các sản phẩm mật hoa dừa hữu cơ Sokfarm
                    </p>
                    <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md">
                        Liên hệ đặt hàng
                    </Button>
                </div>
            </section>
        </Layout>
    );
}

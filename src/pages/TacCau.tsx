import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Phone, Star, Truck, Shield, Award } from "lucide-react";
import pineappleImage from "@/assets/pineapple-taccau.jpg";

const products = [
  {
    id: 1,
    name: "Khóm Tắc Cậu tươi",
    description: "Khóm tươi nguyên trái, thu hoạch trong ngày. Ngọt thanh, ít chua, thơm đặc trưng.",
    price: 35000,
    unit: "trái",
    rating: 4.9,
    sold: 1250,
    image: pineappleImage,
    badge: "Bán chạy",
  },
  {
    id: 2,
    name: "Bánh khóm Tắc Cậu",
    description: "Bánh khóm truyền thống, nhân khóm tươi, vỏ bánh giòn tan. Hộp 12 cái.",
    price: 85000,
    unit: "hộp",
    rating: 4.8,
    sold: 850,
    image: pineappleImage,
    badge: "Đặc sản",
  },
  {
    id: 3,
    name: "Mứt khóm Tắc Cậu",
    description: "Mứt khóm thủ công, nguyên liệu 100% khóm tươi, không chất bảo quản.",
    price: 65000,
    unit: "hũ 500g",
    rating: 4.7,
    sold: 620,
    image: pineappleImage,
    badge: null,
  },
  {
    id: 4,
    name: "Nước ép khóm",
    description: "Nước ép khóm nguyên chất, đóng chai thủy tinh. Thùng 6 chai.",
    price: 120000,
    unit: "thùng",
    rating: 4.6,
    sold: 380,
    image: pineappleImage,
    badge: "Mới",
  },
];

const features = [
  {
    icon: Award,
    title: "Chất lượng OCOP",
    description: "Đạt chứng nhận OCOP 4 sao",
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description: "Ship COD, nhận hàng trả tiền",
  },
  {
    icon: Shield,
    title: "Đảm bảo chất lượng",
    description: "Đổi trả nếu không ưng ý",
  },
];

export default function TacCau() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative bg-secondary py-12">
        <div className="container">
          <div className="text-center mb-8">
            <Badge className="bg-primary text-primary-foreground border-2 border-foreground mb-4">
              🍍 Đặc sản Kiên Giang
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Khóm Tắc Cậu
            </h1>
            <p className="text-xl text-secondary-foreground/80">
              Vàng trên đất mặn - Giống khóm chịu phèn mặn, ngọt thanh đặc biệt
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
              <h2 className="text-3xl font-bold">Câu chuyện Khóm Tắc Cậu</h2>
              <p className="text-muted-foreground">
                Tắc Cậu là vùng đất ven biển thuộc huyện Châu Thành, tỉnh Kiên Giang. 
                Nơi đây chịu ảnh hưởng nặng nề của xâm nhập mặn, nhưng bà con nông dân 
                đã biến thách thức thành cơ hội.
              </p>
              <p className="text-muted-foreground">
                Giống khóm Queen được chọn lọc và nhân giống qua nhiều thế hệ đã thích nghi 
                hoàn toàn với điều kiện đất phèn mặn. Độ mặn trong đất tạo nên hương vị 
                đặc trưng: ngọt thanh, ít chua, thơm nồng nàn.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-border bg-muted text-center">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Hecta canh tác</p>
                </div>
                <div className="p-4 border-2 border-border bg-muted text-center">
                  <p className="text-3xl font-bold text-secondary">200+</p>
                  <p className="text-sm text-muted-foreground">Hộ nông dân</p>
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
            <h2 className="text-3xl font-bold mb-2">Sản phẩm Khóm Tắc Cậu</h2>
            <p className="text-muted-foreground">Mua trực tiếp từ nhà vườn, đảm bảo chất lượng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground border-2 border-foreground">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      | Đã bán {product.sold}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                    <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button className="flex-1 border-2 border-foreground" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Thêm giỏ
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
            Bạn là nông dân trồng Khóm?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Đăng ký trở thành đối tác của Mekong Doctor để tiếp cận khách hàng trên toàn quốc. 
            Chúng tôi hỗ trợ vận chuyển, marketing và đảm bảo giá tốt nhất cho bạn.
          </p>
          <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md">
            Đăng ký bán hàng
          </Button>
        </div>
      </section>
    </Layout>
  );
}

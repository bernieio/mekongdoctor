import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, ShoppingCart, Phone, Star, Filter, Package, Wheat, Shrub } from "lucide-react";

const supplies = [
  {
    id: 1,
    name: "Máy đo độ mặn EC",
    description: "Máy đo độ mặn/độ dẫn điện cầm tay, chính xác cao, chống nước IP67",
    price: 850000,
    unit: "cái",
    rating: 4.8,
    sold: 320,
    category: "Thiết bị",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Phân bón hữu cơ Mekong",
    description: "Phân bón hữu cơ vi sinh, phù hợp với đất nhiễm mặn. Bao 25kg",
    price: 180000,
    unit: "bao",
    rating: 4.6,
    sold: 1200,
    category: "Phân bón",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Giống lúa chịu mặn OM18",
    description: "Giống lúa OM18 chịu mặn tốt, năng suất cao, thời gian sinh trưởng 95-100 ngày",
    price: 35000,
    unit: "kg",
    rating: 4.9,
    sold: 850,
    category: "Giống",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Vôi nông nghiệp",
    description: "Vite nông nghiệp dùng cải tạo đất phèn mặn. Bao 25kg",
    price: 45000,
    unit: "bao",
    rating: 4.5,
    sold: 2100,
    category: "Vật tư",
    image: "/placeholder.svg",
  },
];

const produce = [
  {
    id: 5,
    name: "Lúa ST25 (Gạo ngon nhất thế giới)",
    description: "Lúa ST25 mùa mới, đã phơi khô, độ ẩm 14%",
    price: 12000,
    unit: "kg",
    rating: 4.9,
    sold: 5200,
    category: "Lúa gạo",
    location: "Sóc Trăng",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Tôm sú loại 1",
    description: "Tôm sú size 20 con/kg, tươi sống, giao hàng trong ngày",
    price: 350000,
    unit: "kg",
    rating: 4.8,
    sold: 890,
    category: "Thủy sản",
    location: "Bạc Liêu",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Sầu riêng Monthong",
    description: "Sầu riêng Monthong chín cây, cơm vàng, hạt lép. Giá sỉ liên hệ",
    price: 150000,
    unit: "kg",
    rating: 4.7,
    sold: 420,
    category: "Trái cây",
    location: "Tiền Giang",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Xoài cát Hòa Lộc",
    description: "Xoài cát Hòa Lộc loại 1, trái 400-500g, ngọt thơm",
    price: 65000,
    unit: "kg",
    rating: 4.8,
    sold: 1100,
    category: "Trái cây",
    location: "Đồng Tháp",
    image: "/placeholder.svg",
  },
];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("supplies");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredSupplies = supplies.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProduce = produce.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-3xl font-bold text-primary-foreground">Chợ Nông sản Mekong</h1>
              <p className="text-primary-foreground/80">Mua vật tư - Bán nông sản - Kết nối chuỗi cung ứng</p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm, vật tư..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
                />
              </div>
              <Button variant="secondary" className="border-2 border-foreground">
                <Filter className="mr-2 h-4 w-4" />
                Lọc
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
                <span>Vật tư nông nghiệp</span>
              </TabsTrigger>
              <TabsTrigger value="produce" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wheat className="h-5 w-5" />
                <span>Nông sản</span>
              </TabsTrigger>
            </TabsList>

            {/* Supplies Tab */}
            <TabsContent value="supplies">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Vật tư Nông nghiệp</h2>
                <p className="text-muted-foreground">Thiết bị, phân bón, giống cây phù hợp với điều kiện ĐBSCL</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSupplies.map((item) => (
                  <Card key={item.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                    <div className="relative aspect-square bg-muted flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                      <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground border-2 border-border">
                        {item.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          | Đã bán {item.sold}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(item.price)}
                        <span className="text-sm font-normal text-muted-foreground">/{item.unit}</span>
                      </p>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1 border-2 border-foreground" size="sm">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Mua ngay
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
                <h2 className="text-2xl font-bold mb-2">Nông sản ĐBSCL</h2>
                <p className="text-muted-foreground">Mua trực tiếp từ nông dân, đảm bảo chất lượng và giá tốt</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProduce.map((item) => (
                  <Card key={item.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all">
                    <div className="relative aspect-square bg-muted flex items-center justify-center">
                      <Shrub className="h-16 w-16 text-muted-foreground" />
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-2 border-foreground">
                        {item.location}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground border-2 border-border">
                        {item.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          | Đã bán {item.sold}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(item.price)}
                        <span className="text-sm font-normal text-muted-foreground">/{item.unit}</span>
                      </p>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1 border-2 border-foreground" size="sm">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Đặt hàng
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
                <h3 className="text-2xl font-bold mb-2">Bạn muốn bán nông sản?</h3>
                <p className="text-muted-foreground">
                  Đăng ký trở thành người bán để tiếp cận hàng ngàn khách hàng trên toàn quốc
                </p>
              </div>
              <Button size="lg" className="border-2 border-foreground shadow-md shrink-0">
                Đăng ký bán hàng
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Bot, Store, Heart, AlertTriangle, TrendingUp, MapPin, ThermometerSun } from "lucide-react";
import heroImage from "@/assets/hero-mekong.jpg";
import farmerImage from "@/assets/farmer-checking.jpg";

const salinityAlerts = [
  { location: "Bến Tre - Bình Đại", level: 5.2, status: "danger" },
  { location: "Trà Vinh - Cầu Ngang", level: 4.1, status: "danger" },
  { location: "Sóc Trăng - Mỹ Xuyên", level: 3.5, status: "warning" },
  { location: "Kiên Giang - An Biên", level: 2.8, status: "warning" },
];

const quickStats = [
  { label: "Nông dân đang sử dụng", value: "12,500+", icon: TrendingUp },
  { label: "Lượt chẩn đoán AI", value: "45,000+", icon: Bot },
  { label: "Tỉnh/Thành phủ sóng", value: "13", icon: MapPin },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-secondary text-secondary-foreground border-2 border-foreground px-4 py-1">
              🌾 Nền tảng Nông nghiệp Thông minh
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Bác sĩ Mekong
              <br />
              <span className="text-secondary">Bảo vệ Đồng bằng</span>
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Giúp nông dân ĐBSCL ứng phó với xâm nhập mặn, kết nối chuyên gia AI, 
              tiếp cận chính sách hỗ trợ và thương mại hóa nông sản.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/diagnosis">
                <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md hover:shadow-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                  <Bot className="mr-2 h-5 w-5" />
                  Hỏi Bác sĩ AI
                </Button>
              </Link>
              <Link to="/taccau">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground hover:bg-primary-foreground/20">
                  <Store className="mr-2 h-5 w-5" />
                  Khóm Tắc Cậu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-b-2 border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-2 border-border bg-background">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salinity Alerts */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-accent bg-accent">
              <AlertTriangle className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Cảnh báo Độ mặn</h2>
              <p className="text-muted-foreground">Cập nhật theo thời gian thực</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {salinityAlerts.map((alert, index) => (
              <Card key={index} className={`border-2 ${alert.status === 'danger' ? 'border-destructive' : 'border-accent'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{alert.location}</p>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-2xl font-bold ${alert.status === 'danger' ? 'text-destructive' : 'text-accent'}`}>
                          {alert.level}g/L
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={alert.status === 'danger' ? 'destructive' : 'secondary'}
                      className="border-2 border-foreground"
                    >
                      {alert.status === 'danger' ? 'Nguy hiểm' : 'Cảnh báo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tính năng Chính</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mekong Doctor cung cấp giải pháp toàn diện giúp nông dân ĐBSCL ứng phó với biến đổi khí hậu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/diagnosis">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-primary mb-4 group-hover:bg-secondary group-hover:border-secondary transition-colors">
                    <Bot className="h-7 w-7 text-primary-foreground group-hover:text-secondary-foreground" />
                  </div>
                  <CardTitle>Bác sĩ AI</CardTitle>
                  <CardDescription>
                    Chẩn đoán tình trạng mặn và đưa ra giải pháp tức thì
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/taccau">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-secondary bg-secondary mb-4 group-hover:bg-primary group-hover:border-primary transition-colors">
                    <Store className="h-7 w-7 text-secondary-foreground group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle>Khóm Tắc Cậu</CardTitle>
                  <CardDescription>
                    Thương hiệu vàng trên đất mặn - Mua bán trực tiếp
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/community">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-accent bg-accent mb-4 group-hover:bg-primary group-hover:border-primary transition-colors">
                    <Heart className="h-7 w-7 text-accent-foreground group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle>Cộng đồng</CardTitle>
                  <CardDescription>
                    Học bổng, vay vốn 0% và kết nối đầu tư
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/marketplace">
              <Card className="h-full border-2 border-border bg-card hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-muted mb-4 group-hover:bg-primary transition-colors">
                    <ThermometerSun className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle>Chợ Nông sản</CardTitle>
                  <CardDescription>
                    Mua vật tư, bán sản phẩm, kết nối chuỗi cung ứng
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary-foreground">
                Bắt đầu Chẩn đoán Ngay
              </h2>
              <p className="text-primary-foreground/90">
                Chỉ cần nhập vị trí và chỉ số độ mặn, Bác sĩ AI của chúng tôi sẽ 
                phân tích và đưa ra giải pháp phù hợp cho loại cây trồng của bạn.
              </p>
              <Link to="/diagnosis">
                <Button size="lg" className="bg-secondary text-secondary-foreground border-2 border-foreground shadow-md">
                  <Droplets className="mr-2 h-5 w-5" />
                  Đo độ mặn ngay
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={farmerImage}
                alt="Nông dân kiểm tra độ mặn"
                className="border-4 border-primary-foreground shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

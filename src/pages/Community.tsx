import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Wallet, Handshake, Heart, Users, CheckCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("scholarship");

  const handleSubmit = (e: React.FormEvent, programType: string) => {
    e.preventDefault();
    toast({
      title: "Đã gửi hồ sơ thành công!",
      description: `Chúng tôi sẽ xem xét và liên hệ với bạn trong 3-5 ngày làm việc.`,
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-12">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-secondary bg-secondary">
              <Heart className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">Giving to Mekong Community</h1>
              <p className="text-primary-foreground/80">Cùng chung tay xây dựng cộng đồng nông nghiệp bền vững</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-primary-foreground/20 bg-primary-foreground/10">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">150+</p>
                  <p className="text-sm text-primary-foreground/80">Học bổng đã trao</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-2 border-primary-foreground/20 bg-primary-foreground/10">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">2.5 tỷ</p>
                  <p className="text-sm text-primary-foreground/80">Vốn vay đã giải ngân</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-2 border-primary-foreground/20 bg-primary-foreground/10">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">50+</p>
                  <p className="text-sm text-primary-foreground/80">Đối tác kết nối</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-12 bg-background">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto h-auto p-1 border-2 border-border">
              <TabsTrigger value="scholarship" className="flex flex-col py-3 gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs md:text-sm">Học bổng</span>
              </TabsTrigger>
              <TabsTrigger value="foundation" className="flex flex-col py-3 gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wallet className="h-5 w-5" />
                <span className="text-xs md:text-sm">Vay vốn 0%</span>
              </TabsTrigger>
              <TabsTrigger value="ventures" className="flex flex-col py-3 gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Handshake className="h-5 w-5" />
                <span className="text-xs md:text-sm">Kết nối đầu tư</span>
              </TabsTrigger>
            </TabsList>

            {/* Scholarship Tab */}
            <TabsContent value="scholarship">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-2 border-border">
                  <CardHeader>
                    <Badge className="w-fit bg-secondary text-secondary-foreground border-2 border-foreground mb-2">
                      Mekong Community Scholarship
                    </Badge>
                    <CardTitle>Học bổng cho con em nông dân</CardTitle>
                    <CardDescription>
                      Hỗ trợ học phí và chi phí sinh hoạt cho học sinh, sinh viên có hoàn cảnh khó khăn 
                      là con em gia đình nông dân ĐBSCL.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Điều kiện:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Là con em gia đình nông dân ĐBSCL</li>
                        <li>Học lực từ Khá trở lên</li>
                        <li>Gia đình có hoàn cảnh khó khăn</li>
                        <li>Có xác nhận của UBND xã/phường</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Mức hỗ trợ:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>THPT: 5-10 triệu đồng/năm</li>
                        <li>Đại học/Cao đẳng: 10-20 triệu đồng/năm</li>
                        <li>Thạc sĩ Nông nghiệp: 30 triệu đồng/năm</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle>Đăng ký Học bổng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, "scholarship")} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Họ và tên học sinh</Label>
                          <Input className="border-2" placeholder="Nguyễn Văn A" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Năm sinh</Label>
                          <Input className="border-2" type="number" placeholder="2005" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Cấp học</Label>
                        <Select required>
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Chọn cấp học" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thpt">THPT</SelectItem>
                            <SelectItem value="caodang">Cao đẳng</SelectItem>
                            <SelectItem value="daihoc">Đại học</SelectItem>
                            <SelectItem value="thacsi">Thạc sĩ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Trường đang học</Label>
                        <Input className="border-2" placeholder="Tên trường" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Điểm trung bình (năm gần nhất)</Label>
                        <Input className="border-2" type="number" step="0.1" placeholder="8.5" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Hoàn cảnh gia đình</Label>
                        <Textarea 
                          className="border-2 min-h-[100px]" 
                          placeholder="Mô tả hoàn cảnh gia đình, lý do xin học bổng..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại phụ huynh</Label>
                        <Input className="border-2" type="tel" placeholder="0912345678" required />
                      </div>
                      <Button type="submit" className="w-full border-2 border-foreground shadow-md">
                        <Send className="mr-2 h-4 w-4" />
                        Gửi hồ sơ
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Foundation Tab */}
            <TabsContent value="foundation">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-2 border-border">
                  <CardHeader>
                    <Badge className="w-fit bg-accent text-accent-foreground border-2 border-foreground mb-2">
                      Mekong Community Foundation
                    </Badge>
                    <CardTitle>Vay vốn 0% lãi suất</CardTitle>
                    <CardDescription>
                      Hỗ trợ nông dân tái sản xuất sau thiệt hại do xâm nhập mặn, 
                      thiên tai hoặc chuyển đổi mô hình canh tác.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Điều kiện:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Là nông dân đang canh tác tại ĐBSCL</li>
                        <li>Bị thiệt hại do xâm nhập mặn hoặc thiên tai</li>
                        <li>Có kế hoạch sử dụng vốn rõ ràng</li>
                        <li>Cam kết trả vốn đúng hạn</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Mức vay:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Tối đa: 50 triệu đồng/hộ</li>
                        <li>Thời hạn: 12-24 tháng</li>
                        <li>Lãi suất: 0%</li>
                        <li>Không cần tài sản thế chấp</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle>Đăng ký Vay vốn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, "foundation")} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Họ và tên</Label>
                          <Input className="border-2" placeholder="Nguyễn Văn B" required />
                        </div>
                        <div className="space-y-2">
                          <Label>CCCD</Label>
                          <Input className="border-2" placeholder="012345678901" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Địa chỉ (Xã/Huyện/Tỉnh)</Label>
                        <Input className="border-2" placeholder="Xã A, Huyện B, Tỉnh C" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Diện tích canh tác (ha)</Label>
                        <Input className="border-2" type="number" step="0.1" placeholder="1.5" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Số tiền cần vay (VNĐ)</Label>
                        <Select required>
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Chọn mức vay" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 triệu đồng</SelectItem>
                            <SelectItem value="20">20 triệu đồng</SelectItem>
                            <SelectItem value="30">30 triệu đồng</SelectItem>
                            <SelectItem value="50">50 triệu đồng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Mục đích sử dụng vốn</Label>
                        <Textarea 
                          className="border-2 min-h-[100px]" 
                          placeholder="Mua giống, phân bón, chuyển đổi cây trồng..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input className="border-2" type="tel" placeholder="0912345678" required />
                      </div>
                      <Button type="submit" className="w-full border-2 border-foreground shadow-md">
                        <Send className="mr-2 h-4 w-4" />
                        Gửi đăng ký
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Ventures Tab */}
            <TabsContent value="ventures">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-2 border-border">
                  <CardHeader>
                    <Badge className="w-fit bg-primary text-primary-foreground border-2 border-foreground mb-2">
                      Mekong Community Ventures
                    </Badge>
                    <CardTitle>Kết nối đầu tư & Bao tiêu</CardTitle>
                    <CardDescription>
                      Kết nối nông dân với doanh nghiệp, nhà đầu tư để chuyển giao kỹ thuật, 
                      bao tiêu sản phẩm và phát triển chuỗi giá trị nông sản.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Hình thức hợp tác:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Bao tiêu sản phẩm theo hợp đồng</li>
                        <li>Chuyển giao kỹ thuật và giống mới</li>
                        <li>Đầu tư vốn và công nghệ</li>
                        <li>Hỗ trợ chứng nhận (VietGAP, OCOP...)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Đối tác hiện có:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Công ty TNHH Nông sản Mekong</li>
                        <li>HTX Nông nghiệp Sáng tạo</li>
                        <li>Quỹ đầu tư Nông nghiệp Xanh</li>
                        <li>Viện Nghiên cứu Nông nghiệp ĐBSCL</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle>Đăng ký Kết nối</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => handleSubmit(e, "ventures")} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tên cá nhân/HTX/Doanh nghiệp</Label>
                        <Input className="border-2" placeholder="HTX Nông nghiệp ABC" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Loại hình</Label>
                        <Select required>
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Chọn loại hình" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="canhan">Cá nhân/Hộ nông dân</SelectItem>
                            <SelectItem value="htx">Hợp tác xã</SelectItem>
                            <SelectItem value="doanhnghiep">Doanh nghiệp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Sản phẩm chính</Label>
                        <Input className="border-2" placeholder="Lúa, Tôm, Khóm..." required />
                      </div>
                      <div className="space-y-2">
                        <Label>Quy mô (ha hoặc sản lượng/năm)</Label>
                        <Input className="border-2" placeholder="10 ha hoặc 50 tấn/năm" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Nhu cầu hợp tác</Label>
                        <Textarea 
                          className="border-2 min-h-[100px]" 
                          placeholder="Cần bao tiêu sản phẩm, chuyển giao kỹ thuật, vốn đầu tư..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại liên hệ</Label>
                        <Input className="border-2" type="tel" placeholder="0912345678" required />
                      </div>
                      <Button type="submit" className="w-full border-2 border-foreground shadow-md">
                        <Send className="mr-2 h-4 w-4" />
                        Gửi yêu cầu kết nối
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}

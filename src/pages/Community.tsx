import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Wallet, Handshake, Heart, Users, CheckCircle, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import backgroundImage from "@/assets/cong-dong-background.jpeg";

interface ScholarshipForm {
  fullName: string;
  email: string;
  phone: string;
}

interface LoanForm {
  fullName: string;
  phone: string;
}

interface VentureForm {
  businessName: string;
  phone: string;
}

export default function Community() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("scholarship");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [scholarshipForm, setScholarshipForm] = useState<ScholarshipForm>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loanForm, setLoanForm] = useState<LoanForm>({
    fullName: "",
    phone: "",
  });
  const [ventureForm, setVentureForm] = useState<VentureForm>({
    businessName: "",
    phone: "",
  });

  const resetForms = () => {
    setScholarshipForm({ fullName: "", email: "", phone: "" });
    setLoanForm({ fullName: "", phone: "" });
    setVentureForm({ businessName: "", phone: "" });
  };

  const handleScholarshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("save-community-application", {
        body: {
          clerkUserId: null,
          applicationType: "scholarship",
          fullName: scholarshipForm.fullName,
          email: scholarshipForm.email,
          phone: scholarshipForm.phone,
        },
      });

      if (error) throw error;

      toast({
        title: t("community.form.success"),
        description: t("community.form.success.description"),
      });
      resetForms();
    } catch (error) {
      console.error("Error submitting scholarship:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể gửi đơn đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("save-community-application", {
        body: {
          clerkUserId: null,
          applicationType: "loan",
          fullName: loanForm.fullName,
          phone: loanForm.phone,
        },
      });

      if (error) throw error;

      toast({
        title: t("community.form.success"),
        description: t("community.form.success.description"),
      });
      resetForms();
    } catch (error) {
      console.error("Error submitting loan:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể gửi đơn đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVentureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("save-community-application", {
        body: {
          clerkUserId: null,
          applicationType: "venture",
          businessName: ventureForm.businessName,
          phone: ventureForm.phone,
        },
      });

      if (error) throw error;

      toast({
        title: t("community.form.success"),
        description: t("community.form.success.description"),
      });
      resetForms();
    } catch (error) {
      console.error("Error submitting venture:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể gửi đơn đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-secondary bg-secondary">
              <Heart className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">{t("community.title")}</h1>
              <p className="text-primary-foreground/80">{t("community.subtitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-primary-foreground/20 bg-primary-foreground/10">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">150+</p>
                  <p className="text-sm text-primary-foreground/80">{t("community.scholarship.awarded")}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-2 border-primary-foreground/20 bg-primary-foreground/10">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">2.5 tỷ</p>
                  <p className="text-sm text-primary-foreground/80">{t("community.loan.disbursed")}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-2 border-primary-foreground/20 bg-primary-foreground/10">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-primary-foreground">50+</p>
                  <p className="text-sm text-primary-foreground/80">{t("community.ventures.partners")}</p>
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
                <span className="text-xs md:text-sm">{t("community.scholarship")}</span>
              </TabsTrigger>
              <TabsTrigger value="foundation" className="flex flex-col py-3 gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Wallet className="h-5 w-5" />
                <span className="text-xs md:text-sm">{t("community.loan")}</span>
              </TabsTrigger>
              <TabsTrigger value="ventures" className="flex flex-col py-3 gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Handshake className="h-5 w-5" />
                <span className="text-xs md:text-sm">{t("community.ventures")}</span>
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
                    <CardTitle>{t("community.scholarship.title")}</CardTitle>
                    <CardDescription>{t("community.scholarship.description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Điều kiện / Requirements:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Là con em gia đình nông dân ĐBSCL</li>
                        <li>Học lực từ Khá trở lên</li>
                        <li>Gia đình có hoàn cảnh khó khăn</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle>Đăng ký / Apply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleScholarshipSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Họ và tên / Full Name</Label>
                        <Input
                          className="border-2"
                          placeholder="Nguyễn Văn A"
                          required
                          value={scholarshipForm.fullName}
                          onChange={(e) => setScholarshipForm({ ...scholarshipForm, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          className="border-2"
                          type="email"
                          placeholder="email@example.com"
                          required
                          value={scholarshipForm.email}
                          onChange={(e) => setScholarshipForm({ ...scholarshipForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại / Phone</Label>
                        <Input
                          className="border-2"
                          type="tel"
                          placeholder="0912345678"
                          required
                          value={scholarshipForm.phone}
                          onChange={(e) => setScholarshipForm({ ...scholarshipForm, phone: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full border-2 border-foreground shadow-md" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t("community.form.submit")}
                          </>
                        )}
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
                    <CardTitle>{t("community.loan.title")}</CardTitle>
                    <CardDescription>{t("community.loan.description")}</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle>Đăng ký / Apply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLoanSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Họ và tên / Full Name</Label>
                        <Input
                          className="border-2"
                          required
                          value={loanForm.fullName}
                          onChange={(e) => setLoanForm({ ...loanForm, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại / Phone</Label>
                        <Input
                          className="border-2"
                          type="tel"
                          required
                          value={loanForm.phone}
                          onChange={(e) => setLoanForm({ ...loanForm, phone: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full border-2 border-foreground shadow-md" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t("community.form.register")}
                          </>
                        )}
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
                    <CardTitle>{t("community.ventures.title")}</CardTitle>
                    <CardDescription>{t("community.ventures.description")}</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 border-border">
                  <CardHeader>
                    <CardTitle>Đăng ký / Apply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleVentureSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tên cá nhân/doanh nghiệp</Label>
                        <Input
                          className="border-2"
                          required
                          value={ventureForm.businessName}
                          onChange={(e) => setVentureForm({ ...ventureForm, businessName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại / Phone</Label>
                        <Input
                          className="border-2"
                          type="tel"
                          required
                          value={ventureForm.phone}
                          onChange={(e) => setVentureForm({ ...ventureForm, phone: e.target.value })}
                        />
                      </div>
                      <Button type="submit" className="w-full border-2 border-foreground shadow-md" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t("community.form.register")}
                          </>
                        )}
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

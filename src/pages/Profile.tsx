import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Shield, Loader2, Save } from "lucide-react";
import { DiagnosisHistory } from "@/components/DiagnosisHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const provinces = [
  { value: "an-giang", label: "An Giang" },
  { value: "bac-lieu", label: "Bạc Liêu" },
  { value: "ben-tre", label: "Bến Tre" },
  { value: "ca-mau", label: "Cà Mau" },
  { value: "can-tho", label: "Cần Thơ" },
  { value: "dong-thap", label: "Đồng Tháp" },
  { value: "hau-giang", label: "Hậu Giang" },
  { value: "kien-giang", label: "Kiên Giang" },
  { value: "long-an", label: "Long An" },
  { value: "soc-trang", label: "Sóc Trăng" },
  { value: "tien-giang", label: "Tiền Giang" },
  { value: "tra-vinh", label: "Trà Vinh" },
  { value: "vinh-long", label: "Vĩnh Long" },
];

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { profile, roles, isLoading: authLoading, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    province: "",
    district: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        province: profile.province || "",
        district: profile.district || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user?.id && !profile) {
      refreshProfile(user.id);
    }
  }, [user?.id, profile, refreshProfile]);

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U";
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "expert": return "default";
      default: return "secondary";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return t("profile.role.admin");
      case "expert": return t("profile.role.expert");
      default: return t("profile.role.farmer");
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke("update-profile", {
        body: {
          clerkUserId: user.id,
          ...formData,
        },
      });

      if (error) throw error;

      await refreshProfile(user.id);
      setIsEditing(false);
      toast({
        title: t("profile.saveSuccess"),
        description: t("profile.saveSuccessDescription"),
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: t("profile.saveError"),
        description: t("profile.saveErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || authLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-8">
          <Card className="max-w-md mx-auto border-2">
            <CardContent className="pt-6 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{t("profile.notSignedIn")}</p>
              <Button className="mt-4" asChild>
                <a href="/auth">{t("auth.signIn")}</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.fullName || user.emailAddresses?.[0]?.emailAddress}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.emailAddresses?.[0]?.emailAddress}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role)}>
                          <Shield className="h-3 w-3 mr-1" />
                          {getRoleLabel(role)}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleLabel("farmer")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("profile.details")}</CardTitle>
                  <CardDescription>{t("profile.detailsDescription")}</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    {t("profile.edit")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("profile.fullName")}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder={t("profile.fullNamePlaceholder")}
                    />
                  ) : (
                    <p className="text-foreground py-2">
                      {profile?.full_name || user.fullName || "-"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("profile.phone")}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912345678"
                    />
                  ) : (
                    <p className="text-foreground py-2">{profile?.phone || "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t("profile.province")}
                  </Label>
                  {isEditing ? (
                    <Select
                      value={formData.province}
                      onValueChange={(value) => setFormData({ ...formData, province: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("common.select")} />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-foreground py-2">
                      {provinces.find((p) => p.value === profile?.province)?.label || profile?.province || "-"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t("profile.district")}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder={t("profile.districtPlaceholder")}
                    />
                  ) : (
                    <p className="text-foreground py-2">{profile?.district || "-"}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {t("profile.save")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      if (profile) {
                        setFormData({
                          full_name: profile.full_name || "",
                          phone: profile.phone || "",
                          province: profile.province || "",
                          district: profile.district || "",
                        });
                      }
                    }}
                  >
                    {t("profile.cancel")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diagnosis History */}
          <DiagnosisHistory clerkUserId={user.id} />
        </div>
      </div>
    </Layout>
  );
}

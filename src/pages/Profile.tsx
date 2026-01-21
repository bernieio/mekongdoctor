import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Profile() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container py-8">
        <Card className="max-w-md mx-auto border-2">
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Trang cá nhân</h2>
            <p className="text-muted-foreground">
              Tính năng này hiện không khả dụng do ứng dụng đang ở chế độ mở (không yêu cầu đăng nhập).
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

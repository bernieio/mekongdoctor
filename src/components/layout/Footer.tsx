import { Droplets, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-sidebar text-sidebar-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-sidebar-primary bg-sidebar-primary">
                <Droplets className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Mekong Doctor</span>
            </div>
            <p className="text-sm text-sidebar-foreground/80">
              Nền tảng hỗ trợ nông dân ĐBSCL ứng phó với xâm nhập mặn và phát triển nông nghiệp bền vững.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/diagnosis" className="hover:text-sidebar-primary transition-colors">
                  Chẩn đoán AI
                </a>
              </li>
              <li>
                <a href="/taccau" className="hover:text-sidebar-primary transition-colors">
                  Khóm Tắc Cậu
                </a>
              </li>
              <li>
                <a href="/community" className="hover:text-sidebar-primary transition-colors">
                  Cộng đồng Mekong
                </a>
              </li>
              <li>
                <a href="/marketplace" className="hover:text-sidebar-primary transition-colors">
                  Chợ Nông sản
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>Hướng dẫn sử dụng</li>
              <li>Câu hỏi thường gặp</li>
              <li>Chính sách bảo mật</li>
              <li>Điều khoản dịch vụ</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+84563******</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>phunhuanbuilder@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/60">
          © 2026 Mekong Doctor. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}

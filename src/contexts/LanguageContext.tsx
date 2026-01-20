import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "vi" | "en" | "ko";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
export const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Brand & Navigation
    "brand.name": "Mekong Doctor",
    "nav.home": "Trang chủ",
    "nav.diagnosis": "Bác sĩ AI",
    "nav.taccau": "Khóm Tắc Cậu",
    "nav.community": "Cộng đồng",
    "nav.marketplace": "Chợ Nông sản",
    "nav.login": "Đăng nhập",
    
    // Hero Section
    "hero.badge": "🌾 Nền tảng Nông nghiệp Thông minh",
    "hero.title": "Bác sĩ Mekong",
    "hero.subtitle": "Bảo vệ Đồng bằng",
    "hero.description": "Giúp nông dân ĐBSCL ứng phó với xâm nhập mặn, kết nối chuyên gia AI, tiếp cận chính sách hỗ trợ và thương mại hóa nông sản.",
    "hero.cta.diagnosis": "Hỏi Bác sĩ AI",
    "hero.cta.taccau": "Khóm Tắc Cậu",
    
    // Stats
    "stats.farmers": "Nông dân đang sử dụng",
    "stats.diagnosis": "Lượt chẩn đoán AI",
    "stats.provinces": "Tỉnh/Thành phủ sóng",
    
    // Salinity Alerts
    "alerts.title": "Cảnh báo Độ mặn",
    "alerts.subtitle": "Cập nhật theo thời gian thực",
    "alerts.danger": "Nguy hiểm",
    "alerts.warning": "Cảnh báo",
    "alerts.high": "Cảnh báo độ mặn cao!",
    
    // Features
    "features.title": "Tính năng Chính",
    "features.description": "Mekong Doctor cung cấp giải pháp toàn diện giúp nông dân ĐBSCL ứng phó với biến đổi khí hậu",
    "features.diagnosis.title": "Bác sĩ AI",
    "features.diagnosis.description": "Chẩn đoán tình trạng mặn và đưa ra giải pháp tức thì",
    "features.taccau.title": "Khóm Tắc Cậu",
    "features.taccau.description": "Thương hiệu vàng trên đất mặn - Mua bán trực tiếp",
    "features.community.title": "Cộng đồng",
    "features.community.description": "Học bổng, vay vốn 0% và kết nối đầu tư",
    "features.marketplace.title": "Chợ Nông sản",
    "features.marketplace.description": "Mua vật tư, bán sản phẩm, kết nối chuỗi cung ứng",
    
    // CTA Section
    "cta.title": "Bắt đầu Chẩn đoán Ngay",
    "cta.description": "Chỉ cần nhập vị trí và chỉ số độ mặn, Bác sĩ AI của chúng tôi sẽ phân tích và đưa ra giải pháp phù hợp cho loại cây trồng của bạn.",
    "cta.button": "Đo độ mặn ngay",
    
    // Diagnosis Page
    "diagnosis.title": "Bác sĩ Mekong AI",
    "diagnosis.subtitle": "Chẩn đoán tình trạng xâm nhập mặn và đề xuất giải pháp",
    "diagnosis.form.title": "Nhập thông tin chẩn đoán",
    "diagnosis.form.description": "Điền đầy đủ thông tin để Bác sĩ AI phân tích chính xác",
    "diagnosis.form.province": "Tỉnh/Thành phố",
    "diagnosis.form.district": "Quận/Huyện",
    "diagnosis.form.cropType": "Loại cây trồng",
    "diagnosis.form.salinity": "Độ mặn đo được (g/L hoặc ‰)",
    "diagnosis.form.symptoms": "Triệu chứng quan sát (nếu có)",
    "diagnosis.form.image": "Hình ảnh (tùy chọn)",
    "diagnosis.form.submit": "Gửi chẩn đoán",
    "diagnosis.form.analyzing": "Đang phân tích...",
    "diagnosis.result.title": "Kết quả Chẩn đoán",
    "diagnosis.result.safe": "An toàn",
    "diagnosis.result.warning": "Cảnh báo",
    "diagnosis.result.danger": "Nguy hiểm",
    "diagnosis.result.solutions": "Giải pháp đề xuất:",
    "diagnosis.result.policy": "💡 Chính sách hỗ trợ:",
    "diagnosis.ready.title": "Sẵn sàng Chẩn đoán",
    "diagnosis.ready.description": "Điền thông tin bên trái và nhấn \"Gửi chẩn đoán\" để nhận kết quả phân tích từ Bác sĩ AI",
    "diagnosis.tips.title": "📚 Mẹo đo độ mặn",
    "diagnosis.tips.1": "• Đo vào buổi sáng sớm hoặc chiều mát để kết quả chính xác",
    "diagnosis.tips.2": "• Đo ở nhiều điểm trong ruộng/ao và lấy giá trị trung bình",
    "diagnosis.tips.3": "• Tránh đo sau khi mưa lớn hoặc xả nước",
    "diagnosis.tips.4": "• Kiểm tra định kỳ 2-3 lần/tuần trong mùa khô",
    
    // Marketplace
    "marketplace.title": "Chợ Nông sản Mekong",
    "marketplace.subtitle": "Mua vật tư - Bán nông sản - Kết nối chuỗi cung ứng",
    "marketplace.search": "Tìm kiếm sản phẩm, vật tư...",
    "marketplace.filter": "Lọc",
    "marketplace.supplies": "Vật tư nông nghiệp",
    "marketplace.produce": "Nông sản",
    "marketplace.supplies.title": "Vật tư Nông nghiệp",
    "marketplace.supplies.description": "Thiết bị, phân bón, giống cây phù hợp với điều kiện ĐBSCL",
    "marketplace.produce.title": "Nông sản ĐBSCL",
    "marketplace.produce.description": "Mua trực tiếp từ nông dân, đảm bảo chất lượng và giá tốt",
    "marketplace.sold": "Đã bán",
    "marketplace.buy": "Mua ngay",
    "marketplace.order": "Đặt hàng",
    "marketplace.seller.title": "Bạn muốn bán nông sản?",
    "marketplace.seller.description": "Đăng ký trở thành người bán để tiếp cận hàng ngàn khách hàng trên toàn quốc",
    "marketplace.seller.register": "Đăng ký bán hàng",
    
    // TacCau Page
    "taccau.badge": "🍍 Đặc sản Kiên Giang",
    "taccau.title": "Khóm Tắc Cậu",
    "taccau.subtitle": "Vàng trên đất mặn - Giống khóm chịu phèn mặn, ngọt thanh đặc biệt",
    "taccau.quality": "Chất lượng OCOP",
    "taccau.quality.desc": "Đạt chứng nhận OCOP 4 sao",
    "taccau.delivery": "Giao hàng toàn quốc",
    "taccau.delivery.desc": "Ship COD, nhận hàng trả tiền",
    "taccau.guarantee": "Đảm bảo chất lượng",
    "taccau.guarantee.desc": "Đổi trả nếu không ưng ý",
    "taccau.story.title": "Câu chuyện Khóm Tắc Cậu",
    "taccau.story.p1": "Tắc Cậu là vùng đất ven biển thuộc huyện Châu Thành, tỉnh Kiên Giang. Nơi đây chịu ảnh hưởng nặng nề của xâm nhập mặn, nhưng bà con nông dân đã biến thách thức thành cơ hội.",
    "taccau.story.p2": "Giống khóm Queen được chọn lọc và nhân giống qua nhiều thế hệ đã thích nghi hoàn toàn với điều kiện đất phèn mặn. Độ mặn trong đất tạo nên hương vị đặc trưng: ngọt thanh, ít chua, thơm nồng nàn.",
    "taccau.stats.hectares": "Hecta canh tác",
    "taccau.stats.farmers": "Hộ nông dân",
    "taccau.products.title": "Sản phẩm Khóm Tắc Cậu",
    "taccau.products.subtitle": "Mua trực tiếp từ nhà vườn, đảm bảo chất lượng",
    "taccau.addcart": "Thêm giỏ",
    "taccau.cta.title": "Bạn là nông dân trồng Khóm?",
    "taccau.cta.description": "Đăng ký trở thành đối tác của Mekong Doctor để tiếp cận khách hàng trên toàn quốc. Chúng tôi hỗ trợ vận chuyển, marketing và đảm bảo giá tốt nhất cho bạn.",
    "taccau.cta.register": "Đăng ký bán hàng",
    
    // Community Page
    "community.title": "Giving to Mekong Community",
    "community.subtitle": "Cùng chung tay xây dựng cộng đồng nông nghiệp bền vững",
    "community.scholarship": "Học bổng",
    "community.scholarship.awarded": "Học bổng đã trao",
    "community.loan": "Vay vốn 0%",
    "community.loan.disbursed": "Vốn vay đã giải ngân",
    "community.ventures": "Kết nối đầu tư",
    "community.ventures.partners": "Đối tác kết nối",
    "community.scholarship.title": "Học bổng cho con em nông dân",
    "community.scholarship.description": "Hỗ trợ học phí và chi phí sinh hoạt cho học sinh, sinh viên có hoàn cảnh khó khăn là con em gia đình nông dân ĐBSCL.",
    "community.loan.title": "Vay vốn 0% lãi suất",
    "community.loan.description": "Hỗ trợ nông dân tái sản xuất sau thiệt hại do xâm nhập mặn, thiên tai hoặc chuyển đổi mô hình canh tác.",
    "community.ventures.title": "Kết nối đầu tư & Bao tiêu",
    "community.ventures.description": "Kết nối nông dân với doanh nghiệp, nhà đầu tư để chuyển giao kỹ thuật, bao tiêu sản phẩm và phát triển chuỗi giá trị nông sản.",
    "community.form.submit": "Gửi hồ sơ",
    "community.form.register": "Gửi đăng ký",
    "community.form.success": "Đã gửi hồ sơ thành công!",
    "community.form.success.description": "Chúng tôi sẽ xem xét và liên hệ với bạn trong 3-5 ngày làm việc.",
    
    // Common
    "common.select": "Chọn",
    "common.enter": "Nhập",
    "common.threshold": "ngưỡng",
    
    // Auth
    "auth.signIn": "Đăng nhập",
    "auth.signUp": "Đăng ký",
    "auth.signOut": "Đăng xuất",
    "auth.signInDescription": "Đăng nhập để sử dụng đầy đủ tính năng",
    "auth.signUpDescription": "Tạo tài khoản mới để bắt đầu",
    "auth.noAccount": "Chưa có tài khoản?",
    "auth.hasAccount": "Đã có tài khoản?",
    "nav.profile": "Hồ sơ",
    "nav.settings": "Cài đặt",
    
    // Profile
    "profile.details": "Thông tin cá nhân",
    "profile.detailsDescription": "Quản lý thông tin hồ sơ của bạn",
    "profile.edit": "Chỉnh sửa",
    "profile.save": "Lưu",
    "profile.cancel": "Hủy",
    "profile.fullName": "Họ và tên",
    "profile.fullNamePlaceholder": "Nguyễn Văn A",
    "profile.phone": "Số điện thoại",
    "profile.province": "Tỉnh/Thành phố",
    "profile.district": "Quận/Huyện",
    "profile.districtPlaceholder": "Nhập tên quận/huyện",
    "profile.role.farmer": "Nông dân",
    "profile.role.expert": "Chuyên gia",
    "profile.role.admin": "Quản trị viên",
    "profile.notSignedIn": "Vui lòng đăng nhập để xem hồ sơ",
    "profile.saveSuccess": "Đã lưu thành công",
    "profile.saveSuccessDescription": "Thông tin hồ sơ đã được cập nhật",
    "profile.saveError": "Lỗi lưu hồ sơ",
    "profile.saveErrorDescription": "Không thể lưu thông tin. Vui lòng thử lại.",
    // Map
    "map.title": "Bản đồ Độ mặn ĐBSCL",
    "map.loading": "Đang tải bản đồ...",
    "map.unavailable": "Bản đồ tạm thời không khả dụng",
    "map.realtime": "Thời gian thực",
    "map.legend": "Chú thích độ mặn",
    
    // Admin
    "admin.dashboard": "Bảng điều khiển Admin",
    "admin.dashboardDescription": "Quản lý người dùng và xem thống kê hệ thống",
    "admin.refresh": "Làm mới",
    "admin.totalUsers": "Tổng người dùng",
    "admin.registeredUsers": "Đã đăng ký",
    "admin.activeToday": "Hoạt động hôm nay",
    "admin.last24Hours": "24 giờ qua",
    "admin.newThisWeek": "Mới trong tuần",
    "admin.newRegistrations": "Đăng ký mới",
    "admin.totalDiagnoses": "Tổng chẩn đoán",
    "admin.aiDiagnoses": "Chẩn đoán AI",
    "admin.users": "Người dùng",
    "admin.activity": "Hoạt động",
    "admin.userManagement": "Quản lý người dùng",
    "admin.userManagementDescription": "Xem và quản lý tài khoản người dùng",
    "admin.noUsers": "Chưa có người dùng nào",
    "admin.user": "Người dùng",
    "admin.email": "Email",
    "admin.province": "Tỉnh/TP",
    "admin.joined": "Ngày tham gia",
    "admin.status": "Trạng thái",
    "admin.active": "Hoạt động",
    "admin.recentActivity": "Hoạt động gần đây",
    "admin.recentActivityDescription": "Xem hoạt động của người dùng trên hệ thống",
    "admin.activityComingSoon": "Tính năng đang phát triển",
    "admin.accessDenied": "Từ chối truy cập",
    "admin.accessDeniedDescription": "Bạn không có quyền truy cập trang này",
    
    // AI Response Language
    "ai.language": "tiếng Việt",
  },
  en: {
    // Brand & Navigation
    "brand.name": "Mekong Doctor",
    "nav.home": "Home",
    "nav.diagnosis": "AI Doctor",
    "nav.taccau": "Tac Cau Pineapple",
    "nav.community": "Community",
    "nav.marketplace": "Marketplace",
    "nav.login": "Login",
    
    // Hero Section
    "hero.badge": "🌾 Smart Agriculture Platform",
    "hero.title": "Mekong Doctor",
    "hero.subtitle": "Protecting the Delta",
    "hero.description": "Helping Mekong Delta farmers cope with saline intrusion, connect with AI experts, access support policies and commercialize agricultural products.",
    "hero.cta.diagnosis": "Ask AI Doctor",
    "hero.cta.taccau": "Tac Cau Pineapple",
    
    // Stats
    "stats.farmers": "Active Farmers",
    "stats.diagnosis": "AI Diagnoses",
    "stats.provinces": "Provinces Covered",
    
    // Salinity Alerts
    "alerts.title": "Salinity Alerts",
    "alerts.subtitle": "Real-time updates",
    "alerts.danger": "Danger",
    "alerts.warning": "Warning",
    "alerts.high": "High Salinity Alert!",
    
    // Features
    "features.title": "Key Features",
    "features.description": "Mekong Doctor provides comprehensive solutions to help Mekong Delta farmers cope with climate change",
    "features.diagnosis.title": "AI Diagnosis",
    "features.diagnosis.description": "Diagnose salinity conditions and provide instant solutions",
    "features.taccau.title": "Tac Cau Pineapple",
    "features.taccau.description": "Golden brand on salty land - Direct trading",
    "features.community.title": "Giving to Community",
    "features.community.description": "Scholarships, 0% interest loans and investment connections",
    "features.marketplace.title": "Tac Cau Marketplace",
    "features.marketplace.description": "Buy supplies, sell products, connect supply chain",
    
    // CTA Section
    "cta.title": "Start Diagnosis Now",
    "cta.description": "Just enter your location and salinity level, our AI Doctor will analyze and provide suitable solutions for your crop type.",
    "cta.button": "Measure Salinity Now",
    
    // Diagnosis Page
    "diagnosis.title": "Mekong AI Doctor",
    "diagnosis.subtitle": "Diagnose saline intrusion conditions and recommend solutions",
    "diagnosis.form.title": "Enter Diagnosis Information",
    "diagnosis.form.description": "Fill in complete information for accurate AI analysis",
    "diagnosis.form.province": "Province/City",
    "diagnosis.form.district": "District",
    "diagnosis.form.cropType": "Crop Type",
    "diagnosis.form.salinity": "Measured Salinity (g/L or ‰)",
    "diagnosis.form.symptoms": "Observed Symptoms (if any)",
    "diagnosis.form.image": "Images (optional)",
    "diagnosis.form.submit": "Submit Diagnosis",
    "diagnosis.form.analyzing": "Analyzing...",
    "diagnosis.result.title": "Diagnosis Result",
    "diagnosis.result.safe": "Safe",
    "diagnosis.result.warning": "Warning",
    "diagnosis.result.danger": "Danger",
    "diagnosis.result.solutions": "Recommended Solutions:",
    "diagnosis.result.policy": "💡 Support Policy:",
    "diagnosis.ready.title": "Ready for Diagnosis",
    "diagnosis.ready.description": "Fill in the information on the left and click \"Submit Diagnosis\" to receive analysis results from AI Doctor",
    "diagnosis.tips.title": "📚 Salinity Measurement Tips",
    "diagnosis.tips.1": "• Measure in early morning or cool afternoon for accurate results",
    "diagnosis.tips.2": "• Measure at multiple points in the field/pond and take average",
    "diagnosis.tips.3": "• Avoid measuring after heavy rain or water drainage",
    "diagnosis.tips.4": "• Check regularly 2-3 times/week during dry season",
    
    // Marketplace
    "marketplace.title": "Mekong Agricultural Market",
    "marketplace.subtitle": "Buy supplies - Sell produce - Connect supply chain",
    "marketplace.search": "Search products, supplies...",
    "marketplace.filter": "Filter",
    "marketplace.supplies": "Agricultural Supplies",
    "marketplace.produce": "Farm Products",
    "marketplace.supplies.title": "Agricultural Supplies",
    "marketplace.supplies.description": "Equipment, fertilizers, varieties suitable for Mekong Delta conditions",
    "marketplace.produce.title": "Mekong Delta Products",
    "marketplace.produce.description": "Buy directly from farmers, guaranteed quality and good prices",
    "marketplace.sold": "Sold",
    "marketplace.buy": "Buy Now",
    "marketplace.order": "Order",
    "marketplace.seller.title": "Want to sell your products?",
    "marketplace.seller.description": "Register as a seller to reach thousands of customers nationwide",
    "marketplace.seller.register": "Register to Sell",
    
    // TacCau Page
    "taccau.badge": "🍍 Kien Giang Specialty",
    "taccau.title": "Tac Cau Pineapple",
    "taccau.subtitle": "Gold on salty land - Salt-tolerant pineapple with unique sweet flavor",
    "taccau.quality": "OCOP Quality",
    "taccau.quality.desc": "4-star OCOP certified",
    "taccau.delivery": "Nationwide Delivery",
    "taccau.delivery.desc": "COD shipping, pay on delivery",
    "taccau.guarantee": "Quality Guaranteed",
    "taccau.guarantee.desc": "Return if not satisfied",
    "taccau.story.title": "The Story of Tac Cau Pineapple",
    "taccau.story.p1": "Tac Cau is a coastal area in Chau Thanh district, Kien Giang province. This place is heavily affected by saline intrusion, but farmers have turned challenges into opportunities.",
    "taccau.story.p2": "The Queen pineapple variety has been selected and bred over generations to fully adapt to acidic and saline soil conditions. The salinity in the soil creates a distinctive flavor: mildly sweet, less sour, intensely fragrant.",
    "taccau.stats.hectares": "Hectares cultivated",
    "taccau.stats.farmers": "Farming households",
    "taccau.products.title": "Tac Cau Pineapple Products",
    "taccau.products.subtitle": "Buy directly from orchards, guaranteed quality",
    "taccau.addcart": "Add to Cart",
    "taccau.cta.title": "Are you a pineapple farmer?",
    "taccau.cta.description": "Register as a Mekong Doctor partner to reach customers nationwide. We support shipping, marketing and ensure the best prices for you.",
    "taccau.cta.register": "Register to Sell",
    
    // Community Page
    "community.title": "Giving to Mekong Community",
    "community.subtitle": "Together building a sustainable agricultural community",
    "community.scholarship": "Scholarship",
    "community.scholarship.awarded": "Scholarships Awarded",
    "community.loan": "0% Interest Loan",
    "community.loan.disbursed": "Loans Disbursed",
    "community.ventures": "Investment Connection",
    "community.ventures.partners": "Partners Connected",
    "community.scholarship.title": "Scholarships for Farmers' Children",
    "community.scholarship.description": "Supporting tuition and living expenses for students from disadvantaged farming families in the Mekong Delta.",
    "community.loan.title": "0% Interest Loans",
    "community.loan.description": "Supporting farmers to resume production after damage from saline intrusion, natural disasters or farming model conversion.",
    "community.ventures.title": "Investment & Offtake Connection",
    "community.ventures.description": "Connecting farmers with businesses and investors for technology transfer, product offtake and agricultural value chain development.",
    "community.form.submit": "Submit Application",
    "community.form.register": "Submit Registration",
    "community.form.success": "Application submitted successfully!",
    "community.form.success.description": "We will review and contact you within 3-5 business days.",
    
    // Common
    "common.select": "Select",
    "common.enter": "Enter",
    "common.threshold": "threshold",
    
    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.signOut": "Sign Out",
    "auth.signInDescription": "Sign in to access all features",
    "auth.signUpDescription": "Create a new account to get started",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    
    // Profile
    "profile.details": "Profile Details",
    "profile.detailsDescription": "Manage your profile information",
    "profile.edit": "Edit",
    "profile.save": "Save",
    "profile.cancel": "Cancel",
    "profile.fullName": "Full Name",
    "profile.fullNamePlaceholder": "John Doe",
    "profile.phone": "Phone Number",
    "profile.province": "Province/City",
    "profile.district": "District",
    "profile.districtPlaceholder": "Enter district name",
    "profile.role.farmer": "Farmer",
    "profile.role.expert": "Expert",
    "profile.role.admin": "Admin",
    "profile.notSignedIn": "Please sign in to view profile",
    "profile.saveSuccess": "Saved successfully",
    "profile.saveSuccessDescription": "Your profile has been updated",
    "profile.saveError": "Save failed",
    "profile.saveErrorDescription": "Could not save profile. Please try again.",
    // Map
    "map.title": "Mekong Delta Salinity Map",
    "map.loading": "Loading map...",
    "map.unavailable": "Map temporarily unavailable",
    "map.realtime": "Real-time",
    "map.legend": "Salinity Legend",
    
    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.dashboardDescription": "Manage users and view system statistics",
    "admin.refresh": "Refresh",
    "admin.totalUsers": "Total Users",
    "admin.registeredUsers": "Registered",
    "admin.activeToday": "Active Today",
    "admin.last24Hours": "Last 24 hours",
    "admin.newThisWeek": "New This Week",
    "admin.newRegistrations": "New registrations",
    "admin.totalDiagnoses": "Total Diagnoses",
    "admin.aiDiagnoses": "AI Diagnoses",
    "admin.users": "Users",
    "admin.activity": "Activity",
    "admin.userManagement": "User Management",
    "admin.userManagementDescription": "View and manage user accounts",
    "admin.noUsers": "No users found",
    "admin.user": "User",
    "admin.email": "Email",
    "admin.province": "Province",
    "admin.joined": "Joined",
    "admin.status": "Status",
    "admin.active": "Active",
    "admin.recentActivity": "Recent Activity",
    "admin.recentActivityDescription": "View user activity on the system",
    "admin.activityComingSoon": "Feature coming soon",
    "admin.accessDenied": "Access Denied",
    "admin.accessDeniedDescription": "You do not have permission to access this page",
    
    // AI Response Language
    "ai.language": "English",
  },
  ko: {
    // Brand & Navigation
    "brand.name": "메콩 닥터",
    "nav.home": "홈",
    "nav.diagnosis": "AI 진단",
    "nav.taccau": "탁카우 파인애플",
    "nav.community": "커뮤니티",
    "nav.marketplace": "탁카우 장터",
    "nav.login": "로그인",
    
    // Hero Section
    "hero.badge": "🌾 스마트 농업 플랫폼",
    "hero.title": "메콩 닥터",
    "hero.subtitle": "삼각주 보호",
    "hero.description": "메콩 삼각주 농민들이 염분 침입에 대처하고, AI 전문가와 연결하며, 지원 정책에 접근하고 농산물을 상업화할 수 있도록 돕습니다.",
    "hero.cta.diagnosis": "AI 진단 받기",
    "hero.cta.taccau": "탁카우 파인애플",
    
    // Stats
    "stats.farmers": "활성 농민",
    "stats.diagnosis": "AI 진단 횟수",
    "stats.provinces": "서비스 지역",
    
    // Salinity Alerts
    "alerts.title": "염도 경고",
    "alerts.subtitle": "실시간 업데이트",
    "alerts.danger": "위험",
    "alerts.warning": "경고",
    "alerts.high": "높은 염도 경고!",
    
    // Features
    "features.title": "주요 기능",
    "features.description": "메콩 닥터는 메콩 삼각주 농민들이 기후 변화에 대처할 수 있도록 종합적인 솔루션을 제공합니다",
    "features.diagnosis.title": "AI 진단",
    "features.diagnosis.description": "염도 상태를 진단하고 즉각적인 해결책을 제공합니다",
    "features.taccau.title": "탁카우 파인애플",
    "features.taccau.description": "염분 땅의 황금 브랜드 - 직거래",
    "features.community.title": "커뮤니티 후원",
    "features.community.description": "장학금, 무이자 대출 및 투자 연결",
    "features.marketplace.title": "탁카우 장터",
    "features.marketplace.description": "물자 구매, 제품 판매, 공급망 연결",
    
    // CTA Section
    "cta.title": "지금 진단 시작하기",
    "cta.description": "위치와 염도 수치만 입력하면, AI 닥터가 작물 유형에 적합한 해결책을 분석하고 제공합니다.",
    "cta.button": "염도 측정하기",
    
    // Diagnosis Page
    "diagnosis.title": "메콩 AI 닥터",
    "diagnosis.subtitle": "염분 침입 상태를 진단하고 해결책을 제안합니다",
    "diagnosis.form.title": "진단 정보 입력",
    "diagnosis.form.description": "정확한 AI 분석을 위해 정보를 완전히 입력하세요",
    "diagnosis.form.province": "시/도",
    "diagnosis.form.district": "군/구",
    "diagnosis.form.cropType": "작물 유형",
    "diagnosis.form.salinity": "측정된 염도 (g/L 또는 ‰)",
    "diagnosis.form.symptoms": "관찰된 증상 (있는 경우)",
    "diagnosis.form.image": "이미지 (선택사항)",
    "diagnosis.form.submit": "진단 제출",
    "diagnosis.form.analyzing": "분석 중...",
    "diagnosis.result.title": "진단 결과",
    "diagnosis.result.safe": "안전",
    "diagnosis.result.warning": "경고",
    "diagnosis.result.danger": "위험",
    "diagnosis.result.solutions": "권장 해결책:",
    "diagnosis.result.policy": "💡 지원 정책:",
    "diagnosis.ready.title": "진단 준비 완료",
    "diagnosis.ready.description": "왼쪽에 정보를 입력하고 \"진단 제출\"을 클릭하여 AI 닥터의 분석 결과를 받으세요",
    "diagnosis.tips.title": "📚 염도 측정 팁",
    "diagnosis.tips.1": "• 정확한 결과를 위해 이른 아침이나 서늘한 오후에 측정하세요",
    "diagnosis.tips.2": "• 논/연못의 여러 지점에서 측정하고 평균을 내세요",
    "diagnosis.tips.3": "• 폭우 후나 배수 후에는 측정을 피하세요",
    "diagnosis.tips.4": "• 건기에는 주 2-3회 정기적으로 확인하세요",
    
    // Marketplace
    "marketplace.title": "메콩 농산물 시장",
    "marketplace.subtitle": "물자 구매 - 농산물 판매 - 공급망 연결",
    "marketplace.search": "제품, 물자 검색...",
    "marketplace.filter": "필터",
    "marketplace.supplies": "농업 물자",
    "marketplace.produce": "농산물",
    "marketplace.supplies.title": "농업 물자",
    "marketplace.supplies.description": "메콩 삼각주 조건에 적합한 장비, 비료, 품종",
    "marketplace.produce.title": "메콩 삼각주 농산물",
    "marketplace.produce.description": "농민에게서 직접 구매, 품질과 좋은 가격 보장",
    "marketplace.sold": "판매됨",
    "marketplace.buy": "바로 구매",
    "marketplace.order": "주문하기",
    "marketplace.seller.title": "농산물을 판매하시겠습니까?",
    "marketplace.seller.description": "판매자로 등록하여 전국의 수천 명의 고객에게 다가가세요",
    "marketplace.seller.register": "판매 등록",
    
    // TacCau Page
    "taccau.badge": "🍍 끼엔장 특산품",
    "taccau.title": "탁카우 파인애플",
    "taccau.subtitle": "염분 땅의 황금 - 독특한 달콤한 맛의 내염성 파인애플",
    "taccau.quality": "OCOP 품질",
    "taccau.quality.desc": "OCOP 4성 인증",
    "taccau.delivery": "전국 배송",
    "taccau.delivery.desc": "착불 배송, 수령 시 결제",
    "taccau.guarantee": "품질 보장",
    "taccau.guarantee.desc": "불만족 시 반품 가능",
    "taccau.story.title": "탁카우 파인애플 이야기",
    "taccau.story.p1": "탁카우는 끼엔장성 쩌우타인군의 해안 지역입니다. 이곳은 염분 침입의 심각한 영향을 받지만, 농민들은 도전을 기회로 바꾸었습니다.",
    "taccau.story.p2": "퀸 파인애플 품종은 여러 세대에 걸쳐 선별되고 재배되어 산성 및 염분 토양 조건에 완전히 적응했습니다. 토양의 염분이 독특한 풍미를 만들어냅니다: 부드러운 단맛, 적은 신맛, 진한 향기.",
    "taccau.stats.hectares": "재배 헥타르",
    "taccau.stats.farmers": "농가",
    "taccau.products.title": "탁카우 파인애플 제품",
    "taccau.products.subtitle": "과수원에서 직접 구매, 품질 보장",
    "taccau.addcart": "장바구니에 추가",
    "taccau.cta.title": "파인애플 농민이신가요?",
    "taccau.cta.description": "메콩 닥터의 파트너로 등록하여 전국의 고객에게 다가가세요. 배송, 마케팅을 지원하고 최고의 가격을 보장합니다.",
    "taccau.cta.register": "판매 등록",
    
    // Community Page
    "community.title": "메콩 커뮤니티 기부",
    "community.subtitle": "지속 가능한 농업 커뮤니티 구축에 함께합니다",
    "community.scholarship": "장학금",
    "community.scholarship.awarded": "수여된 장학금",
    "community.loan": "무이자 대출",
    "community.loan.disbursed": "지급된 대출금",
    "community.ventures": "투자 연결",
    "community.ventures.partners": "연결된 파트너",
    "community.scholarship.title": "농민 자녀를 위한 장학금",
    "community.scholarship.description": "메콩 삼각주의 어려운 농가 학생들을 위한 학비 및 생활비 지원.",
    "community.loan.title": "무이자 대출",
    "community.loan.description": "염분 침입, 자연재해 피해 후 또는 농업 모델 전환을 위한 농민 생산 재개 지원.",
    "community.ventures.title": "투자 및 오프테이크 연결",
    "community.ventures.description": "기술 이전, 제품 오프테이크 및 농업 가치 사슬 개발을 위해 농민을 기업 및 투자자와 연결.",
    "community.form.submit": "신청서 제출",
    "community.form.register": "등록 제출",
    "community.form.success": "신청서가 성공적으로 제출되었습니다!",
    "community.form.success.description": "3-5 영업일 내에 검토 후 연락드리겠습니다.",
    
    // Common
    "common.select": "선택",
    "common.enter": "입력",
    "common.threshold": "임계값",
    
    // Auth
    "auth.signIn": "로그인",
    "auth.signUp": "회원가입",
    "auth.signOut": "로그아웃",
    "auth.signInDescription": "모든 기능을 사용하려면 로그인하세요",
    "auth.signUpDescription": "새 계정을 만들어 시작하세요",
    "auth.noAccount": "계정이 없으신가요?",
    "auth.hasAccount": "이미 계정이 있으신가요?",
    "nav.profile": "프로필",
    "nav.settings": "설정",
    
    // Profile
    "profile.details": "프로필 정보",
    "profile.detailsDescription": "프로필 정보 관리",
    "profile.edit": "수정",
    "profile.save": "저장",
    "profile.cancel": "취소",
    "profile.fullName": "이름",
    "profile.fullNamePlaceholder": "홍길동",
    "profile.phone": "전화번호",
    "profile.province": "시/도",
    "profile.district": "구/군",
    "profile.districtPlaceholder": "구/군 이름 입력",
    "profile.role.farmer": "농부",
    "profile.role.expert": "전문가",
    "profile.role.admin": "관리자",
    "profile.notSignedIn": "프로필을 보려면 로그인하세요",
    "profile.saveSuccess": "저장 완료",
    "profile.saveSuccessDescription": "프로필이 업데이트되었습니다",
    "profile.saveError": "저장 실패",
    "profile.saveErrorDescription": "프로필을 저장할 수 없습니다. 다시 시도해주세요.",
    // Map
    "map.title": "메콩 삼각주 염도 지도",
    "map.loading": "지도 로딩 중...",
    "map.unavailable": "지도를 일시적으로 사용할 수 없습니다",
    "map.realtime": "실시간",
    "map.legend": "염도 범례",
    
    // Admin
    "admin.dashboard": "관리자 대시보드",
    "admin.dashboardDescription": "사용자 관리 및 시스템 통계 보기",
    "admin.refresh": "새로고침",
    "admin.totalUsers": "총 사용자",
    "admin.registeredUsers": "등록됨",
    "admin.activeToday": "오늘 활동",
    "admin.last24Hours": "지난 24시간",
    "admin.newThisWeek": "이번 주 신규",
    "admin.newRegistrations": "신규 등록",
    "admin.totalDiagnoses": "총 진단",
    "admin.aiDiagnoses": "AI 진단",
    "admin.users": "사용자",
    "admin.activity": "활동",
    "admin.userManagement": "사용자 관리",
    "admin.userManagementDescription": "사용자 계정 보기 및 관리",
    "admin.noUsers": "사용자가 없습니다",
    "admin.user": "사용자",
    "admin.email": "이메일",
    "admin.province": "시/도",
    "admin.joined": "가입일",
    "admin.status": "상태",
    "admin.active": "활성",
    "admin.recentActivity": "최근 활동",
    "admin.recentActivityDescription": "시스템의 사용자 활동 보기",
    "admin.activityComingSoon": "기능 개발 중",
    "admin.accessDenied": "접근 거부",
    "admin.accessDeniedDescription": "이 페이지에 접근할 권한이 없습니다",
    
    // AI Response Language
    "ai.language": "Korean",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "vi";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    // Try current language first
    if (translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to Vietnamese
    if (translations.vi[key]) {
      return translations.vi[key];
    }
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    // Return key if not found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const usePageTitle = () => {
    const location = useLocation();
    const { language } = useLanguage();

    useEffect(() => {
        const titles: Record<string, { vi: string; en: string; ko: string }> = {
            "/": {
                vi: "Mekong Doctor",
                en: "Mekong Doctor",
                ko: "Mekong Doctor"
            },
            "/diagnosis": {
                vi: "Bác sĩ AI - Mekong Doctor",
                en: "AI Diagnosis - Mekong Doctor",
                ko: "AI 진단 - Mekong Doctor"
            },
            "/taccau": {
                vi: "Khóm Tắc Cậu - Mekong Doctor",
                en: "Tac Cau Pineapple - Mekong Doctor",
                ko: "탁카우 파인애플 - Mekong Doctor"
            },
            "/sokfarm": {
                vi: "Sokfarm - Mekong Doctor",
                en: "Sokfarm - Mekong Doctor",
                ko: "Sokfarm - Mekong Doctor"
            },
            "/marketplace": {
                vi: "Chợ Nông sản - Mekong Doctor",
                en: "Marketplace - Mekong Doctor",
                ko: "농산물 시장 - Mekong Doctor"
            },
            "/community": {
                vi: "Cộng đồng - Mekong Doctor",
                en: "Community - Mekong Doctor",
                ko: "커뮤니티 - Mekong Doctor"
            },
            "/profile": {
                vi: "Hồ sơ - Mekong Doctor",
                en: "Profile - Mekong Doctor",
                ko: "프로필 - Mekong Doctor"
            }
        };

        const currentPath = location.pathname;
        const titleConfig = titles[currentPath] || titles["/"];
        const title = titleConfig[language] || titleConfig.vi;

        document.title = title;
    }, [location, language]);
};

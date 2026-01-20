import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "vi", label: "VN", flag: "🇻🇳" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "ko", label: "KR", flag: "🇰🇷" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className="w-[90px] border-2 h-9">
        <SelectValue>
          {languages.find(l => l.code === language)?.flag}{" "}
          {languages.find(l => l.code === language)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              {lang.flag} {lang.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLink } from "../NavLink";
import { LanguageSwitcher } from "../LanguageSwitcher";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Mekong Doctor" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary">Mekong Doctor</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/diagnosis">{t("nav.diagnosis")}</NavLink>
          <NavLink to="/taccau">Khóm Tắc Cậu</NavLink>
          <NavLink to="/sokfarm">Sokfarm</NavLink>
          <NavLink to="/marketplace">{t("nav.marketplace")}</NavLink>
          <NavLink to="/community">{t("nav.community")}</NavLink>
        </nav>

        {/* Actions Area */}
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMenu}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col space-y-4">
            <NavLink to="/diagnosis" onClick={() => setIsOpen(false)}>{t("nav.diagnosis")}</NavLink>
            <NavLink to="/taccau" onClick={() => setIsOpen(false)}>Khóm Tắc Cậu</NavLink>
            <NavLink to="/sokfarm" onClick={() => setIsOpen(false)}>Sokfarm</NavLink>
            <NavLink to="/marketplace" onClick={() => setIsOpen(false)}>{t("nav.marketplace")}</NavLink>
            <NavLink to="/community" onClick={() => setIsOpen(false)}>{t("nav.community")}</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

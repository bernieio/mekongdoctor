import { ReactNode } from "react";
import Header from "./Header";
import { Footer } from "./Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  usePageTitle(); // Update page title based on route and language

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

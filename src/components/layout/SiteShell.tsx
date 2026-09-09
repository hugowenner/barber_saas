import { Header } from "./Header";
import { Footer } from "./Footer";
import type { FooterShopData } from "@/types";

interface SiteShellProps {
  children: React.ReactNode;
  footerData?: FooterShopData;
}

/**
 * Site shell — sticky footer pattern.
 * `min-h-screen flex flex-col` ensures the footer sits at the bottom
 * even when content is short, and is pushed down naturally when long.
 */
export function SiteShell({ children, footerData }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer shopData={footerData} />
    </div>
  );
}

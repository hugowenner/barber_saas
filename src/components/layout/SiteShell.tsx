import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Site shell — sticky footer pattern.
 * `min-h-screen flex flex-col` ensures the footer sits at the bottom
 * even when content is short, and is pushed down naturally when long.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin · BARBER HOUSE",
    template: "%s · Admin",
  },
  description: "Painel administrativo da BARBER HOUSE.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

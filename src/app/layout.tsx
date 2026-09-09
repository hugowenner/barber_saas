import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const SAAS_DESCRIPTION =
  "Barber House é a plataforma de gestão para barbearias modernas. Agendamento online, painel administrativo, múltiplos barbeiros e muito mais.";

export const metadata: Metadata = {
  metadataBase: new URL("https://barberhouse.example.com"),
  title: {
    default: "Barber House — Gestão para barbearias",
    template: `%s · Barber House`,
  },
  description: SAAS_DESCRIPTION,
  keywords: [
    "gestão barbearia",
    "software barbearia",
    "agendamento online barbearia",
    "sistema para barbearia",
    "painel barbearia",
    "saas barbearia",
    "Barber House",
  ],
  authors: [{ name: "Barber House" }],
  creator: "Barber House",
  publisher: "Barber House",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Barber House",
    title: "Barber House — Gestão para barbearias",
    description: SAAS_DESCRIPTION,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Barber House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barber House — Gestão para barbearias",
    description: SAAS_DESCRIPTION,
    images: ["/og.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bebas.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

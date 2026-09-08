import type { Metadata } from "next";
import { SITE_CONFIG } from "@/data/business";

export const metadata: Metadata = {
  title: "Agendar horário",
  description: `Agende seu horário na ${SITE_CONFIG.name} em segundos. Escolha o serviço, o barbeiro, a data e o horário. Sem cadastro.`,
  alternates: { canonical: "/agendar" },
  openGraph: {
    title: `Agendar — ${SITE_CONFIG.name}`,
    description: `Agende seu horário na ${SITE_CONFIG.name} em segundos.`,
    url: "/agendar",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

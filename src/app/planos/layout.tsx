import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Escolha o plano ideal para sua barbearia. Agenda online, gestão de clientes e presença digital a partir do plano Básico.",
  alternates: { canonical: "/planos" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

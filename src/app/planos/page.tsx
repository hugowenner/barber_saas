import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/home/SectionHeading";

const PLANS = [
  {
    key: "BASIC",
    name: "Básico",
    highlight: false,
    features: [
      "Página pública da barbearia",
      "Agendamento online para clientes",
      "Catálogo de serviços com preços",
      "1 barbeiro",
      "Painel administrativo",
    ],
  },
  {
    key: "PRO",
    name: "Pro",
    highlight: true,
    features: [
      "Tudo do Básico",
      "Até 5 barbeiros",
      "Gestão de clientes",
      "Agenda avançada",
      "Histórico de agendamentos",
    ],
  },
  {
    key: "PREMIUM",
    name: "Premium",
    highlight: false,
    features: [
      "Tudo do Pro",
      "Barbeiros ilimitados",
      "Prioridade no suporte",
      "Recursos exclusivos",
      "Acesso antecipado a novidades",
    ],
  },
] as const;

export default function PlanosPage() {
  return (
    <SiteShell>
      <section
        className="border-b border-border py-20 sm:py-28"
        aria-labelledby="planos-heading"
      >
        <div className="container-section">
          <SectionHeading
            index="01"
            eyebrow="Planos"
            title="Escolha o plano ideal"
            description="Comece com o Básico e cresça no seu ritmo. Todos os planos incluem página pública, agendamento online e painel administrativo."
            align="center"
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`flex flex-col gap-6 rounded-lg border p-7 ${
                  plan.highlight
                    ? "border-primary bg-card ring-1 ring-primary/30"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlight && (
                  <span className="eyebrow text-primary">Recomendado</span>
                )}

                <div>
                  <h2 className="font-display text-3xl tracking-[0.06em] text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Consulte valores com nossa equipe
                  </p>
                </div>

                <ul className="flex flex-1 flex-col gap-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="default"
                  variant={plan.highlight ? "default" : "outline"}
                  className={
                    plan.highlight
                      ? undefined
                      : "border-border bg-transparent text-foreground hover:bg-secondary"
                  }
                >
                  <Link href="mailto:contato@barberhouse.com.br">
                    Falar com a equipe
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Dúvidas? Fale com a equipe e encontre o plano certo para sua
            operação.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}

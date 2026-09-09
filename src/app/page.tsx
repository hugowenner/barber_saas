import Link from "next/link";
import { ArrowRight, Calendar, Users, Scissors, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/layout/SiteShell";
import { SectionHeading } from "@/components/home/SectionHeading";

const FEATURES = [
  {
    Icon: Calendar,
    title: "Agenda online",
    description:
      "Seus clientes escolhem o serviço, o barbeiro, o dia e o horário pelo celular.",
  },
  {
    Icon: Users,
    title: "Seus clientes organizados",
    description:
      "Tenha os dados e o histórico dos seus clientes sempre à mão.",
  },
  {
    Icon: Scissors,
    title: "Barbeiros e serviços",
    description:
      "Cadastre seus barbeiros, serviços, preços e o tempo de cada atendimento.",
  },
  {
    Icon: Monitor,
    title: "Painel da barbearia",
    description:
      "Veja os agendamentos do dia e acompanhe sua agenda de um jeito simples.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Cadastre sua barbearia",
    desc: "Coloque o nome, endereço, telefone e horário de funcionamento.",
  },
  {
    n: "02",
    title: "Cadastre seus serviços e barbeiros",
    desc: "Adicione os serviços, preços, duração e os barbeiros que fazem cada atendimento.",
  },
  {
    n: "03",
    title: "Compartilhe seu link",
    desc: "Sua barbearia ganha uma página própria. É só mandar o link para seus clientes pelo WhatsApp, Instagram ou onde quiser.",
  },
  {
    n: "04",
    title: "Receba os agendamentos",
    desc: "O cliente escolhe o serviço, barbeiro, dia e horário. Sem precisar criar conta.",
  },
  {
    n: "05",
    title: "Cuide da sua agenda",
    desc: "Você acompanha tudo pelo painel da sua barbearia e sabe o que está marcado para o dia.",
  },
];

export default function HomePage() {
  return (
    <SiteShell>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden border-b border-border"
        aria-labelledby="saas-hero-heading"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-background/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <div className="container-section flex min-h-[88vh] flex-col justify-center py-20 sm:min-h-[80vh] sm:py-28">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="font-display text-sm uppercase tracking-[0.3em] text-primary">
                Plataforma SaaS
              </span>
            </div>

            <h1
              id="saas-hero-heading"
              className="font-display text-6xl leading-[0.95] tracking-[0.04em] text-foreground sm:text-7xl md:text-8xl"
            >
              BARBER HOUSE
            </h1>

            <p className="mt-6 font-serif text-2xl italic text-foreground/90 sm:text-3xl md:text-4xl">
              Sua barbearia organizada. Seus clientes marcando horário online.
            </p>

            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Tenha uma página para sua barbearia, agenda online, cadastro de
              clientes, barbeiros e serviços. Tudo simples e em um só lugar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link href="/planos">
                  Conhecer planos
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-border bg-transparent px-7 text-base text-foreground hover:bg-secondary"
              >
                <Link href="#como-funciona">
                  Ver como funciona
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recursos ── */}
      <section
        id="recursos"
        className="border-b border-border py-20 sm:py-28"
        aria-labelledby="features-heading"
      >
        <div className="container-section">
          <SectionHeading
            index="01"
            eyebrow="Recursos"
            title="Tudo para cuidar da sua barbearia"
            description="Organize sua agenda, facilite a vida dos seus clientes e tenha tudo o que precisa para cuidar do dia a dia da sua barbearia."
          />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <li
                key={f.title}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6"
              >
                <f.Icon className="size-6 text-primary" />
                <h3 className="font-display text-lg tracking-[0.04em] text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section
        id="como-funciona"
        className="border-b border-border py-20 sm:py-28"
        aria-labelledby="steps-heading"
      >
        <div className="container-section">
          <SectionHeading
            index="02"
            eyebrow="Como funciona"
            title="Comece de forma simples"
            description="Coloque sua barbearia no ar em poucos passos e deixe seus clientes marcarem horário online."
          />

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {STEPS.map((s) => (
              <li key={s.n} className="flex flex-col gap-2">
                <span className="font-display text-4xl text-primary">{s.n}</span>
                <h3 className="font-display text-base tracking-[0.04em] text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section
        className="relative overflow-hidden border-b border-border py-24 sm:py-32"
        aria-labelledby="saas-cta-heading"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-0 bg-secondary/40" />
          <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </div>

        <div className="container-section flex flex-col items-center text-center">
          <span className="eyebrow">Pronto?</span>
          <h2
            id="saas-cta-heading"
            className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] tracking-[0.04em] text-foreground sm:text-6xl md:text-7xl"
          >
            Quer facilitar sua rotina?
          </h2>
          <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            Tenha sua própria página e deixe seus clientes marcarem horário de
            forma simples.
          </p>
          <Button asChild size="lg" className="mt-9 h-12 px-8 text-base">
            <Link href="/planos">
              Conhecer planos
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

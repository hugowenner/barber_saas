import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden border-b border-border py-24 sm:py-32"
      aria-labelledby="final-cta-heading"
    >
      {/* Subtle background scrim */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      <div className="container-section flex flex-col items-center text-center">
        <span className="eyebrow">Pronto?</span>
        <h2
          id="final-cta-heading"
          className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] tracking-[0.04em] text-foreground sm:text-6xl md:text-7xl"
        >
          Pronto para o próximo corte?
        </h2>
        <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
          Em poucos toques seu horário está marcado. Sem cadastro, sem
          complicação.
        </p>
        <Button asChild size="lg" className="mt-9 h-12 px-8 text-base">
          <Link href="/agendar">
            <Calendar className="size-4" />
            Agendar horário
          </Link>
        </Button>
      </div>
    </section>
  );
}

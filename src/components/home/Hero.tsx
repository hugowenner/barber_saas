import Link from "next/link";
import { ArrowRight, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/data/business";

interface ShopOverride {
  name: string;
  city: string;
  tagline?: string | null;
}

interface HeroProps {
  shop?: ShopOverride;
  bookingHref?: string;
}

export function Hero({ shop, bookingHref = "/agendar" }: HeroProps = {}) {
  const name = shop?.name ?? SITE_CONFIG.name;
  const city = shop?.city ?? SITE_CONFIG.address.city;
  const tagline = shop?.tagline ?? SITE_CONFIG.tagline;

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      aria-labelledby="hero-heading"
    >
      {/* Background image + scrim */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      <div className="container-section flex min-h-[88vh] flex-col justify-center py-20 sm:min-h-[80vh] sm:py-28">
        <div className="max-w-2xl animate-fade-in-up">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="font-display text-sm uppercase tracking-[0.3em] text-primary">
              Barbearia · {city}
            </span>
          </div>

          {/* Brand */}
          <h1
            id="hero-heading"
            className="font-display text-6xl leading-[0.95] tracking-[0.04em] text-foreground sm:text-7xl md:text-8xl"
          >
            {name}
          </h1>

          {/* Headline */}
          <p className="mt-6 font-serif text-2xl italic text-foreground/90 sm:text-3xl md:text-4xl">
            {tagline}
          </p>

          {/* Subtext */}
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            Cortes masculinos, barba e cuidado artesanal feitos por mestres
            barbeiros. Experiência premium, do começo ao fim.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link href={bookingHref}>
                <Calendar className="size-4" />
                Agendar horário
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-border bg-transparent px-7 text-base text-foreground hover:bg-secondary"
            >
              <Link href="#ambiente">
                Conheça a barbearia
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="flex" aria-label="Avaliação 5 de 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary text-primary"
                    aria-hidden
                  />
                ))}
              </div>
              <span className="ml-1">5.0 · 200+ avaliações</span>
            </div>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="hidden sm:inline">10 anos de ofício</span>
          </div>
        </div>
      </div>
    </section>
  );
}

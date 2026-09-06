import Link from "next/link";
import { Instagram, MapPin, Phone, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/data/business";
import { buildMapsLink, buildWhatsAppLink } from "@/lib/format";

export function Footer() {
  const whatsappLink = buildWhatsAppLink(
    SITE_CONFIG.whatsapp,
    `Olá! Gostaria de falar com a ${SITE_CONFIG.name}.`,
  );

  return (
    <footer
      id="contato"
      className="mt-auto border-t border-border bg-background"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Rodapé
      </h2>
      <div className="container-section py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="font-display text-2xl tracking-[0.18em] text-foreground">
              {SITE_CONFIG.name}
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              {SITE_CONFIG.tagline} Barbearia premium em {SITE_CONFIG.address.city}.
            </p>
            <a
              href={`https://instagram.com/${SITE_CONFIG.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary focus-ring rounded-sm"
            >
              <Instagram className="size-4" />
              @{SITE_CONFIG.instagram}
            </a>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="eyebrow">Contato</h3>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\D/g, "")}`}
              className="flex items-start gap-2 text-sm text-foreground/90 transition-colors hover:text-primary focus-ring rounded-sm"
            >
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{SITE_CONFIG.phone}</span>
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-foreground/90 transition-colors hover:text-primary focus-ring rounded-sm"
            >
              <span className="mt-0.5 text-primary" aria-hidden>
                @
              </span>
              <span>WhatsApp</span>
            </a>
            <a
              href={buildMapsLink(SITE_CONFIG.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-foreground/90 transition-colors hover:text-primary focus-ring rounded-sm"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                {SITE_CONFIG.address.street}, {SITE_CONFIG.address.number}
                <br />
                {SITE_CONFIG.address.district} — {SITE_CONFIG.address.city}/
                {SITE_CONFIG.address.state}
              </span>
            </a>
          </div>

          {/* Hours */}
          <div className="space-y-3">
            <h3 className="eyebrow">Horários</h3>
            <ul className="space-y-1.5 text-sm">
              {SITE_CONFIG.hours.map((h) => (
                <li
                  key={h.weekday}
                  className="flex items-center justify-between gap-4 text-foreground/90"
                >
                  <span className="text-muted-foreground">{h.label}</span>
                  <span className="tabular-nums">
                    {h.open} — {h.close}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 text-muted-foreground/70">
                <span>Domingo</span>
                <span>Fechado</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              <span>Último agendamento 30 min antes do fechamento</span>
            </div>
          </div>
        </div>

        <div className="hairline-gold my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos
            reservados.
          </p>
          <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Início
            </Link>
            <Link href="/agendar" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Agendar
            </Link>
            <Link href="/#servicos" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Serviços
            </Link>
            <Link href="/#contato" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

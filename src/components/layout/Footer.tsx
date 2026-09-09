import { Instagram, MapPin, Phone, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/data/business";
import { buildMapsLink, buildWhatsAppLink } from "@/lib/format";
import { BookingLink } from "./BookingLink";
import { TenantLink } from "./TenantLink";
import type { FooterShopData } from "@/types";

interface FooterProps {
  shopData?: FooterShopData;
}

export function Footer({ shopData }: FooterProps) {
  const isSaas = !shopData;

  const d = shopData ?? {
    name: SITE_CONFIG.name,
    tagline: null,
    phone: null,
    whatsapp: null,
    instagram: null,
    street: null,
    number: null,
    district: null,
    city: null,
    state: null,
    mapsQuery: null,
    hours: [] as FooterShopData["hours"],
  };

  const whatsappLink =
    !isSaas && d.whatsapp
      ? buildWhatsAppLink(d.whatsapp, `Olá! Gostaria de falar com a ${d.name}.`)
      : null;

  const mapsLink = !isSaas && d.mapsQuery ? buildMapsLink(d.mapsQuery) : null;

  const hasContact = !isSaas && !!(d.phone || whatsappLink || (mapsLink && d.street));
  const hasHours = !isSaas && d.hours.length > 0;

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
              {d.name}
            </div>
            {!isSaas && d.tagline && (
              <p className="max-w-xs text-sm text-muted-foreground">
                {d.tagline} Barbearia premium em {d.city}.
              </p>
            )}
            {isSaas && (
              <p className="max-w-xs text-sm text-muted-foreground">
                Gestão inteligente para barbearias modernas.
              </p>
            )}
            {!isSaas && d.instagram && (
              <a
                href={`https://instagram.com/${d.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary focus-ring rounded-sm"
              >
                <Instagram className="size-4" />
                @{d.instagram}
              </a>
            )}
          </div>

          {/* Contact — only when tenant data exists */}
          {hasContact && (
            <div className="space-y-3">
              <h3 className="eyebrow">Contato</h3>
              {d.phone && (
                <a
                  href={`tel:${d.phone.replace(/\D/g, "")}`}
                  className="flex items-start gap-2 text-sm text-foreground/90 transition-colors hover:text-primary focus-ring rounded-sm"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{d.phone}</span>
                </a>
              )}
              {whatsappLink && (
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
              )}
              {mapsLink && d.street && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-foreground/90 transition-colors hover:text-primary focus-ring rounded-sm"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    {d.street}, {d.number}
                    <br />
                    {d.district} — {d.city}/{d.state}
                  </span>
                </a>
              )}
            </div>
          )}

          {/* Hours — only when tenant data exists */}
          {hasHours && (
            <div className="space-y-3">
              <h3 className="eyebrow">Horários</h3>
              <ul className="space-y-1.5 text-sm">
                {d.hours.map((h) => (
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
          )}
        </div>

        <div className="hairline-gold my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {d.name}. Todos os direitos
            reservados.
          </p>
          <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            <TenantLink className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Início
            </TenantLink>
            <BookingLink className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Agendar
            </BookingLink>
            <TenantLink anchor="#servicos" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Serviços
            </TenantLink>
            <TenantLink anchor="#contato" className="hover:text-foreground transition-colors focus-ring rounded-sm">
              Contato
            </TenantLink>
          </nav>
        </div>

        {/* Developer credit — only on SaaS pages */}
        {isSaas && (
          <p className="mt-6 text-xs text-muted-foreground/40">
            Desenvolvido por Hugo Wenner
          </p>
        )}
      </div>
    </footer>
  );
}

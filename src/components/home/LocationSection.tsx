import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/data/business";
import {
  buildMapsLink,
  buildWhatsAppLink,
} from "@/lib/format";

export function LocationSection() {
  const { address, hours, phone, whatsapp } = SITE_CONFIG;
  const mapsLink = buildMapsLink(SITE_CONFIG.mapsQuery);
  const whatsappLink = buildWhatsAppLink(
    whatsapp,
    `Olá! Gostaria de agendar um horário na ${SITE_CONFIG.name}.`,
  );

  return (
    <section
      id="localizacao"
      className="border-b border-border py-20 sm:py-28"
      aria-labelledby="location-heading"
    >
      <div className="container-section">
        <SectionHeading
          index="05"
          eyebrow="Localização"
          title="Onde estamos"
          description="Perto de você, no coração da cidade."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Map */}
          <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-border bg-secondary lg:min-h-[440px]">
            <iframe
              title={`Mapa — ${SITE_CONFIG.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                SITE_CONFIG.mapsQuery,
              )}&output=embed`}
              className="absolute inset-0 h-full w-full"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: "invert(0.92) hue-rotate(180deg) contrast(0.95)" }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Address */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-display text-lg tracking-[0.04em] text-foreground">
                    Endereço
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {address.street}, {address.number}
                    <br />
                    {address.district} — {address.city}/{address.state}
                    <br />
                    CEP {address.zip}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-4 border-border bg-transparent text-foreground hover:bg-secondary"
                  >
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="size-4" />
                      Abrir no mapa
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <h3 className="font-display text-lg tracking-[0.04em] text-foreground">
                    Horários
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {hours.map((h) => (
                      <li
                        key={h.weekday}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-muted-foreground">{h.label}</span>
                        <span className="tabular-nums text-foreground/90">
                          {h.open} — {h.close}
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between gap-4 text-muted-foreground/70">
                      <span>Domingo</span>
                      <span>Fechado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-display text-lg tracking-[0.04em] text-foreground">
                    Contato
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {phone}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-4 border-border bg-transparent text-foreground hover:bg-secondary"
                  >
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar no WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { ServiceCard } from "./ServiceCard";
import type { Service } from "@/types";

interface Props {
  services: Service[];
  bookingHref?: string;
}

export function ServicesSection({ services, bookingHref = "/agendar" }: Props) {
  return (
    <section
      id="servicos"
      className="border-b border-border py-20 sm:py-28"
      aria-labelledby="services-heading"
    >
      <div className="container-section">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            index="01"
            eyebrow="Serviços"
            title="O que fazemos"
            description="Cada serviço é uma experiência. Do corte clássico ao acabamento de barba, tudo feito com técnica e cuidado."
          />
          <Link
            href={bookingHref}
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-foreground focus-ring rounded-sm"
          >
            Agendar agora
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul
          id="services-heading"
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

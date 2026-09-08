"use client";

import { ServiceCard } from "@/components/home/ServiceCard";
import { SERVICES } from "@/data/services";
import type { Service } from "@/types";

interface ServiceSelectorProps {
  value: Service | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelector({ value, onSelect }: ServiceSelectorProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground sm:text-4xl">
          Escolha o serviço
        </h2>
        <p className="text-sm text-muted-foreground">
          O que vamos fazer hoje?
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <li key={service.id}>
            <ServiceCard
              service={service}
              onSelect={onSelect}
              selected={value?.id === service.id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

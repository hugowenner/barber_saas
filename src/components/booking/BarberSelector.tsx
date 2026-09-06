"use client";

import { BarberCard } from "@/components/home/BarberCard";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { BARBERS } from "@/data/barbers";
import type { Barber } from "@/types";

interface BarberSelectorProps {
  barber: Barber | null;
  anyBarber: boolean;
  onSelectBarber: (barber: Barber) => void;
  onSelectAny: () => void;
}

export function BarberSelector({
  barber,
  anyBarber,
  onSelectBarber,
  onSelectAny,
}: BarberSelectorProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground sm:text-4xl">
          Escolha seu barbeiro
        </h2>
        <p className="text-sm text-muted-foreground">
          Cada um tem seu estilo. Ou deixe com a gente.
        </p>
      </header>

      {/* "Any barber" option */}
      <button
        type="button"
        onClick={onSelectAny}
        aria-pressed={anyBarber}
        className={cn(
          "flex w-full items-center gap-4 rounded-lg border bg-card p-4 text-left transition-all focus-ring",
          anyBarber
            ? "border-primary ring-1 ring-primary"
            : "border-border hover:border-primary/60",
        )}
      >
        <span
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-md border",
            anyBarber
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary text-muted-foreground",
          )}
        >
          <Users className="size-6" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-xl tracking-[0.04em] text-foreground">
            Qualquer barbeiro
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            Mais flexibilidade de horário. Atribuímos o barbeiro disponível.
          </span>
        </span>
      </button>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BARBERS.map((b) => (
          <li key={b.id}>
            <BarberCard
              barber={b}
              onSelect={onSelectBarber}
              selected={!anyBarber && barber?.id === b.id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

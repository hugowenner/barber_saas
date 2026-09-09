"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Barber, TimeSlot } from "@/types";

interface TimeSelectorProps {
  slots: TimeSlot[];
  value: string | null;
  onSelect: (time: string) => void;
  barber: Barber | null;
  anyBarber: boolean;
  isLoading?: boolean;
}

export function TimeSelector({
  slots,
  value,
  onSelect,
  barber,
  anyBarber,
  isLoading = false,
}: TimeSelectorProps) {
  const availableCount = slots.filter((s) => s.available).length;
  const barberLabel = anyBarber ? "qualquer barbeiro" : barber?.name ?? "—";

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground sm:text-4xl">
          Escolha o horário
        </h2>
        <p className="text-sm text-muted-foreground">
          Disponível para {barberLabel}.{" "}
          {availableCount > 0
            ? `${availableCount} horários livres.`
            : "Nenhum horário livre — escolha outra data."}
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
          <Clock className="mr-2 size-4 animate-spin" aria-hidden />
          Verificando disponibilidade…
        </div>
      ) : availableCount === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card/50 py-12 text-center">
          <Clock className="size-6 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">
            Sem horários disponíveis para esta data.
            <br />
            Tente outro dia ou outro barbeiro.
          </p>
        </div>
      ) : (
        <ul
          className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5"
          role="radiogroup"
          aria-label="Horários disponíveis"
        >
          {slots.map((slot) => {
            const selected = value === slot.time;
            return (
              <li key={slot.time}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!slot.available}
                  onClick={() => onSelect(slot.time)}
                  className={cn(
                    "flex h-12 w-full items-center justify-center rounded-md border text-sm tabular-nums transition-all focus-ring",
                    selected && "border-primary bg-primary text-primary-foreground",
                    !selected && slot.available && "border-border bg-card text-foreground hover:border-primary/60",
                    !slot.available && "cursor-not-allowed border-border/50 bg-muted text-muted-foreground/40 line-through",
                  )}
                >
                  {slot.time}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

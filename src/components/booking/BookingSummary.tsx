"use client";

import { Check, Calendar, User, Scissors, Clock, Phone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatBRL,
  formatDuration,
  formatLongDate,
} from "@/lib/format";
import type { BookingState } from "@/types";

interface BookingSummaryProps {
  booking: BookingState;
  onConfirm: () => void;
}

export function BookingSummary({ booking, onConfirm }: BookingSummaryProps) {
  const { service, barber, anyBarber, date, time, customerName, customerPhone } =
    booking;

  if (!service || !date || !time) return null;

  const barberLabel = anyBarber ? "Qualquer barbeiro" : barber?.name ?? "—";

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    {
      icon: <Scissors className="size-4" />,
      label: "Serviço",
      value: service.name,
    },
    {
      icon: <User className="size-4" />,
      label: "Barbeiro",
      value: barberLabel,
    },
    {
      icon: <Calendar className="size-4" />,
      label: "Data",
      value: formatLongDate(date),
    },
    {
      icon: <Clock className="size-4" />,
      label: "Horário",
      value: time,
    },
    {
      icon: <User className="size-4" />,
      label: "Cliente",
      value: customerName,
    },
    {
      icon: <Phone className="size-4" />,
      label: "WhatsApp",
      value: customerPhone,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground sm:text-4xl">
          Confirme seu agendamento
        </h2>
        <p className="text-sm text-muted-foreground">
          Revise os detalhes antes de confirmar.
        </p>
      </header>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <dl className="divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-4 px-5 py-4"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"
                aria-hidden
              >
                {row.icon}
              </span>
              <dt className="w-24 shrink-0 text-xs uppercase tracking-wider text-muted-foreground sm:w-28">
                {row.label}
              </dt>
              <dd className="flex-1 text-sm text-foreground sm:text-base">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-5 py-4">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="size-4" />
            Total
          </span>
          <span className="font-display text-2xl tracking-[0.04em] text-primary">
            {formatBRL(service.priceBRL)}
          </span>
        </div>
        <div className="px-5 py-3 text-xs text-muted-foreground">
          {formatDuration(service.durationMin)} de duração
        </div>
      </div>

      <Button
        type="button"
        onClick={onConfirm}
        className="h-12 w-full text-base sm:w-auto sm:px-8"
      >
        <Check className="size-4" />
        Confirmar agendamento
      </Button>
    </div>
  );
}

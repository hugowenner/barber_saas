"use client";

import Link from "next/link";
import { CheckCircle2, CalendarPlus, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/data/business";
import {
  buildGoogleCalendarLink,
  buildWhatsAppLink,
  formatLongDate,
} from "@/lib/format";
import type { BookingState } from "@/types";

interface BookingConfirmationProps {
  booking: BookingState;
  onNewBooking: () => void;
}

export function BookingConfirmation({
  booking,
  onNewBooking,
}: BookingConfirmationProps) {
  const { service, barber, anyBarber, date, time, customerName, customerPhone } =
    booking;

  if (!service || !date || !time) return null;

  // Build calendar event
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + service.durationMin * 60_000);
  const calendarLink = buildGoogleCalendarLink({
    title: `${SITE_CONFIG.name} — ${service.name}`,
    details: `Agendamento para ${customerName}. Serviço: ${service.name}. Barbeiro: ${
      anyBarber ? "Qualquer barbeiro" : barber?.name ?? "—"
    }.`,
    location: `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.number} — ${SITE_CONFIG.address.city}/${SITE_CONFIG.address.state}`,
    start,
    end,
  });

  // Build WhatsApp message to the customer (sent to barbershop, with their number)
  // The barbershop's WhatsApp — message is pre-filled with booking confirmation.
  const message = [
    `Olá, ${customerName}! Confirmando seu agendamento na ${SITE_CONFIG.name}.`,
    "",
    `Serviço: ${service.name}`,
    `Barbeiro: ${anyBarber ? "Qualquer barbeiro" : barber?.name ?? "—"}`,
    `Data: ${formatLongDate(date)}`,
    `Horário: ${time}`,
    `Valor: ${service.priceBRL.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`,
    "",
    "Te esperamos!",
  ].join("\n");

  const whatsappLink = buildWhatsAppLink(SITE_CONFIG.whatsapp, message);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-8 text-center step-enter">
      {/* Success mark */}
      <div className="relative">
        <div
          className="flex size-20 items-center justify-center rounded-full border border-primary/40 bg-primary/10"
          aria-hidden
        >
          <CheckCircle2 className="size-10 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <span className="mt-6 eyebrow">Agendamento confirmado</span>
      <h2 className="mt-3 font-display text-4xl tracking-[0.04em] text-foreground sm:text-5xl">
        Tá marcado
      </h2>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        {customerName}, seu horário está garantido. Enviamos a confirmação
        para {customerPhone}.
      </p>

      {/* Mini summary */}
      <dl className="mt-8 w-full max-w-md rounded-lg border border-border bg-card p-5 text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Serviço
          </span>
          <span className="text-sm text-foreground">{service.name}</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Quando
          </span>
          <span className="text-sm text-foreground">
            {formatLongDate(date)} · {time}
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Barbeiro
          </span>
          <span className="text-sm text-foreground">
            {anyBarber ? "Qualquer barbeiro" : barber?.name}
          </span>
        </div>
      </dl>

      {/* Actions */}
      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 border-border bg-transparent text-foreground hover:bg-secondary"
        >
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CalendarPlus className="size-4" />
            Adicionar ao calendário
          </a>
        </Button>
        <Button asChild size="lg" className="h-12">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            Enviar confirmação pelo WhatsApp
          </a>
        </Button>
      </div>

      {/* Secondary */}
      <div className="mt-6 flex items-center gap-4 text-sm">
        <button
          type="button"
          onClick={onNewBooking}
          className="font-medium text-primary transition-colors hover:text-foreground focus-ring rounded-sm"
        >
          Novo agendamento
        </button>
        <span className="h-4 w-px bg-border" aria-hidden />
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <Home className="size-4" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  );
}

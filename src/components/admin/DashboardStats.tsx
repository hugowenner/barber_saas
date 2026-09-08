"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import type { Appointment } from "@/types/admin";

interface DashboardStatsProps {
  stats: {
    todayTotal: number;
    todayConfirmed: number;
    todayPending: number;
    todayRevenueBRL: number;
  };
}

/** Top-row KPI cards on the dashboard. */
export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      label: "Agendamentos",
      value: String(stats.todayTotal),
      sub: "hoje",
    },
    {
      label: "Confirmados",
      value: String(stats.todayConfirmed),
      sub: "hoje",
    },
    {
      label: "Aguardando",
      value: String(stats.todayPending),
      sub: "confirmação",
    },
    {
      label: "Faturamento",
      value: formatBRL(stats.todayRevenueBRL),
      sub: "estimado hoje",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-border bg-card p-4 sm:p-5"
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {c.label}
          </div>
          <div className="mt-2 font-display text-3xl tracking-[0.04em] text-foreground sm:text-4xl">
            {c.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

/** Compact list of today's upcoming appointments. */
export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/50 px-5 py-8 text-center text-sm text-muted-foreground">
        Nenhum agendamento próximo para hoje.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {appointments.map((a) => (
        <li
          key={a.id}
          className="flex items-center gap-4 px-4 py-3 sm:px-5"
        >
          <div className="w-12 shrink-0 text-center">
            <div className="font-display text-lg tracking-wide text-primary">
              {formatTimeShort(a.startAt)}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">
              {a.clientName}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {a.serviceName} · {a.barberName ?? "Qualquer barbeiro"}
            </div>
          </div>
          <StatusBadge status={a.status} className="hidden sm:inline-flex" />
        </li>
      ))}
    </ul>
  );
}

interface BarberSummaryProps {
  summary: { barberId: string; barberName: string; count: number }[];
}

/** Horizontal bar list showing today's appointment count per barber. */
export function BarberSummary({ summary }: BarberSummaryProps) {
  const max = Math.max(1, ...summary.map((s) => s.count));

  return (
    <ul className="space-y-3">
      {summary.map((s) => (
        <li key={s.barberId} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <Link
              href="/admin/barbers"
              className="font-medium text-foreground transition-colors hover:text-primary focus-ring rounded-sm"
            >
              {s.barberName}
            </Link>
            <span className="tabular-nums text-muted-foreground">
              {s.count} {s.count === 1 ? "atendimento" : "atendimentos"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(s.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatTimeShort(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

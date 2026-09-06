"use client";

import { useMemo, useState } from "react";
import { Calendar, Filter, Inbox } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, STATUS_OPTIONS } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatBRL } from "@/lib/format";
import { MOCK_APPOINTMENTS } from "@/data/admin/appointments";
import { BARBERS } from "@/data/barbers";
import type { Appointment, AppointmentStatus } from "@/types/admin";

export default function AppointmentsPage() {
  const [date, setDate] = useState<string>(todayISO());
  const [barberFilter, setBarberFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return MOCK_APPOINTMENTS.filter((a) => {
      // Date filter: match the yyyy-mm-dd of startAt
      const aDate = a.startAt.slice(0, 10);
      if (date && aDate !== date) return false;
      if (barberFilter !== "all" && a.barberId !== barberFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [date, barberFilter, statusFilter]);

  const hasFilters = barberFilter !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agendamentos"
        description="Gerencie e acompanhe todos os agendamentos."
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground sm:mb-1">
          <Filter className="size-4" />
          <span className="eyebrow">Filtros</span>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label
              htmlFor="filter-date"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Data
            </label>
            <Input
              id="filter-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Barbeiro
            </label>
            <Select value={barberFilter} onValueChange={setBarberFilter}>
              <SelectTrigger className="h-10 bg-background">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {BARBERS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 bg-background">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length}{" "}
          {filtered.length === 1 ? "agendamento" : "agendamentos"}
          {date && (
            <>
              {" "}
              em <span className="text-foreground">{formatDateLabel(date)}</span>
            </>
          )}
        </p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="Nenhum agendamento encontrado"
          description={
            hasFilters
              ? "Tente ajustar os filtros para ver mais resultados."
              : "Não há agendamentos para esta data."
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border border-border md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Horário
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Serviço
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Barbeiro
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-display text-base tracking-wide text-foreground">
                        {formatTime(a.startAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{a.clientName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.serviceName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.barberName ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {formatBRL(a.priceBRL)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {filtered.map((a) => (
              <li key={a.id}>
                <AppointmentCard appointment={a} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function AppointmentCard({ appointment: a }: { appointment: Appointment }) {
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="font-display text-xl tracking-wide text-primary">
            {formatTime(a.startAt)}
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              {a.clientName}
            </div>
            <div className="text-xs text-muted-foreground">
              {a.serviceName} · {a.barberName ?? "Qualquer"}
            </div>
          </div>
        </div>
        <StatusBadge status={a.status} />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="text-muted-foreground">{a.barberName ?? "—"}</span>
        <span className="tabular-nums text-foreground">
          {formatBRL(a.priceBRL)}
        </span>
      </div>
    </article>
  );
}

/* ---------- helpers ---------- */

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

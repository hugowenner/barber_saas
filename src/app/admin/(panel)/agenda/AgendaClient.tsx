"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  Filter,
  Phone,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, STATUS_OPTIONS } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAppointmentStatus, assignAppointmentBarber } from "@/lib/actions/appointments";
import { formatBRL, formatLongDate } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/types/admin";
import type { Barber } from "@/types";

interface BusinessHourSlim {
  weekday: number;
  openMin: number;
  closeMin: number;
}

interface AgendaClientProps {
  date: string;
  appointments: Appointment[];
  barbers: (Barber & { isActive: boolean })[];
  businessHours: BusinessHourSlim[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shiftDate(iso: string, days: number): string {
  // Use T12:00:00 to avoid DST edge cases when shifting by day
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function minToLabel(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function appointmentStartMin(a: Appointment): number {
  const d = new Date(a.startAt);
  return d.getHours() * 60 + d.getMinutes();
}

function appointmentEndMin(a: Appointment): number {
  const d = new Date(a.endAt);
  return d.getHours() * 60 + d.getMinutes();
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// ── component ─────────────────────────────────────────────────────────────────

export function AgendaClient({
  date,
  appointments,
  barbers,
  businessHours,
}: AgendaClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [barberFilter, setBarberFilter] = useState<string>("all");

  // Weekday of the selected date (0 = Sunday … 6 = Saturday)
  const weekday = useMemo(
    () => new Date(`${date}T12:00:00`).getDay(),
    [date],
  );

  const todayStr = todayISO();
  const isToday = date === todayStr;

  const goTo = (d: string) => {
    router.push(`/admin/agenda?date=${d}`);
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    startTransition(async () => {
      await updateAppointmentStatus(id, status);
      router.refresh();
    });
  };

  const handleAssignBarber = (id: string, barberId: string) => {
    startTransition(async () => {
      await assignAppointmentBarber(id, barberId);
      router.refresh();
    });
  };

  // Only active barbers for assignment
  const activeBarbers = barbers.filter((b) => b.isActive);

  // Business hours for this weekday
  const dayHours = businessHours.find((h) => h.weekday === weekday) ?? null;

  // Appointments filtered by barber (client-side — no refetch)
  const filtered = useMemo(() => {
    if (barberFilter === "all") return appointments;
    // For "any barber" appointments, show them regardless when all is selected
    return appointments.filter(
      (a) => a.barberId === barberFilter || (a.anyBarber && barberFilter === "all"),
    );
  }, [appointments, barberFilter]);

  // Timeline slots: 30-min intervals from openMin to closeMin
  const slots = useMemo<number[]>(() => {
    if (!dayHours) return [];
    const result: number[] = [];
    for (let m = dayHours.openMin; m < dayHours.closeMin; m += 30) {
      result.push(m);
    }
    return result;
  }, [dayHours]);

  // For each slot, find appointments that start within it (start >= slot && start < slot+30)
  const appointmentsBySlot = useMemo(() => {
    const map = new Map<number, Appointment[]>();
    for (const slot of slots) {
      map.set(slot, []);
    }
    for (const a of filtered) {
      const startMin = appointmentStartMin(a);
      const slotKey = slots.find(
        (s) => startMin >= s && startMin < s + 30,
      );
      if (slotKey !== undefined) {
        map.get(slotKey)!.push(a);
      }
    }
    return map;
  }, [slots, filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Visão diária dos agendamentos da barbearia."
      />

      {/* ── Day navigator ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
        <button
          onClick={() => goTo(shiftDate(date, -1))}
          className="flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-ring"
          aria-label="Dia anterior"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex flex-1 flex-col items-center gap-0.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <CalendarDays className="size-3.5 text-primary" />
            {formatLongDate(date)}
          </span>
          {!isToday && (
            <button
              onClick={() => goTo(todayStr)}
              className="text-xs text-primary hover:underline focus-ring rounded-sm"
            >
              Voltar para hoje
            </button>
          )}
          {isToday && (
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Hoje
            </span>
          )}
        </div>

        <button
          onClick={() => goTo(shiftDate(date, 1))}
          className="flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-ring"
          aria-label="Próximo dia"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Barber filter ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground sm:mb-1">
          <Filter className="size-4" />
          <span className="eyebrow">Filtros</span>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Barbeiro
          </label>
          <Select value={barberFilter} onValueChange={setBarberFilter}>
            <SelectTrigger className="h-10 w-52 bg-background">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {barbers.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground sm:mb-2">
          {filtered.length}{" "}
          {filtered.length === 1 ? "agendamento" : "agendamentos"}
        </p>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      {!dayHours ? (
        <ClosedDay />
      ) : barberFilter === "all" ? (
        <AllBarbersView
          appointments={filtered}
          activeBarbers={activeBarbers}
          onStatusChange={handleStatusChange}
          onAssignBarber={handleAssignBarber}
          isPending={isPending}
        />
      ) : (
        <TimelineView
          slots={slots}
          appointmentsBySlot={appointmentsBySlot}
          dayHours={dayHours}
          activeBarbers={activeBarbers}
          onStatusChange={handleStatusChange}
          onAssignBarber={handleAssignBarber}
          isPending={isPending}
        />
      )}
    </div>
  );
}

// ── Sub-views ─────────────────────────────────────────────────────────────────

function ClosedDay() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
      <CalendarDays className="size-8 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">Fechado neste dia</p>
      <p className="text-xs text-muted-foreground">
        A barbearia não tem horários configurados para este dia da semana.
      </p>
    </div>
  );
}

type ActiveBarber = { id: string; name: string };

function AllBarbersView({
  appointments,
  activeBarbers,
  onStatusChange,
  onAssignBarber,
  isPending,
}: {
  appointments: Appointment[];
  activeBarbers: ActiveBarber[];
  onStatusChange: (id: string, s: AppointmentStatus) => void;
  onAssignBarber: (id: string, barberId: string) => void;
  isPending: boolean;
}) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card py-16 text-center">
        <Clock className="size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">
          Nenhum agendamento para este dia.
        </p>
        <p className="text-xs text-muted-foreground">
          Os agendamentos feitos em /agendar aparecerão aqui.
        </p>
      </div>
    );
  }

  const sorted = [...appointments].sort((a, b) =>
    a.startAt.localeCompare(b.startAt),
  );

  return (
    <div className="space-y-2">
      {sorted.map((a) => (
        <AppointmentRow
          key={a.id}
          appointment={a}
          activeBarbers={activeBarbers}
          onStatusChange={onStatusChange}
          onAssignBarber={onAssignBarber}
          isPending={isPending}
        />
      ))}
    </div>
  );
}

function TimelineView({
  slots,
  appointmentsBySlot,
  dayHours,
  activeBarbers,
  onStatusChange,
  onAssignBarber,
  isPending,
}: {
  slots: number[];
  appointmentsBySlot: Map<number, Appointment[]>;
  dayHours: { openMin: number; closeMin: number };
  activeBarbers: ActiveBarber[];
  onStatusChange: (id: string, s: AppointmentStatus) => void;
  onAssignBarber: (id: string, barberId: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {slots.map((slotMin, idx) => {
        const slotAppts = appointmentsBySlot.get(slotMin) ?? [];
        const isLastSlot = idx === slots.length - 1;
        const isCloseTime = slotMin + 30 >= dayHours.closeMin;

        return (
          <div
            key={slotMin}
            className={`flex min-h-[3.5rem] gap-0 ${!isLastSlot && !isCloseTime ? "border-b border-border" : ""}`}
          >
            {/* Time gutter */}
            <div className="flex w-16 shrink-0 items-start justify-center border-r border-border bg-secondary/30 pt-3 text-xs font-mono text-muted-foreground">
              {minToLabel(slotMin)}
            </div>

            {/* Slot content */}
            <div className="flex-1 py-2 px-3">
              {slotAppts.length === 0 ? (
                <span className="text-xs text-muted-foreground/50 italic">
                  Livre
                </span>
              ) : (
                <div className="space-y-2">
                  {slotAppts.map((a) => (
                    <AppointmentRow
                      key={a.id}
                      appointment={a}
                      activeBarbers={activeBarbers}
                      onStatusChange={onStatusChange}
                      onAssignBarber={onAssignBarber}
                      isPending={isPending}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Appointment row ────────────────────────────────────────────────────────────

function AppointmentRow({
  appointment: a,
  activeBarbers,
  onStatusChange,
  onAssignBarber,
  isPending,
  compact = false,
}: {
  appointment: Appointment;
  activeBarbers: ActiveBarber[];
  onStatusChange: (id: string, s: AppointmentStatus) => void;
  onAssignBarber: (id: string, barberId: string) => void;
  isPending: boolean;
  compact?: boolean;
}) {
  const needsAssignment = a.anyBarber && !a.barberId;

  return (
    <article
      className={`rounded-md border bg-card transition-colors ${
        compact ? "p-2" : "p-4"
      } ${a.status === "CANCELLED" ? "opacity-60" : ""} ${
        needsAssignment ? "border-primary/40" : "border-border"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: time + client + service */}
        <div className="flex items-center gap-3">
          {!compact && (
            <div className="font-display text-lg tracking-wide text-primary tabular-nums">
              {formatTime(a.startAt)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              {a.clientName}
              {a.clientPhone && (
                <a
                  href={`tel:${a.clientPhone}`}
                  className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-sm"
                  title={`Ligar para ${a.clientPhone}`}
                >
                  <Phone className="size-3" />
                </a>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {a.serviceName}
              {a.barberName ? ` · ${a.barberName}` : needsAssignment ? null : " · Qualquer barbeiro"}
              {!compact && (
                <>
                  {" "}·{" "}
                  <span className="tabular-nums">{formatBRL(a.priceBRL)}</span>
                </>
              )}
            </div>
            {/* Assign barber UI — only for unassigned anyBarber appointments */}
            {needsAssignment && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-primary font-medium">Qualquer barbeiro</span>
                <Select
                  value=""
                  onValueChange={(v) => { if (v) onAssignBarber(a.id, v); }}
                  disabled={isPending || a.status === "CANCELLED"}
                >
                  <SelectTrigger className="h-6 w-auto min-w-32 border border-primary/40 bg-primary/5 px-2 text-xs text-primary">
                    <SelectValue placeholder="Atribuir barbeiro…" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBarbers.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Right: price (non-compact) + status */}
        <div className="flex items-center gap-3">
          {compact && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatBRL(a.priceBRL)}
            </span>
          )}
          <Select
            value={a.status}
            onValueChange={(v) => onStatusChange(a.id, v as AppointmentStatus)}
            disabled={isPending || a.status === "CANCELLED"}
          >
            <SelectTrigger className="h-7 w-auto min-w-32 border-0 bg-transparent p-0 text-xs shadow-none focus:ring-0">
              <StatusBadge status={a.status} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </article>
  );
}

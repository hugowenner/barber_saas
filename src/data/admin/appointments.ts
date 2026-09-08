import type { Appointment, AppointmentStatus } from "@/types/admin";
import { SERVICES, getServiceById } from "@/data/services";
import { BARBERS, getBarberById } from "@/data/barbers";
import { MOCK_CLIENTS } from "./clients";

/**
 * Mock appointment generator.
 *
 * Appointments are generated relative to the current date so the dashboard
 * always shows "today" data. The structure is deterministic — same client /
 * barber / service / time combinations every render, just anchored to "now".
 *
 * In the real DB, these rows live in the `appointments` table with
 * `startAt`/`endAt` as timestamptz and `status` as an enum.
 */

interface Template {
  /** Minutes from midnight for the start time */
  startMin: number;
  clientId: string;
  barberId: string;
  serviceId: string;
  status: AppointmentStatus;
  /** Day offset from today: 0 = today, -1 = yesterday, +1 = tomorrow */
  dayOffset: number;
}

const TEMPLATES: Template[] = [
  // ---------- Today (dayOffset 0) ----------
  { dayOffset: 0, startMin: 9 * 60, clientId: "c-9", barberId: "carlos-mendes", serviceId: "corte-barba", status: "COMPLETED" },
  { dayOffset: 0, startMin: 10 * 60, clientId: "c-4", barberId: "joao-silva", serviceId: "corte", status: "COMPLETED" },
  { dayOffset: 0, startMin: 11 * 60 + 30, clientId: "c-1", barberId: "rafael-costa", serviceId: "corte-barba", status: "CONFIRMED" },
  { dayOffset: 0, startMin: 14 * 60, clientId: "c-5", barberId: "carlos-mendes", serviceId: "barba", status: "CONFIRMED" },
  { dayOffset: 0, startMin: 15 * 60, clientId: "c-2", barberId: "joao-silva", serviceId: "corte", status: "CONFIRMED" },
  { dayOffset: 0, startMin: 16 * 60, clientId: "c-6", barberId: "rafael-costa", serviceId: "corte-barba", status: "PENDING" },
  { dayOffset: 0, startMin: 17 * 60, clientId: "c-10", barberId: "carlos-mendes", serviceId: "corte", status: "PENDING" },
  { dayOffset: 0, startMin: 18 * 60 + 30, clientId: "c-3", barberId: "joao-silva", serviceId: "barba", status: "CANCELLED" },

  // ---------- Yesterday ----------
  { dayOffset: -1, startMin: 9 * 60, clientId: "c-1", barberId: "carlos-mendes", serviceId: "corte-barba", status: "COMPLETED" },
  { dayOffset: -1, startMin: 10 * 60 + 30, clientId: "c-7", barberId: "joao-silva", serviceId: "corte", status: "NO_SHOW" },
  { dayOffset: -1, startMin: 14 * 60, clientId: "c-5", barberId: "rafael-costa", serviceId: "corte-barba", status: "COMPLETED" },
  { dayOffset: -1, startMin: 16 * 60, clientId: "c-6", barberId: "carlos-mendes", serviceId: "barba", status: "COMPLETED" },

  // ---------- 2 days ago ----------
  { dayOffset: -2, startMin: 9 * 60 + 30, clientId: "c-4", barberId: "carlos-mendes", serviceId: "corte-barba", status: "COMPLETED" },
  { dayOffset: -2, startMin: 11 * 60, clientId: "c-2", barberId: "joao-silva", serviceId: "corte", status: "COMPLETED" },
  { dayOffset: -2, startMin: 15 * 60, clientId: "c-10", barberId: "rafael-costa", serviceId: "corte-barba", status: "COMPLETED" },

  // ---------- 3 days ago ----------
  { dayOffset: -3, startMin: 10 * 60, clientId: "c-9", barberId: "carlos-mendes", serviceId: "corte-barba", status: "COMPLETED" },
  { dayOffset: -3, startMin: 14 * 60 + 30, clientId: "c-1", barberId: "joao-silva", serviceId: "barba", status: "COMPLETED" },
  { dayOffset: -3, startMin: 17 * 60, clientId: "c-5", barberId: "rafael-costa", serviceId: "corte", status: "CANCELLED" },

  // ---------- Tomorrow ----------
  { dayOffset: 1, startMin: 9 * 60, clientId: "c-4", barberId: "carlos-mendes", serviceId: "corte-barba", status: "CONFIRMED" },
  { dayOffset: 1, startMin: 10 * 60, clientId: "c-2", barberId: "joao-silva", serviceId: "corte", status: "CONFIRMED" },
  { dayOffset: 1, startMin: 11 * 60, clientId: "c-6", barberId: "rafael-costa", serviceId: "corte-barba", status: "PENDING" },
  { dayOffset: 1, startMin: 14 * 60 + 30, clientId: "c-1", barberId: "carlos-mendes", serviceId: "corte", status: "CONFIRMED" },
  { dayOffset: 1, startMin: 16 * 60, clientId: "c-9", barberId: "joao-silva", serviceId: "corte-barba", status: "PENDING" },

  // ---------- Day after tomorrow ----------
  { dayOffset: 2, startMin: 9 * 60 + 30, clientId: "c-3", barberId: "rafael-costa", serviceId: "corte-barba", status: "CONFIRMED" },
  { dayOffset: 2, startMin: 13 * 60, clientId: "c-7", barberId: "carlos-mendes", serviceId: "corte", status: "PENDING" },
  { dayOffset: 2, startMin: 15 * 60 + 30, clientId: "c-10", barberId: "joao-silva", serviceId: "barba", status: "CONFIRMED" },
];

function buildAppointment(t: Template, index: number): Appointment {
  const service = getServiceById(t.serviceId) ?? SERVICES[0];
  const barber = getBarberById(t.barberId) ?? BARBERS[0];
  const client = MOCK_CLIENTS.find((c) => c.id === t.clientId) ?? MOCK_CLIENTS[0];

  // Anchor to "today at midnight" then add day offset + start minutes.
  // Using local date construction so the UI shows times in the user's TZ.
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const start = new Date(base.getTime() + t.dayOffset * 24 * 60 * 60 * 1000 + t.startMin * 60 * 1000);
  const end = new Date(start.getTime() + service.durationMin * 60 * 1000);

  return {
    id: `a-${index + 1}`,
    barbershopId: "barbershop-1",
    serviceId: service.id,
    serviceName: service.name,
    barberId: barber.id,
    barberName: barber.name,
    anyBarber: false,
    clientId: client.id,
    clientName: client.name,
    clientPhone: client.phone,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    status: t.status,
    priceBRL: service.priceBRL,
    notes: null,
    createdAt: new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * All mock appointments. Computed once on first import per server lifecycle.
 * On the client, recomputed on each mount (acceptable for a mock).
 */
export const MOCK_APPOINTMENTS: Appointment[] = TEMPLATES.map(buildAppointment);

/** Appointments for a specific calendar day (yyyy-mm-dd). */
export function getAppointmentsByDate(iso: string): Appointment[] {
  // Parse as local date — append T12:00:00 to avoid TZ shift.
  const target = new Date(`${iso}T12:00:00`);
  const targetDay = target.getDate();
  const targetMonth = target.getMonth();
  const targetYear = target.getFullYear();

  return MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.startAt);
    return (
      d.getDate() === targetDay &&
      d.getMonth() === targetMonth &&
      d.getFullYear() === targetYear
    );
  }).sort((a, b) => a.startAt.localeCompare(b.startAt));
}

/** Today's appointments, sorted by start time. */
export function getTodaysAppointments(): Appointment[] {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return getAppointmentsByDate(iso);
}

/** Appointments for a specific client, sorted by start time desc. */
export function getAppointmentsByClient(clientId: string): Appointment[] {
  return MOCK_APPOINTMENTS.filter((a) => a.clientId === clientId).sort((a, b) =>
    b.startAt.localeCompare(a.startAt),
  );
}

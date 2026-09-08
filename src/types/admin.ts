import type { Barber, Service } from "@/types";

/**
 * Admin domain types — separate from the public site types.
 *
 * These mirror the Prisma models so the migration to PostgreSQL is
 * mostly mechanical. The key conceptual split:
 *
 *   - Client:  end customer who books appointments
 *   - AdminUser: staff member with panel access (ADMIN or BARBER role)
 *
 * Never mix the two.
 */

export type AdminRole = "ADMIN" | "BARBER";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  barbershopId: string;
}

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface Appointment {
  id: string;
  barbershopId: string;

  serviceId: string;
  serviceName: string; // denormalized snapshot

  barberId: string | null; // null = any barber
  barberName: string | null;
  anyBarber: boolean;

  clientId: string;
  clientName: string; // denormalized snapshot
  clientPhone: string; // denormalized snapshot

  startAt: string; // ISO datetime
  endAt: string; // ISO datetime

  status: AppointmentStatus;
  priceBRL: number; // snapshot of service price at booking time
  notes: string | null;
  createdAt: string;
}

export type ClientStatus = "ACTIVE" | "INACTIVE";

export interface Client {
  id: string;
  barbershopId: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;

  // Denormalized stats — in the real DB these are computed via queries.
  lastVisitAt: string | null;
  totalAppointments: number;
  totalSpentBRL: number;
  preferredBarberId: string | null;
  preferredServiceId: string | null;
}

export interface BarberSummary {
  barberId: string;
  barberName: string;
  count: number;
}

export interface DashboardStats {
  todayTotal: number;
  todayConfirmed: number;
  todayPending: number;
  todayCompleted: number;
  todayRevenueBRL: number;
  upcomingToday: Appointment[];
  barberSummary: BarberSummary[];
}

/** Form shape for the settings page. */
export interface AdminSettings {
  barbershop: {
    name: string;
    description: string;
    phone: string;
    email: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    zip: string;
  };
  hours: {
    weekday: number;
    label: string;
    open: string;
    close: string;
    enabled: boolean;
  }[];
  booking: {
    minLeadHours: number;
    defaultDurationMin: number;
    allowCancellation: boolean;
    cancellationLeadHours: number;
  };
  whatsapp: {
    enabled: boolean;
    phone: string;
    apiConnected: boolean; // false until real integration lands
  };
}

/** Re-export for convenience when admin components need the catalog types. */
export type { Barber, Service };

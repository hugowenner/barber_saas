import type {
  Barbershop as PrismaBarbershop,
  Barber as PrismaBarber,
  Service as PrismaService,
  Client as PrismaClient,
  Appointment as PrismaAppointment,
} from "@prisma/client";
import type { Barber, Service } from "@/types";
import type { Client, Appointment, DashboardStats, BarberSummary } from "@/types/admin";

export function toBarber(b: PrismaBarber): Barber & { isActive: boolean } {
  return {
    id: b.id,
    name: b.name,
    specialty: b.specialty ?? "",
    bio: b.bio ?? "",
    imageUrl: b.imageUrl,
    isActive: b.isActive,
  };
}

export function toService(s: PrismaService): Service & { isActive: boolean; sortOrder: number } {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    durationMin: s.durationMin,
    priceBRL: s.priceCents / 100,
    isActive: s.isActive,
    sortOrder: s.sortOrder,
  };
}

export function toClient(c: PrismaClient): Client {
  return {
    id: c.id,
    barbershopId: c.barbershopId,
    name: c.name,
    phone: c.phone,
    email: c.email,
    notes: c.notes,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString(),
    lastVisitAt: c.lastVisitAt?.toISOString() ?? null,
    totalAppointments: c.totalAppointments,
    totalSpentBRL: c.totalSpentCents / 100,
    preferredBarberId: c.preferredBarberId,
    preferredServiceId: c.preferredServiceId,
  };
}

type AppointmentWithRelations = PrismaAppointment & {
  service: PrismaService;
  barber: PrismaBarber | null;
  client: PrismaClient | null;
};

export function toAppointment(a: AppointmentWithRelations): Appointment {
  return {
    id: a.id,
    barbershopId: a.barbershopId,
    serviceId: a.serviceId,
    serviceName: a.service.name,
    barberId: a.barberId,
    barberName: a.barber?.name ?? null,
    anyBarber: a.anyBarber,
    clientId: a.clientId ?? "",
    clientName: a.customerName,
    clientPhone: a.customerPhone,
    startAt: a.startAt.toISOString(),
    endAt: a.endAt.toISOString(),
    status: a.status as Appointment["status"],
    priceBRL: a.priceCents / 100,
    notes: a.notes,
    createdAt: a.createdAt.toISOString(),
  };
}

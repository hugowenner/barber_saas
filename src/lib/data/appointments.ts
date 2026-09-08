import { db } from "@/lib/db";
import { toAppointment } from "@/lib/adapters";

const include = {
  service: true,
  barber: true,
  client: true,
} as const;

export async function getAppointments(barbershopId: string) {
  const rows = await db.appointment.findMany({
    where: { barbershopId },
    include,
    orderBy: { startAt: "desc" },
  });
  return rows.map(toAppointment);
}

export async function getAppointmentsByDate(barbershopId: string, date: string) {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59`);
  const rows = await db.appointment.findMany({
    where: { barbershopId, startAt: { gte: start, lte: end } },
    include,
    orderBy: { startAt: "asc" },
  });
  return rows.map(toAppointment);
}

export async function getAppointmentsByClient(barbershopId: string, clientId: string) {
  const rows = await db.appointment.findMany({
    where: { barbershopId, clientId },
    include,
    orderBy: { startAt: "desc" },
  });
  return rows.map(toAppointment);
}

export async function getTodaysAppointments(barbershopId: string) {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return getAppointmentsByDate(barbershopId, iso);
}

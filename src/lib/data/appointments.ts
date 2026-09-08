import { db } from "@/lib/db";
import { toAppointment } from "@/lib/adapters";
import { utcDayRange, todayInTZ } from "@/lib/tz";

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

export async function getAppointmentsByDate(
  barbershopId: string,
  date: string,
  timezone = "America/Sao_Paulo",
) {
  const { gte, lt } = utcDayRange(date, timezone);
  const rows = await db.appointment.findMany({
    where: { barbershopId, startAt: { gte, lt } },
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

export async function getTodaysAppointments(
  barbershopId: string,
  timezone = "America/Sao_Paulo",
) {
  const today = todayInTZ(timezone);
  return getAppointmentsByDate(barbershopId, today, timezone);
}

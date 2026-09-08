import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import { getAppointmentsByDate } from "@/lib/data/appointments";
import { getAllBarbers } from "@/lib/data/barbers";
import { getBusinessHours, getShopTimezone } from "@/lib/data/barbershop";
import { todayInTZ } from "@/lib/tz";
import { AgendaClient } from "./AgendaClient";

export const metadata: Metadata = { title: "Agenda · Barber SaaS" };

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");

  const timezone = await getShopTimezone(session.barbershopId);
  const today = todayInTZ(timezone);

  const { date: rawDate } = await searchParams;
  const date =
    rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : today;

  const [appointments, barbers, businessHours] = await Promise.all([
    getAppointmentsByDate(session.barbershopId, date, timezone),
    getAllBarbers(session.barbershopId),
    getBusinessHours(session.barbershopId),
  ]);

  const hoursForClient = businessHours.map((h) => ({
    weekday: h.weekday,
    openMin: h.openMin,
    closeMin: h.closeMin,
  }));

  return (
    <AgendaClient
      date={date}
      timezone={timezone}
      appointments={appointments}
      barbers={barbers}
      businessHours={hoursForClient}
    />
  );
}

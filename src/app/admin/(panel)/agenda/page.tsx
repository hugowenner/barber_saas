import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import { getAppointmentsByDate } from "@/lib/data/appointments";
import { getAllBarbers } from "@/lib/data/barbers";
import { getBusinessHours } from "@/lib/data/barbershop";
import { AgendaClient } from "./AgendaClient";

export const metadata: Metadata = { title: "Agenda · Barber SaaS" };

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");

  const { date: rawDate } = await searchParams;
  const date =
    rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : todayISO();

  const [appointments, barbers, businessHours] = await Promise.all([
    getAppointmentsByDate(session.barbershopId, date),
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
      appointments={appointments}
      barbers={barbers}
      businessHours={hoursForClient}
    />
  );
}

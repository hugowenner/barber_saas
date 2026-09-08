import type { Metadata } from "next";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { getAppointments } from "@/lib/data/appointments";
import { getAllBarbers } from "@/lib/data/barbers";
import { AppointmentsClient } from "./AppointmentsClient";

export const metadata: Metadata = { title: "Agendamentos" };

export default async function AppointmentsPage() {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");

  const [appointments, barbers] = await Promise.all([
    getAppointments(session.barbershopId),
    getAllBarbers(session.barbershopId),
  ]);

  return <AppointmentsClient initialAppointments={appointments} barbers={barbers} />;
}

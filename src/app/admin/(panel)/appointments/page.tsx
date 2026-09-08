import type { Metadata } from "next";
import { getBarbershop } from "@/lib/data/barbershop";
import { getAppointments } from "@/lib/data/appointments";
import { getAllBarbers } from "@/lib/data/barbers";
import { AppointmentsClient } from "./AppointmentsClient";

export const metadata: Metadata = { title: "Agendamentos" };

export default async function AppointmentsPage() {
  const shop = await getBarbershop();
  if (!shop) return <p className="p-8 text-muted-foreground">Barbearia não encontrada.</p>;

  const [appointments, barbers] = await Promise.all([
    getAppointments(shop.id),
    getAllBarbers(shop.id),
  ]);

  return <AppointmentsClient initialAppointments={appointments} barbers={barbers} />;
}

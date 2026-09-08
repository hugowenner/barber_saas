import type { Metadata } from "next";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { getAllServices } from "@/lib/data/services";
import { ServicesClient } from "./ServicesClient";

export const metadata: Metadata = { title: "Serviços" };

export default async function ServicesPage() {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");

  const services = await getAllServices(session.barbershopId);

  return <ServicesClient initialServices={services} />;
}

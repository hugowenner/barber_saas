import type { Metadata } from "next";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { getAllBarbers } from "@/lib/data/barbers";
import { getServices } from "@/lib/data/services";
import { BarbersClient } from "./BarbersClient";

export const metadata: Metadata = { title: "Barbeiros" };

export default async function BarbersPage() {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");

  const [barbers, services] = await Promise.all([
    getAllBarbers(session.barbershopId),
    getServices(session.barbershopId),
  ]);

  return <BarbersClient initialBarbers={barbers} services={services} />;
}

import type { Metadata } from "next";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { getClients } from "@/lib/data/clients";
import { ClientsClient } from "./ClientsClient";

export const metadata: Metadata = { title: "Clientes" };

export default async function ClientsPage() {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");

  const clients = await getClients(session.barbershopId);

  return <ClientsClient initialClients={clients} />;
}

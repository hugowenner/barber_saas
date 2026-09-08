import type { Metadata } from "next";
import { getBarbershop } from "@/lib/data/barbershop";
import { getClients } from "@/lib/data/clients";
import { ClientsClient } from "./ClientsClient";

export const metadata: Metadata = { title: "Clientes" };

export default async function ClientsPage() {
  const shop = await getBarbershop();
  if (!shop) return <p className="p-8 text-muted-foreground">Barbearia não encontrada.</p>;

  const clients = await getClients(shop.id);

  return <ClientsClient initialClients={clients} />;
}

import type { Metadata } from "next";
import { getBarbershop } from "@/lib/data/barbershop";
import { getAllServices } from "@/lib/data/services";
import { ServicesClient } from "./ServicesClient";

export const metadata: Metadata = { title: "Serviços" };

export default async function ServicesPage() {
  const shop = await getBarbershop();
  if (!shop) return <p className="p-8 text-muted-foreground">Barbearia não encontrada.</p>;

  const services = await getAllServices(shop.id);

  return <ServicesClient barbershopId={shop.id} initialServices={services} />;
}

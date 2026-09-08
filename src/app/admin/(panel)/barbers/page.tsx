import type { Metadata } from "next";
import { getBarbershop } from "@/lib/data/barbershop";
import { getAllBarbers } from "@/lib/data/barbers";
import { getServices } from "@/lib/data/services";
import { BarbersClient } from "./BarbersClient";

export const metadata: Metadata = { title: "Barbeiros" };

export default async function BarbersPage() {
  const shop = await getBarbershop();
  if (!shop) return <p className="p-8 text-muted-foreground">Barbearia não encontrada.</p>;

  const [barbers, services] = await Promise.all([
    getAllBarbers(shop.id),
    getServices(shop.id),
  ]);

  return <BarbersClient barbershopId={shop.id} initialBarbers={barbers} services={services} />;
}

import { db } from "@/lib/db";

export async function getBarbershop() {
  return db.barbershop.findFirst({ where: { isActive: true } });
}

export async function getBusinessHours(barbershopId: string) {
  return db.businessHour.findMany({
    where: { barbershopId, barberId: null },
    orderBy: { weekday: "asc" },
  });
}

export async function getShopTimezone(barbershopId: string): Promise<string> {
  const shop = await db.barbershop.findFirst({
    where: { id: barbershopId },
    select: { timezone: true },
  });
  return shop?.timezone ?? "America/Sao_Paulo";
}

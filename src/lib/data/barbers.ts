import { db } from "@/lib/db";
import { toBarber } from "@/lib/adapters";

export async function getBarbers(barbershopId: string) {
  const rows = await db.barber.findMany({
    where: { barbershopId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toBarber);
}

export async function getAllBarbers(barbershopId: string) {
  const rows = await db.barber.findMany({
    where: { barbershopId },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toBarber);
}

export async function getBarberById(id: string, barbershopId: string) {
  const row = await db.barber.findFirst({ where: { id, barbershopId } });
  return row ? toBarber(row) : null;
}

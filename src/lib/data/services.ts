import { db } from "@/lib/db";
import { toService } from "@/lib/adapters";

export async function getServices(barbershopId: string) {
  const rows = await db.service.findMany({
    where: { barbershopId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toService);
}

export async function getAllServices(barbershopId: string) {
  const rows = await db.service.findMany({
    where: { barbershopId },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toService);
}

export async function getServiceById(id: string, barbershopId: string) {
  const row = await db.service.findFirst({ where: { id, barbershopId } });
  return row ? toService(row) : null;
}

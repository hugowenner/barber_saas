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

export async function getServiceById(id: string) {
  const row = await db.service.findUnique({ where: { id } });
  return row ? toService(row) : null;
}

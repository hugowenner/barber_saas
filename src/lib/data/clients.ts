import { db } from "@/lib/db";
import { toClient } from "@/lib/adapters";

export async function getClients(barbershopId: string) {
  const rows = await db.client.findMany({
    where: { barbershopId },
    orderBy: { name: "asc" },
  });
  return rows.map(toClient);
}

export async function getClientById(id: string) {
  const row = await db.client.findUnique({ where: { id } });
  return row ? toClient(row) : null;
}

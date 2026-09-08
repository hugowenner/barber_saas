import { db } from "@/lib/db";

export async function getBarbershop() {
  return db.barbershop.findFirst({ where: { isActive: true } });
}

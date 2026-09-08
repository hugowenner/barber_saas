"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-session";

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createService(data: {
  name: string;
  description?: string;
  durationMin: number;
  priceBRL: number;
}) {
  const { barbershopId } = await requireSession();
  await db.service.create({
    data: {
      barbershopId,
      name: data.name,
      description: data.description,
      durationMin: data.durationMin,
      priceCents: Math.round(data.priceBRL * 100),
      isActive: true,
    },
  });
  revalidatePath("/admin/services");
}

export async function updateService(id: string, data: {
  name?: string;
  description?: string;
  durationMin?: number;
  priceBRL?: number;
  isActive?: boolean;
}) {
  const { barbershopId } = await requireSession();
  const { priceBRL, ...rest } = data;
  await db.service.updateMany({
    where: { id, barbershopId },
    data: {
      ...rest,
      ...(priceBRL !== undefined ? { priceCents: Math.round(priceBRL * 100) } : {}),
    },
  });
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  const { barbershopId } = await requireSession();
  await db.service.updateMany({ where: { id, barbershopId }, data: { isActive: false } });
  revalidatePath("/admin/services");
}

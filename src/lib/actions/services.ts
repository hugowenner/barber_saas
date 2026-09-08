"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createService(barbershopId: string, data: {
  name: string;
  description?: string;
  durationMin: number;
  priceBRL: number;
}) {
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
  const { priceBRL, ...rest } = data;
  await db.service.update({
    where: { id },
    data: {
      ...rest,
      ...(priceBRL !== undefined ? { priceCents: Math.round(priceBRL * 100) } : {}),
    },
  });
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  await db.service.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/services");
}

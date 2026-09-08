"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createBarber(barbershopId: string, data: {
  name: string;
  specialty?: string;
  bio?: string;
  imageUrl?: string | null;
}) {
  await db.barber.create({
    data: { barbershopId, ...data, isActive: true },
  });
  revalidatePath("/admin/barbers");
}

export async function updateBarber(id: string, data: {
  name?: string;
  specialty?: string;
  bio?: string;
  imageUrl?: string | null;
  isActive?: boolean;
}) {
  await db.barber.update({ where: { id }, data });
  revalidatePath("/admin/barbers");
}

export async function deleteBarber(id: string) {
  await db.barber.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/barbers");
}

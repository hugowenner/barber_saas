"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-session";

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createBarber(data: {
  name: string;
  specialty?: string;
  bio?: string;
  imageUrl?: string | null;
}) {
  const { barbershopId } = await requireSession();
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
  const { barbershopId } = await requireSession();
  await db.barber.updateMany({ where: { id, barbershopId }, data });
  revalidatePath("/admin/barbers");
}

export async function deleteBarber(id: string) {
  const { barbershopId } = await requireSession();
  await db.barber.updateMany({ where: { id, barbershopId }, data: { isActive: false } });
  revalidatePath("/admin/barbers");
}

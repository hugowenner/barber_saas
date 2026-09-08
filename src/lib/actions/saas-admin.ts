"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-session";
import type { BarbershopPlan, BarbershopStatus } from "@prisma/client";

async function requireSuperAdmin(): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") throw new Error("Forbidden");
}

export async function updateBarbershopPlan(barbershopId: string, plan: BarbershopPlan) {
  await requireSuperAdmin();
  await db.barbershop.update({ where: { id: barbershopId }, data: { plan } });
  revalidatePath("/saas-admin/dashboard");
}

export async function updateBarbershopStatus(barbershopId: string, status: BarbershopStatus) {
  await requireSuperAdmin();
  await db.barbershop.update({ where: { id: barbershopId }, data: { status } });
  revalidatePath("/saas-admin/dashboard");
}

export async function changePlanAction(formData: FormData) {
  await requireSuperAdmin();
  const barbershopId = formData.get("barbershopId") as string;
  const plan = formData.get("plan") as BarbershopPlan;
  if (!barbershopId || !plan) return;
  await db.barbershop.update({ where: { id: barbershopId }, data: { plan } });
  revalidatePath("/saas-admin/dashboard");
}

export async function toggleStatusAction(formData: FormData) {
  await requireSuperAdmin();
  const barbershopId = formData.get("barbershopId") as string;
  const current = formData.get("currentStatus") as BarbershopStatus;
  if (!barbershopId || !current) return;
  const status: BarbershopStatus = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  await db.barbershop.update({ where: { id: barbershopId }, data: { status } });
  revalidatePath("/saas-admin/dashboard");
}

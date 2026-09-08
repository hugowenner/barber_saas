"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { AppointmentStatus } from "@prisma/client";

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  await db.appointment.update({ where: { id }, data: { status } });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
}

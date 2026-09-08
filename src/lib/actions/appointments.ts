"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-session";
import type { AppointmentStatus } from "@prisma/client";

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const session = await getSession();
  if (!session || !session.barbershopId) throw new Error("Unauthorized");

  await db.appointment.updateMany({
    where: { id, barbershopId: session.barbershopId },
    data: { status },
  });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/dashboard");
}

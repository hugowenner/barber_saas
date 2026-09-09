"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-session";
import { Prisma } from "@prisma/client";
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

export async function assignAppointmentBarber(
  appointmentId: string,
  barberId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const session = await getSession();
    if (!session?.barbershopId) return { ok: false, error: "Não autorizado." };
    const barbershopId = session.barbershopId;

    const result = await db.$transaction(
      async (tx) => {
      // Appointment must belong to this tenant
      const appt = await tx.appointment.findFirst({
        where: { id: appointmentId, barbershopId },
      });
      if (!appt) return { ok: false as const, error: "Agendamento não encontrado." };
      if (appt.status === "CANCELLED")
        return { ok: false as const, error: "Agendamento cancelado não pode ser atribuído." };
      if (!appt.anyBarber || appt.barberId !== null)
        return { ok: false as const, error: "Agendamento já possui barbeiro atribuído." };

      // Barber must belong to this tenant and be active
      const barber = await tx.barber.findFirst({
        where: { id: barberId, barbershopId, isActive: true },
      });
      if (!barber) return { ok: false as const, error: "Barbeiro não encontrado." };

      // Overlap check: same barber, not cancelled, not self
      const conflict = await tx.appointment.findFirst({
        where: {
          barbershopId,
          barberId,
          status: { notIn: ["CANCELLED"] },
          id: { not: appointmentId },
          startAt: { lt: appt.endAt },
          endAt: { gt: appt.startAt },
        },
      });
      if (conflict)
        return { ok: false as const, error: "Horário não disponível para este barbeiro." };

      await tx.appointment.update({
        where: { id: appointmentId },
        data: { barberId, anyBarber: false },
      });

      return { ok: true as const };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    if (result.ok) {
      revalidatePath("/admin/agenda");
      revalidatePath("/admin/appointments");
      revalidatePath("/admin/dashboard");
    }

    return result;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 = unique constraint violation
      // P2034 = serialization failure (PostgreSQL SERIALIZABLE — retry-safe)
      if (e.code === "P2002" || e.code === "P2034") {
        return { ok: false, error: "Horário não disponível para este barbeiro." };
      }
    }
    console.error("[assignAppointmentBarber]", e);
    return { ok: false, error: "Erro ao atribuir barbeiro. Tente novamente." };
  }
}

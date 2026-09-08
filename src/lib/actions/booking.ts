"use server";

import { db } from "@/lib/db";

export async function createPublicBooking(data: {
  barbershopId: string;
  serviceId: string;
  barberId: string | null;
  anyBarber: boolean;
  date: string;
  time: string;
  durationMin: number;
  customerName: string;
  customerPhone: string;
  priceCents: number;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const phone = data.customerPhone.replace(/\D/g, "");

    const service = await db.service.findFirst({
      where: { id: data.serviceId, barbershopId: data.barbershopId, isActive: true },
    });
    if (!service) return { ok: false, error: "Serviço não encontrado." };

    let client = await db.client.findFirst({
      where: { barbershopId: data.barbershopId, phone },
    });
    if (!client) {
      client = await db.client.create({
        data: {
          barbershopId: data.barbershopId,
          name: data.customerName,
          phone,
          isActive: true,
        },
      });
    }

    const start = new Date(`${data.date}T${data.time}:00`);
    const end = new Date(start.getTime() + data.durationMin * 60_000);

    await db.appointment.create({
      data: {
        barbershopId: data.barbershopId,
        serviceId: service.id,
        barberId: data.barberId,
        clientId: client.id,
        anyBarber: data.anyBarber,
        startAt: start,
        endAt: end,
        customerName: data.customerName,
        customerPhone: phone,
        status: "PENDING",
        priceCents: service.priceCents,
      },
    });

    await db.client.update({
      where: { id: client.id },
      data: {
        totalAppointments: { increment: 1 },
        totalSpentCents: { increment: service.priceCents },
      },
    });

    return { ok: true };
  } catch (e) {
    console.error("[createPublicBooking]", e);
    return { ok: false, error: "Erro ao criar agendamento. Tente novamente." };
  }
}

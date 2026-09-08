"use server";

import { db } from "@/lib/db";
import { getBarbershop } from "@/lib/data/barbershop";
import { Prisma } from "@prisma/client";

export async function createPublicBooking(data: {
  serviceId: string;
  barberId: string | null;
  anyBarber: boolean;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const phone = data.customerPhone.replace(/\D/g, "");

    // barbershopId is always derived from the server — never trusted from client
    const shop = await getBarbershop();
    if (!shop) return { ok: false, error: "Barbearia não encontrada." };
    const barbershopId = shop.id;

    // Validate service belongs to this barbershop
    const service = await db.service.findFirst({
      where: { id: data.serviceId, barbershopId, isActive: true },
    });
    if (!service) return { ok: false, error: "Serviço não encontrado." };

    // Validate barber belongs to this barbershop (prevents cross-tenant injection)
    if (!data.anyBarber && data.barberId) {
      const barber = await db.barber.findFirst({
        where: { id: data.barberId, barbershopId, isActive: true },
      });
      if (!barber) return { ok: false, error: "Barbeiro não encontrado." };
    }

    const start = new Date(`${data.date}T${data.time}:00`);
    // Use service.durationMin from DB — never trust client-supplied duration
    const end = new Date(start.getTime() + service.durationMin * 60_000);

    // Validate business hours
    const weekday = start.getDay();
    const businessHour = await db.businessHour.findFirst({
      where: { barbershopId, weekday, barberId: null },
    });
    if (!businessHour) {
      return { ok: false, error: "A barbearia não atende neste dia." };
    }
    const startMin = start.getHours() * 60 + start.getMinutes();
    const endMin = end.getHours() * 60 + end.getMinutes();
    if (startMin < businessHour.openMin || endMin > businessHour.closeMin) {
      return { ok: false, error: "Horário fora do funcionamento da barbearia." };
    }

    // Conflict check + appointment creation inside a single transaction
    const result = await db.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          barbershopId,
          ...(data.barberId && !data.anyBarber ? { barberId: data.barberId } : {}),
          status: { notIn: ["CANCELLED"] },
          startAt: { lt: end },
          endAt: { gt: start },
        },
      });
      if (conflict) {
        return { ok: false as const, error: "Horário não disponível. Tente outro horário." };
      }

      let client = await tx.client.findFirst({ where: { barbershopId, phone } });
      if (!client) {
        client = await tx.client.create({
          data: { barbershopId, name: data.customerName, phone, isActive: true },
        });
      }

      await tx.appointment.create({
        data: {
          barbershopId,
          serviceId: service.id,
          barberId: data.anyBarber ? null : data.barberId,
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

      await tx.client.update({
        where: { id: client.id },
        data: {
          totalAppointments: { increment: 1 },
          totalSpentCents: { increment: service.priceCents },
        },
      });

      return { ok: true as const };
    });

    return result;
  } catch (e) {
    // P2002 = unique constraint violation — two concurrent requests for the same barber+startAt
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "Horário não disponível. Tente outro horário." };
    }
    console.error("[createPublicBooking]", e);
    return { ok: false, error: "Erro ao criar agendamento. Tente novamente." };
  }
}

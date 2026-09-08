"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-session";

async function requireBarbershopSession(): Promise<{ barbershopId: string }> {
  const session = await getSession();
  if (!session?.barbershopId) throw new Error("Unauthorized");
  return { barbershopId: session.barbershopId };
}

function timeToMin(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export async function updateBarbershopInfo(data: {
  name: string;
  description: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zip: string;
}) {
  const { barbershopId } = await requireBarbershopSession();
  await db.barbershop.update({
    where: { id: barbershopId },
    data: {
      name: data.name,
      tagline: data.description,
      phone: data.phone,
      email: data.email,
      street: data.street,
      number: data.number,
      district: data.district,
      city: data.city,
      state: data.state,
      zip: data.zip,
    },
  });
  revalidatePath("/admin/settings");
}

export async function updateWhatsapp(phone: string) {
  const { barbershopId } = await requireBarbershopSession();
  await db.barbershop.update({
    where: { id: barbershopId },
    data: { whatsapp: phone },
  });
  revalidatePath("/admin/settings");
}

export async function updateBusinessHours(
  hours: { weekday: number; open: string; close: string; enabled: boolean }[],
) {
  const { barbershopId } = await requireBarbershopSession();
  await db.businessHour.deleteMany({ where: { barbershopId, barberId: null } });
  const enabled = hours.filter((h) => h.enabled);
  if (enabled.length > 0) {
    await db.businessHour.createMany({
      data: enabled.map((h) => ({
        barbershopId,
        weekday: h.weekday,
        openMin: timeToMin(h.open),
        closeMin: timeToMin(h.close),
      })),
    });
  }
  revalidatePath("/admin/settings");
}

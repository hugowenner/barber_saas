import { db } from "@/lib/db";
import type { AdminSettings } from "@/types/admin";

const WEEKDAY_LABELS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function minToTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export async function getAdminSettings(barbershopId: string): Promise<AdminSettings> {
  const [shop, hours] = await Promise.all([
    db.barbershop.findUnique({ where: { id: barbershopId } }),
    db.businessHour.findMany({
      where: { barbershopId, barberId: null },
      orderBy: { weekday: "asc" },
    }),
  ]);

  const hoursMap = new Map(hours.map((h) => [h.weekday, h]));

  const allDays: AdminSettings["hours"] = Array.from({ length: 7 }, (_, i) => {
    const h = hoursMap.get(i);
    return {
      weekday: i,
      label: WEEKDAY_LABELS[i],
      open: h ? minToTime(h.openMin) : "09:00",
      close: h ? minToTime(h.closeMin) : "18:00",
      enabled: !!h,
    };
  });

  return {
    barbershop: {
      name: shop?.name ?? "",
      description: shop?.tagline ?? "",
      phone: shop?.phone ?? "",
      email: shop?.email ?? "",
      street: shop?.street ?? "",
      number: shop?.number ?? "",
      district: shop?.district ?? "",
      city: shop?.city ?? "",
      state: shop?.state ?? "",
      zip: shop?.zip ?? "",
    },
    hours: allDays,
    booking: {
      minLeadHours: 2,
      defaultDurationMin: 30,
      allowCancellation: true,
      cancellationLeadHours: 2,
    },
    whatsapp: {
      enabled: true,
      phone: shop?.whatsapp ?? "",
      apiConnected: false,
    },
  };
}

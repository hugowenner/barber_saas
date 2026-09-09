import { db } from "@/lib/db";
import type { Testimonial } from "@/types";

export async function getBarbershop() {
  return db.barbershop.findFirst({ where: { isActive: true } });
}

export async function getBarbershopBySlug(slug: string) {
  return db.barbershop.findUnique({ where: { slug } });
}

export async function getBusinessHours(barbershopId: string) {
  return db.businessHour.findMany({
    where: { barbershopId, barberId: null },
    orderBy: { weekday: "asc" },
  });
}

export async function getShopTimezone(barbershopId: string): Promise<string> {
  const shop = await db.barbershop.findFirst({
    where: { id: barbershopId },
    select: { timezone: true },
  });
  return shop?.timezone ?? "America/Sao_Paulo";
}

export async function getTestimonials(barbershopId: string): Promise<Testimonial[]> {
  const rows = await db.testimonial.findMany({
    where: { barbershopId, isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return rows.map((t) => ({
    id: t.id,
    author: t.author,
    context: t.context ?? "",
    quote: t.quote,
    rating: Math.max(1, Math.min(5, t.rating)) as 1 | 2 | 3 | 4 | 5,
  }));
}

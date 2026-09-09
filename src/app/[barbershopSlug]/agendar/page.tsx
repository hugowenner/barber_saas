import { notFound } from "next/navigation";
import { getBarbershopBySlug, getBusinessHours } from "@/lib/data/barbershop";
import { getServices } from "@/lib/data/services";
import { getBarbers } from "@/lib/data/barbers";
import { BookingClient } from "@/app/agendar/BookingClient";
import type { HourConfig } from "@/data/availability";

function minToTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

interface Props {
  params: Promise<{ barbershopSlug: string }>;
}

export default async function TenantAgendarPage({ params }: Props) {
  const { barbershopSlug } = await params;
  const shop = await getBarbershopBySlug(barbershopSlug);
  if (!shop || !shop.isActive) notFound();

  const [services, barbers, hours] = await Promise.all([
    getServices(shop.id),
    getBarbers(shop.id),
    getBusinessHours(shop.id),
  ]);

  const businessHours: HourConfig[] = hours.map((h) => ({
    weekday: h.weekday,
    open: minToTime(h.openMin),
    close: minToTime(h.closeMin),
  }));

  return (
    <BookingClient
      services={services}
      barbers={barbers}
      businessHours={businessHours}
      shop={{
        name: shop.name,
        whatsapp: shop.whatsapp ?? "",
        address: `${shop.street}, ${shop.number} — ${shop.city}/${shop.state}`,
        timezone: shop.timezone ?? "America/Sao_Paulo",
      }}
      barbershopSlug={shop.slug}
      backHref={`/${barbershopSlug}`}
    />
  );
}

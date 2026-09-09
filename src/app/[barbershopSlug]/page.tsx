import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BarbersSection } from "@/components/home/BarbersSection";
import { GallerySection } from "@/components/home/GallerySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { FinalCta } from "@/components/home/FinalCta";
import { getBarbershopBySlug, getBusinessHours, getTestimonials } from "@/lib/data/barbershop";
import { getBarbers } from "@/lib/data/barbers";
import { getServices } from "@/lib/data/services";
import type { BusinessHours, FooterShopData } from "@/types";

const WEEKDAY_LABELS: Record<number, string> = {
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
  0: "Domingo",
};

function minToTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

interface Props {
  params: Promise<{ barbershopSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { barbershopSlug } = await params;
  const shop = await getBarbershopBySlug(barbershopSlug);
  if (!shop) return {};
  return {
    title: shop.name,
    description: shop.tagline ?? undefined,
  };
}

export default async function BarbershopPage({ params }: Props) {
  const { barbershopSlug } = await params;
  const shop = await getBarbershopBySlug(barbershopSlug);
  if (!shop || !shop.isActive) notFound();

  const [barbers, services, dbHours, testimonials] = await Promise.all([
    getBarbers(shop.id),
    getServices(shop.id),
    getBusinessHours(shop.id),
    getTestimonials(shop.id),
  ]);

  const hours: BusinessHours[] = dbHours.map((h) => ({
    weekday: h.weekday as BusinessHours["weekday"],
    open: minToTime(h.openMin),
    close: minToTime(h.closeMin),
    label: WEEKDAY_LABELS[h.weekday] ?? `Dia ${h.weekday}`,
  }));

  const bookingHref = `/${barbershopSlug}/agendar`;

  const footerData: FooterShopData = {
    name: shop.name,
    tagline: shop.tagline ?? null,
    phone: shop.phone ?? null,
    whatsapp: shop.whatsapp ?? null,
    instagram: shop.instagram ?? null,
    street: shop.street ?? null,
    number: shop.number ?? null,
    district: shop.district ?? null,
    city: shop.city ?? null,
    state: shop.state ?? null,
    mapsQuery: shop.mapsQuery ?? null,
    hours: hours.map((h) => ({
      weekday: h.weekday,
      open: h.open,
      close: h.close,
      label: h.label,
    })),
  };

  return (
    <SiteShell footerData={footerData}>
      <Hero
        shop={{
          name: shop.name,
          city: shop.city ?? "",
          tagline: shop.tagline,
        }}
        bookingHref={bookingHref}
      />
      <ServicesSection services={services} bookingHref={bookingHref} />
      <BarbersSection barbers={barbers} />
      <GallerySection />
      <TestimonialsSection testimonials={testimonials.length > 0 ? testimonials : undefined} />
      <LocationSection
        shop={{
          name: shop.name,
          phone: shop.phone,
          whatsapp: shop.whatsapp,
          street: shop.street,
          number: shop.number,
          district: shop.district,
          city: shop.city,
          state: shop.state,
          zip: shop.zip,
          mapsQuery: shop.mapsQuery,
          hours: hours.length > 0 ? hours : undefined,
        }}
      />
      <FinalCta bookingHref={bookingHref} />
    </SiteShell>
  );
}

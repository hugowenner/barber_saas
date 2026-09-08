import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BarbersSection } from "@/components/home/BarbersSection";
import { GallerySection } from "@/components/home/GallerySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { FinalCta } from "@/components/home/FinalCta";
import { getBarbershop } from "@/lib/data/barbershop";
import { getBarbers } from "@/lib/data/barbers";
import { getServices } from "@/lib/data/services";

export default async function HomePage() {
  const shop = await getBarbershop();
  const [barbers, services] = await Promise.all([
    shop ? getBarbers(shop.id) : Promise.resolve([]),
    shop ? getServices(shop.id) : Promise.resolve([]),
  ]);

  return (
    <SiteShell>
      <Hero />
      <ServicesSection services={services} />
      <BarbersSection barbers={barbers} />
      <GallerySection />
      <TestimonialsSection />
      <LocationSection />
      <FinalCta />
    </SiteShell>
  );
}

import { SiteShell } from "@/components/layout/SiteShell";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BarbersSection } from "@/components/home/BarbersSection";
import { GallerySection } from "@/components/home/GallerySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <ServicesSection />
      <BarbersSection />
      <GallerySection />
      <TestimonialsSection />
      <LocationSection />
      <FinalCta />
    </SiteShell>
  );
}

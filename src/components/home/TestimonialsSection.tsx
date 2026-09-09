import { SectionHeading } from "./SectionHeading";
import { TestimonialCard } from "./TestimonialCard";
import { TESTIMONIALS } from "@/data/testimonials";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps = {}) {
  const items = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;

  return (
    <section
      id="avaliacoes"
      className="border-b border-border py-20 sm:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-section">
        <SectionHeading
          index="04"
          eyebrow="Avaliações"
          title="Quem confia"
          description="Não somos nós que falamos por nós. São eles."
        />

        <ul
          id="testimonials-heading"
          className="mt-12 grid gap-4 md:grid-cols-3"
        >
          {items.map((t) => (
            <li key={t.id}>
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

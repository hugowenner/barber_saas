import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-6 rounded-lg border border-border bg-card p-6",
        className,
      )}
    >
      <div className="space-y-4">
        <Quote className="size-6 text-primary/60" aria-hidden />
        <blockquote className="text-base leading-relaxed text-foreground/90">
          “{testimonial.quote}”
        </blockquote>
      </div>
      <figcaption className="flex items-center justify-between gap-4 border-t border-border pt-4">
        <div>
          <div className="font-display text-lg tracking-[0.04em] text-foreground">
            {testimonial.author}
          </div>
          <div className="text-xs text-muted-foreground">
            {testimonial.context}
          </div>
        </div>
        <div
          className="flex items-center gap-0.5"
          aria-label={`Avaliação ${testimonial.rating} de 5`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3.5",
                i < testimonial.rating
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/40",
              )}
              aria-hidden
            />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

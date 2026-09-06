import type { Testimonial } from "@/types";

/**
 * Static testimonials. Migrates to a `testimonials` table.
 * Keep the list short — premium feel is about restraint.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    author: "André Oliveira",
    context: "Cliente há 3 anos",
    quote:
      "Melhor barbearia que já frequentei. O João entende de cabelo como ninguém. Saio sempre com o corte exato que pedi.",
    rating: 5,
  },
  {
    id: "t-2",
    author: "Pedro Henrique",
    context: "Cliente há 1 ano",
    quote:
      "Ambiente impecável e atendimento de primeira. A barba na navalha do Carlos é outra categoria.",
    rating: 5,
  },
  {
    id: "t-3",
    author: "Marcos Vinícius",
    context: "Cliente há 2 anos",
    quote:
      "Agendar pelo site é rápido demais. Em 30 segundos está marcado. O corte do Rafael é sempre certeiro.",
    rating: 5,
  },
];

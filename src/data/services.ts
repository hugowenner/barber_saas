import type { Service } from "@/types";

/**
 * Static service catalog. Migrates to a `services` table grouped by tenant.
 */
export const SERVICES: Service[] = [
  {
    id: "corte",
    name: "Corte",
    description:
      "Corte masculino personalizado com acabamento e finalização. Inclui consulta de estilo.",
    durationMin: 30,
    priceBRL: 40,
  },
  {
    id: "barba",
    name: "Barba",
    description:
      "Modelagem de barba com toalha quente, navalha e óleos. Hidratação e acabamento.",
    durationMin: 30,
    priceBRL: 30,
  },
  {
    id: "corte-barba",
    name: "Corte + Barba",
    description:
      "Combinação completa: corte personalizado e modelagem de barba. A experiência BARBER HOUSE.",
    durationMin: 60,
    priceBRL: 65,
  },
  {
    id: "sobrancelha",
    name: "Sobrancelha",
    description:
      "Design e alinhamento de sobrancelha masculina com navalha e acabamento.",
    durationMin: 15,
    priceBRL: 15,
  },
];

export const getServiceById = (id: string): Service | undefined =>
  SERVICES.find((s) => s.id === id);

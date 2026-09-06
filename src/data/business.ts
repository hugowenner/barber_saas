import type { SiteConfig } from "@/types";

/**
 * Single source of truth for barbershop identity & contact info.
 * Replace this with a `barbershops` table once multi-tenancy lands.
 */
export const SITE_CONFIG: SiteConfig = {
  name: "BARBER HOUSE",
  tagline: "Seu estilo começa na cadeira.",
  description:
    "Barbearia premium em São Paulo. Cortes masculinos, barba e experiências de cuidado feitas por mestres barbeiros. Agende seu horário online em segundos.",
  phone: "+55 11 4000-1234",
  whatsapp: "5511940001234",
  email: "contato@barberhouse.com.br",
  instagram: "barberhouse",
  address: {
    street: "Rua Augusta",
    number: "1500",
    district: "Consolação",
    city: "São Paulo",
    state: "SP",
    zip: "01304-001",
  },
  mapsQuery: "Barber House, Rua Augusta 1500, Consolação, São Paulo",
  hours: [
    // weekday follows JS Date.getDay(): 0 = Sunday … 6 = Saturday
    { weekday: 1, open: "09:00", close: "20:00", label: "Segunda" },
    { weekday: 2, open: "09:00", close: "20:00", label: "Terça" },
    { weekday: 3, open: "09:00", close: "20:00", label: "Quarta" },
    { weekday: 4, open: "09:00", close: "20:00", label: "Quinta" },
    { weekday: 5, open: "09:00", close: "20:00", label: "Sexta" },
    { weekday: 6, open: "09:00", close: "18:00", label: "Sábado" },
    // Sunday (0) closed
  ],
};

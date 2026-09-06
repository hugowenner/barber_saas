import type { Barber } from "@/types";

/**
 * Static barber roster. Migrates to a `barbers` table.
 * Image URLs use Unsplash CDN — stable, no API key needed.
 */
export const BARBERS: Barber[] = [
  {
    id: "joao-silva",
    name: "João Silva",
    specialty: "Especialista em cortes degradê",
    bio: "Mais de 10 anos de barbearia. Aprecia um degradê limpo e uma navalha bem afiada.",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "carlos-mendes",
    name: "Carlos Mendes",
    specialty: "Especialista em barba",
    bio: "Barba na navalha é sua assinatura. Hidratação, óleo e acabamento impecável.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "rafael-costa",
    name: "Rafael Costa",
    specialty: "Especialista em cortes clássicos",
    bio: "Cortes atemporais com técnica tradicional. Para quem valoriza elegância sem data de validade.",
    imageUrl:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
  },
];

export const getBarberById = (id: string): Barber | undefined =>
  BARBERS.find((b) => b.id === id);

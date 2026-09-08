import type { GalleryImage } from "@/types";

/**
 * Static gallery for the "ambiente" section.
 * All URLs verified to return HTTP 200 from Unsplash CDN.
 * Stable URLs — no API key, no rate limit.
 */
export const GALLERY: GalleryImage[] = [
  {
    id: "g-1",
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
    alt: "Interior da barbearia com cadeiras pretas e iluminação quente",
  },
  {
    id: "g-2",
    url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
    alt: "Estação de barbeiro com navalha e ferramentas organizadas",
  },
  {
    id: "g-3",
    url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80",
    alt: "Cadeira de barbeiro em couro preto e detalhes em metal",
  },
  {
    id: "g-4",
    url: "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?auto=format&fit=crop&w=900&q=80",
    alt: "Ambiente da barbearia com paredes escuras e iluminação dramática",
  },
  {
    id: "g-5",
    url: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&w=900&q=80",
    alt: "Detalhe de produto de barbearia e toalhas dobradas",
  },
];

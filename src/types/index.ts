/**
 * Domain types — shared across the product.
 *
 * These mirror the future Prisma models so the migration to PostgreSQL
 * is mostly mechanical: replace the static data imports with `db.*` queries.
 */

export type ServiceId = string;
export type BarberId = string;

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  /** Duration in minutes */
  durationMin: number;
  /** Price in BRL */
  priceBRL: number;
}

export interface Barber {
  id: BarberId;
  name: string;
  specialty: string;
  bio: string;
  /** Image URL — leave null to render an initials-based avatar */
  imageUrl: string | null;
}

export interface Testimonial {
  id: string;
  author: string;
  /** Short context, e.g. "Cliente há 2 anos" */
  context: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface BusinessAddress {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zip: string;
}

export interface BusinessHours {
  /** JS Date.getDay(): 0 = Sunday … 6 = Saturday */
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  open: string; // "09:00"
  close: string; // "20:00"
  /** Closed days are omitted from the list */
  label: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string; // E.164 without "+"
  email: string;
  instagram: string;
  address: BusinessAddress;
  /** Google Maps query string — used to build the "open in maps" link */
  mapsQuery: string;
  hours: BusinessHours[];
}

/** Tenant data passed to Footer when rendering inside a tenant route. */
export interface FooterShopData {
  name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  street: string | null;
  number: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  mapsQuery: string | null;
  hours: Array<{ weekday: number; open: string; close: string; label: string }>;
}

/* ---------- Booking flow types ---------- */

export type BookingStep =
  | "service"
  | "barber"
  | "date"
  | "time"
  | "customer"
  | "confirmation";

export interface BookingState {
  service: Service | null;
  barber: Barber | null; // null also means "any barber" once selected
  anyBarber: boolean;
  date: string | null; // ISO date yyyy-mm-dd
  time: string | null; // "HH:mm"
  customerName: string;
  customerPhone: string;
  confirmed: boolean;
}

export interface TimeSlot {
  /** "HH:mm" */
  time: string;
  available: boolean;
}

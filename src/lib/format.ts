/**
 * Pure formatting helpers — no React, easy to test and reuse.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const DATE_LONG = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

const TIME_12H = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatBRL(value: number): string {
  return BRL.format(value);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

export function formatPhoneDigits(raw: string): string {
  // Keeps only digits. Used to build WhatsApp deep links.
  return raw.replace(/\D/g, "");
}

/** Format a yyyy-mm-dd string into a long Portuguese date, e.g. "segunda-feira, 07 de outubro". */
export function formatLongDate(iso: string): string {
  // Parse as local date — avoid TZ shift by appending T12:00:00
  const d = new Date(`${iso}T12:00:00`);
  return DATE_LONG.format(d);
}

export function formatDateShort(d: Date): string {
  return String(d.getDate()).padStart(2, "0");
}

export function formatWeekdayShort(d: Date): string {
  return d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

export function formatTimeLabel(time: string): string {
  // time is "HH:mm" — return as-is for now, but this is the central seam
  // if we ever switch to 12h display.
  return time;
}

export function formatTimeFromDate(d: Date): string {
  return TIME_12H.format(d);
}

/** Builds a WhatsApp deep link with a pre-filled message. */
export function buildWhatsAppLink(phoneE164: string, message: string): string {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}

/** Builds a Google Calendar event link. */
export function buildGoogleCalendarLink(opts: {
  title: string;
  details: string;
  location: string;
  start: Date;
  end: Date;
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    details: opts.details,
    location: opts.location,
    dates: `${fmt(opts.start)}/${fmt(opts.end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Builds a Google Maps directions link. */
export function buildMapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

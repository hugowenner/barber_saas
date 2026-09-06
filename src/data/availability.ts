import type { Barber, TimeSlot } from "@/types";
import { SITE_CONFIG } from "@/data/business";

/**
 * Availability module.
 *
 * This is the seam between the static MVP and the future PostgreSQL-backed
 * scheduling engine. Today it returns mock data deterministically derived
 * from the barbershop's business hours. Tomorrow it becomes an async
 * function that queries the `appointments` table for booked slots and
 * returns the same `TimeSlot[]` shape.
 *
 * Swap points:
 *   - `getTimeSlots()` → query existing appointments + barber schedule
 *   - `getOpenDays()`  → query per-barber working days
 */

/** Slot granularity in minutes. Keep in sync with the UI. */
export const SLOT_INTERVAL_MIN = 30;

/**
 * Returns the next N bookable days (skipping closed days).
 * Today is included only if the barbershop is still open.
 */
export function getOpenDays(count = 6, from: Date = new Date()): Date[] {
  const days: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  // Safety cap to avoid infinite loops if config is broken.
  let scanned = 0;
  while (days.length < count && scanned < 14) {
    const weekday = cursor.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const open = SITE_CONFIG.hours.find((h) => h.weekday === weekday);
    if (open) {
      // Skip today if already past closing time.
      if (scanned === 0) {
        const [closeH, closeM] = open.close.split(":").map(Number);
        const closeAt = new Date(cursor);
        closeAt.setHours(closeH, closeM, 0, 0);
        if (new Date() < closeAt) {
          days.push(new Date(cursor));
        }
      } else {
        days.push(new Date(cursor));
      }
    }
    cursor.setDate(cursor.getDate() + 1);
    scanned += 1;
  }

  return days;
}

/**
 * Returns the time slots for a given date.
 *
 * MOCK IMPLEMENTATION:
 *   - Generates slots between open & close at SLOT_INTERVAL_MIN.
 *   - Deterministically marks ~30% as unavailable using a hash of (date + barber).
 *     This simulates "already booked" slots without requiring a database.
 *
 * To replace with real data, query the `appointments` table for the given
 * date + barber, mark any overlapping slot as `available: false`.
 */
export function getTimeSlots(date: Date, barber: Barber | null): TimeSlot[] {
  const weekday = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const hours = SITE_CONFIG.hours.find((h) => h.weekday === weekday);
  if (!hours) return [];

  const slots: TimeSlot[] = [];
  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);

  const cursor = new Date(date);
  cursor.setHours(openH, openM, 0, 0);
  const closeAt = new Date(date);
  closeAt.setHours(closeH, closeM, 0, 0);

  // Stop generating slots SLOT_INTERVAL_MIN before close so the service
  // always finishes inside business hours.
  const lastStart = new Date(closeAt.getTime() - SLOT_INTERVAL_MIN * 60_000);

  while (cursor <= lastStart) {
    const time = formatTime(cursor);
    // Skip past times today
    const isPast = isSameDay(cursor, new Date()) && cursor < new Date();
    const booked = isMockBooked(date, time, barber?.id ?? "any");
    slots.push({
      time,
      available: !isPast && !booked,
    });
    cursor.setMinutes(cursor.getMinutes() + SLOT_INTERVAL_MIN);
  }

  return slots;
}

/* ---------- helpers ---------- */

function formatTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Deterministic pseudo-random based on a string seed.
 * Produces ~30% "booked" slots. Stable across renders so the UI is consistent.
 */
function isMockBooked(date: Date, time: string, barberId: string): boolean {
  const seed = `${date.toISOString().slice(0, 10)}|${time}|${barberId}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  // Map to 0..99, mark ~30% as booked
  return Math.abs(hash) % 100 < 30;
}

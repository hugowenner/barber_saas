import { zonedToUtc, weekdayInTZ, formatTimeInTZ } from "@/lib/tz";
import type { Barber, TimeSlot } from "@/types";

export type HourConfig = { weekday: number; open: string; close: string };
export type BookedInterval = { startAt: string; endAt: string };

export const SLOT_INTERVAL_MIN = 30;

export function getOpenDays(
  count = 6,
  from: Date = new Date(),
  businessHours: HourConfig[] = [],
): Date[] {
  const days: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  let scanned = 0;
  while (days.length < count && scanned < 14) {
    const weekday = cursor.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const open = businessHours.find((h) => h.weekday === weekday);
    if (open) {
      if (scanned === 0) {
        const [closeH, closeM] = open.close.split(":").map(Number);
        const closeAt = new Date(cursor);
        closeAt.setHours(closeH, closeM, 0, 0);
        if (new Date() < closeAt) days.push(new Date(cursor));
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
 * Generate time slots for a calendar date in the shop's timezone.
 *
 * Deterministic regardless of process.env.TZ: all timestamps are computed via
 * `zonedToUtc` (Intl-based), so results are identical on a UTC server, a BRT
 * browser, and in CI.
 *
 * @param dateStr         YYYY-MM-DD calendar date in the shop timezone.
 * @param barber          Currently selected barber (unused after isMockBooked removal; kept for API stability).
 * @param businessHours   Shop or barber business hours.
 * @param bookedIntervals UTC ISO intervals from the DB (via getBookedSlots Server Action).
 * @param serviceDurationMin  Duration of the selected service; used for overlap check.
 * @param timezone        IANA timezone of the shop (e.g. "America/Sao_Paulo").
 */
export function getTimeSlots(
  dateStr: string,
  barber: Barber | null,
  businessHours: HourConfig[] = [],
  bookedIntervals: BookedInterval[] = [],
  serviceDurationMin: number = SLOT_INTERVAL_MIN,
  timezone: string = "America/Sao_Paulo",
): TimeSlot[] {
  // weekday derived in shop timezone — never from process.env.TZ
  const weekday = weekdayInTZ(dateStr, timezone) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const hours = businessHours.find((h) => h.weekday === weekday);
  if (!hours) return [];

  // Slot start/end times anchored to UTC via shop timezone open/close
  const openUtc = zonedToUtc(`${dateStr}T${hours.open}:00`, timezone);
  const closeUtc = zonedToUtc(`${dateStr}T${hours.close}:00`, timezone);
  const lastStart = closeUtc.getTime() - SLOT_INTERVAL_MIN * 60_000;

  const parsed = bookedIntervals.map((i) => ({
    start: new Date(i.startAt).getTime(),
    end: new Date(i.endAt).getTime(),
  }));

  const now = Date.now();
  const slots: TimeSlot[] = [];
  let cursorMs = openUtc.getTime();

  while (cursorMs <= lastStart) {
    const slotEnd = cursorMs + serviceDurationMin * 60_000;
    // Display time formatted in shop timezone — deterministic regardless of server TZ
    const time = formatTimeInTZ(new Date(cursorMs).toISOString(), timezone);
    // Overlap: slot [cursorMs, slotEnd) ∩ interval [start, end)
    const booked = parsed.some((i) => cursorMs < i.end && slotEnd > i.start);
    slots.push({ time, available: cursorMs >= now && !booked });
    cursorMs += SLOT_INTERVAL_MIN * 60_000;
  }

  return slots;
}

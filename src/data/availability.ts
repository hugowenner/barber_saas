import type { Barber, TimeSlot } from "@/types";

export type HourConfig = { weekday: number; open: string; close: string };

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

export function getTimeSlots(
  date: Date,
  barber: Barber | null,
  businessHours: HourConfig[] = [],
): TimeSlot[] {
  const weekday = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const hours = businessHours.find((h) => h.weekday === weekday);
  if (!hours) return [];

  const slots: TimeSlot[] = [];
  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);

  const cursor = new Date(date);
  cursor.setHours(openH, openM, 0, 0);
  const closeAt = new Date(date);
  closeAt.setHours(closeH, closeM, 0, 0);
  const lastStart = new Date(closeAt.getTime() - SLOT_INTERVAL_MIN * 60_000);

  while (cursor <= lastStart) {
    const time = formatTime(cursor);
    const isPast = isSameDay(cursor, new Date()) && cursor < new Date();
    const booked = isMockBooked(date, time, barber?.id ?? "any");
    slots.push({ time, available: !isPast && !booked });
    cursor.setMinutes(cursor.getMinutes() + SLOT_INTERVAL_MIN);
  }

  return slots;
}

function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isMockBooked(date: Date, time: string, barberId: string): boolean {
  const seed = `${date.toISOString().slice(0, 10)}|${time}|${barberId}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(hash) % 100 < 30;
}

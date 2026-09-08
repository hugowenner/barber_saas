/**
 * Timezone utilities — use these instead of `new Date(...)` whenever the
 * result depends on civil time in the barbershop's local timezone.
 *
 * Built on `Intl.DateTimeFormat` only — zero extra dependencies, works in
 * Node (server) and browser (client components) without bundling issues.
 */

// ── Core conversion ───────────────────────────────────────────────────────────

/**
 * Convert a civil datetime string ("YYYY-MM-DDThh:mm:ss") in `tz` to a UTC Date.
 *
 * Algorithm: parse the string naively as UTC, measure the tz offset at that
 * point via Intl, then shift by the offset. DST-safe for times outside the
 * 1-hour ambiguous window around clock changes (which are at midnight in BRT).
 */
export function zonedToUtc(localIso: string, tz: string): Date {
  const naive = new Date(localIso + "Z");

  // What does this UTC moment look like in the target timezone?
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(naive);

  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const tzAsUtcMs = Date.parse(
    `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`,
  );

  // Shift naive UTC by the computed offset to get the true UTC timestamp
  return new Date(naive.getTime() + (naive.getTime() - tzAsUtcMs));
}

/** Half-open UTC interval [gte, lt) spanning the civil day `dateStr` in `tz`. */
export function utcDayRange(dateStr: string, tz: string): { gte: Date; lt: Date } {
  const gte = zonedToUtc(`${dateStr}T00:00:00`, tz);
  // Compute next calendar date via UTC arithmetic (handles month/year rollover)
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  const nextStr = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
  const lt = zonedToUtc(`${nextStr}T00:00:00`, tz);
  return { gte, lt };
}

// ── Intl-based display helpers (safe for client bundles) ─────────────────────

/** Today's date string (YYYY-MM-DD) in `tz`. Works in Node and browser. */
export function todayInTZ(tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
}

/** Current hour (0-23) in `tz`. */
export function hourInTZ(tz: string): number {
  return parseInt(
    new Intl.DateTimeFormat("en", {
      hour: "numeric",
      hour12: false,
      timeZone: tz,
    }).format(new Date()),
    10,
  );
}

/** Format a UTC ISO string as "HH:MM" in the barbershop timezone. */
export function formatTimeInTZ(isoUtc: string, tz: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
    hour12: false,
  }).format(new Date(isoUtc));
}

/** Minutes-from-midnight for a UTC ISO string in `tz`. */
export function minutesInTZ(isoUtc: string, tz: string): number {
  const parts = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: tz,
  }).formatToParts(new Date(isoUtc));
  const h = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
  const m = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
  return h * 60 + m;
}

/** Weekday (0=Sun…6=Sat) for a civil date string in `tz`. */
export function weekdayInTZ(dateStr: string, tz: string): number {
  // noon UTC stays on the same calendar date as dateStr for São Paulo (UTC-3)
  const noon = new Date(`${dateStr}T12:00:00Z`);
  const name = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: tz,
  }).format(noon);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/** Civil date string (YYYY-MM-DD) for a UTC ISO timestamp in `tz`. */
export function localDateStr(isoUtc: string, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(
    new Date(isoUtc),
  );
}

/**
 * Timezone correctness tests — 10 scenarios.
 * Run with process UTC to simulate cloud server:
 *   $env:TZ="UTC"; npx tsx scripts/test-timezone.ts
 * Or local:
 *   npx tsx scripts/test-timezone.ts
 */

import { zonedToUtc, utcDayRange, todayInTZ, formatTimeInTZ, minutesInTZ, weekdayInTZ, localDateStr } from "../src/lib/tz";

const TZ = "America/Sao_Paulo"; // UTC-3 (UTC-2 during DST)

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function approxEqual(a: number, b: number, tolerance = 60_000): boolean {
  return Math.abs(a - b) <= tolerance;
}

console.log("=".repeat(60));
console.log(`Timezone Tests — process.env.TZ = "${process.env.TZ ?? "system"}"`);
console.log(`Running as UTC: ${new Date().toString().includes("UTC") || process.env.TZ === "UTC"}`);
console.log("=".repeat(60));

// ── Teste 1: Civil time → UTC (09:00 BRT = 12:00 UTC) ───────────────────────
console.log("\nTeste 1 — zonedToUtc: 09:00 BRT → 12:00 UTC");
{
  const result = zonedToUtc("2026-09-08T09:00:00", TZ);
  const utcH = result.getUTCHours();
  const utcM = result.getUTCMinutes();
  assert(utcH === 12 && utcM === 0, `09:00 BRT → 12:00 UTC`, `got ${utcH}:${String(utcM).padStart(2,"0")} UTC`);
}

// ── Teste 2: Civil time → UTC (18:00 BRT = 21:00 UTC) ───────────────────────
console.log("\nTeste 2 — zonedToUtc: 18:00 BRT → 21:00 UTC");
{
  const result = zonedToUtc("2026-09-08T18:00:00", TZ);
  assert(result.getUTCHours() === 21, `18:00 BRT → 21:00 UTC`, `got ${result.getUTCHours()} UTC`);
}

// ── Teste 3: Late night → next UTC day (22:00 BRT = 01:00 UTC next day) ─────
console.log("\nTeste 3 — zonedToUtc: 22:00 BRT → 01:00 UTC next day");
{
  const result = zonedToUtc("2026-09-08T22:00:00", TZ);
  assert(result.getUTCHours() === 1, `22:00 BRT → 01:00 UTC`, `got ${result.getUTCHours()} UTC`);
  assert(result.getUTCDate() === 9, `UTC date is 9 (next day)`, `got ${result.getUTCDate()}`);
}

// ── Teste 4: utcDayRange — day boundaries are TZ-aware ──────────────────────
console.log("\nTeste 4 — utcDayRange: 2026-09-08 in BRT");
{
  const { gte, lt } = utcDayRange("2026-09-08", TZ);
  // BRT midnight = UTC 03:00 (UTC-3 → 00:00 + 3 = 03:00 UTC)
  assert(gte.getUTCHours() === 3 && gte.getUTCMinutes() === 0, `Day start: 00:00 BRT = 03:00 UTC`, `gte=${gte.toISOString()}`);
  // Next day midnight BRT = UTC 03:00 next day
  assert(lt.getUTCHours() === 3 && lt.getUTCDate() === 9, `Day end: 00:00 BRT next day = 03:00 UTC next day`, `lt=${lt.toISOString()}`);
  // A 22:00 BRT appointment (01:00 UTC next day) MUST be inside [gte, lt)
  const appt22brt = zonedToUtc("2026-09-08T22:00:00", TZ);
  assert(appt22brt >= gte && appt22brt < lt, `22:00 BRT falls within day range`, `appt=${appt22brt.toISOString()}`);
}

// ── Teste 5: formatTimeInTZ — display in barbershop TZ ──────────────────────
console.log("\nTeste 5 — formatTimeInTZ: 12:00 UTC → 09:00 BRT display");
{
  const isoUtc = "2026-09-08T12:00:00.000Z";
  const display = formatTimeInTZ(isoUtc, TZ);
  assert(display === "09:00", `Display: "${display}" === "09:00"`, display);
}

// ── Teste 6: minutesInTZ — minutes from midnight in BRT ─────────────────────
console.log("\nTeste 6 — minutesInTZ: 12:00 UTC → 540 min (09:00 BRT)");
{
  const isoUtc = "2026-09-08T12:00:00.000Z";
  const min = minutesInTZ(isoUtc, TZ);
  assert(min === 540, `minutesInTZ = ${min} (expected 540 = 09:00)`, `got ${min}`);
}

// ── Teste 7: weekdayInTZ — correct day of week ───────────────────────────────
console.log("\nTeste 7 — weekdayInTZ: 2026-09-08 is Tuesday (2)");
{
  const wd = weekdayInTZ("2026-09-08", TZ);
  assert(wd === 2, `weekdayInTZ("2026-09-08", TZ) = ${wd} (expected 2 = Tuesday)`, `got ${wd}`);
}

// ── Teste 8: localDateStr — UTC timestamp → civil date in BRT ────────────────
console.log("\nTeste 8 — localDateStr: appointment at 22:00 BRT shows correct local date");
{
  // 22:00 BRT on Sep 8 = 01:00 UTC on Sep 9
  const isoUtc = "2026-09-09T01:00:00.000Z";
  const dateStr = localDateStr(isoUtc, TZ);
  assert(dateStr === "2026-09-08", `localDateStr = "${dateStr}" (expected 2026-09-08)`, dateStr);
}

// ── Teste 9: todayInTZ — consistent with Intl ────────────────────────────────
console.log("\nTeste 9 — todayInTZ: returns YYYY-MM-DD format");
{
  const today = todayInTZ(TZ);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(today), `todayInTZ format valid: "${today}"`);
  // Also verify it matches Intl reference
  const ref = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
  assert(today === ref, `todayInTZ matches Intl reference`, `today=${today} ref=${ref}`);
}

// ── Teste 10: Different timezone (Manaus = UTC-4, no DST) ────────────────────
console.log("\nTeste 10 — Manaus (America/Manaus, UTC-4): 09:00 local → 13:00 UTC");
{
  const manausTZ = "America/Manaus";
  const result = zonedToUtc("2026-09-08T09:00:00", manausTZ);
  assert(result.getUTCHours() === 13, `09:00 Manaus → 13:00 UTC`, `got ${result.getUTCHours()} UTC`);
  const display = formatTimeInTZ(result.toISOString(), manausTZ);
  assert(display === "09:00", `Round-trip display = "${display}"`, display);
}

// ── Resultado ─────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(60));
console.log(`RESULTADO: ${passed} passou(aram) / ${failed} falhou(aram)`);
if (failed > 0) {
  console.error("REQUER CORREÇÃO — veja os erros acima.");
  process.exit(1);
} else {
  console.log("APROVADO — todos os cenários passaram.");
}
console.log("=".repeat(60));

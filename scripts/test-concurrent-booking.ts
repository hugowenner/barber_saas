/**
 * Concurrent booking test — race condition protection.
 *
 * Dispatches N simultaneous createPublicBooking calls for the same
 * barbershop / barber / time slot and asserts exactly 1 succeeds.
 *
 * Run: npx tsx scripts/test-concurrent-booking.ts
 */

import { PrismaClient } from "@prisma/client";
import { getBarbershop } from "../src/lib/data/barbershop";
import { createPublicBooking } from "../src/lib/actions/booking";

const db = new PrismaClient({ log: [] });

// ── helpers ───────────────────────────────────────────────────────────────────

async function seed() {
  const shop = await getBarbershop();
  if (!shop) throw new Error("No active barbershop found — run npm run db:seed first");

  // Pick the first active barber and service in this shop
  const barber = await db.barber.findFirst({ where: { barbershopId: shop.id, isActive: true } });
  const service = await db.service.findFirst({ where: { barbershopId: shop.id, isActive: true } });
  if (!barber || !service) throw new Error("No barber/service found for shop " + shop.id);

  // Ensure the test slot is on a business day (Monday)
  const businessHour = await db.businessHour.findFirst({
    where: { barbershopId: shop.id, barberId: null },
    orderBy: { weekday: "asc" },
  });
  if (!businessHour) throw new Error("No business hours configured");

  // Use a future date on the configured weekday
  const testDate = nextWeekday(businessHour.weekday);
  const openHH = String(Math.floor(businessHour.openMin / 60)).padStart(2, "0");
  const openMM = String(businessHour.openMin % 60).padStart(2, "0");
  const testTime = `${openHH}:${openMM}`;

  return { shop, barber, service, testDate, testTime };
}

function nextWeekday(weekday: number): string {
  const d = new Date();
  // Move far enough in the future to avoid conflicts with seeded data
  d.setDate(d.getDate() + 60);
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function cleanup(barberId: string, date: string, time: string) {
  const start = new Date(`${date}T${time}:00`);
  await db.appointment.deleteMany({
    where: { barberId, startAt: start },
  });
}

// ── test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${label}`);
    failed++;
  }
}

// ── Scenario 1: N exact-duplicate concurrent requests ─────────────────────────

async function testExactDuplicates(
  barber: { id: string },
  service: { id: string },
  date: string,
  time: string,
  n: number,
) {
  console.log(`\nScenário 1: ${n} requests simultâneos — ${date}T${time} (mesmo barbeiro)`);

  await cleanup(barber.id, date, time);

  const payload = {
    serviceId: service.id,
    barberId: barber.id,
    anyBarber: false,
    date,
    time,
    customerName: "Test User",
    customerPhone: "11940001234",
  };

  const results = await Promise.all(Array.from({ length: n }, () => createPublicBooking(payload)));

  const ok = results.filter((r) => r.ok);
  const err = results.filter((r) => !r.ok);

  console.log(`  ok=${ok.length}  rejected=${err.length}`);
  assert(ok.length === 1, `Exatamente 1 agendamento criado (esperado: 1, obtido: ${ok.length})`);
  assert(err.length === n - 1, `${n - 1} requisições rejeitadas`);

  await cleanup(barber.id, date, time);
}

// ── Scenario 2: Overlapping intervals ─────────────────────────────────────────

async function testOverlappingIntervals(
  barber: { id: string },
  service: { id: string },
  date: string,
  openTime: string,
) {
  console.log(`\nScenário 2: intervalos sobrepostos — ${date}`);

  await cleanup(barber.id, date, openTime);

  // Request A: openTime (e.g. 10:00)
  // Request B: openTime + 15min (e.g. 10:15) — overlaps if service.durationMin > 15
  const [hh, mm] = openTime.split(":").map(Number);
  const totalMin = hh * 60 + mm + 15;
  const time2 = `${String(Math.floor(totalMin / 60)).padStart(2, "0")}:${String(totalMin % 60).padStart(2, "0")}`;

  await cleanup(barber.id, date, time2);

  const basePayload = {
    serviceId: service.id,
    barberId: barber.id,
    anyBarber: false,
    date,
    customerName: "Test User",
    customerPhone: "11940001235",
  };

  const [resultA, resultB] = await Promise.all([
    createPublicBooking({ ...basePayload, time: openTime }),
    createPublicBooking({ ...basePayload, time: time2 }),
  ]);

  console.log(`  A(${openTime}): ok=${resultA.ok}  B(${time2}): ok=${resultB.ok}`);

  // At most one should succeed when the service duration causes overlap.
  // (If durationMin ≤ 15, both are non-overlapping and both succeed — that's correct.)
  const svc = await db.service.findFirst({ where: { id: service.id } });
  const durationMin = svc?.durationMin ?? 0;

  if (durationMin > 15) {
    const bothSucceeded = resultA.ok && resultB.ok;
    assert(!bothSucceeded, `Intervalos sobrepostos (durationMin=${durationMin}) — no máximo 1 deve ter sucesso`);
  } else {
    assert(resultA.ok || resultB.ok, `Intervalos não-sobrepostos (durationMin=${durationMin}) — pelo menos 1 deve ter sucesso`);
    console.log(`  (Serviço de ${durationMin}min — intervalos de 15min são não-sobrepostos; ambos podem ser aceitos)`);
  }

  await cleanup(barber.id, date, openTime);
  await cleanup(barber.id, date, time2);
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("Teste de concorrência — double-booking protection");
  console.log("=".repeat(60));

  const { barber, service, testDate, testTime } = await seed();

  console.log(`\nBarbearia: ${(await getBarbershop())?.name}`);
  console.log(`Barbeiro:  ${barber.id}`);
  console.log(`Serviço:   ${service.id}`);
  console.log(`Data:      ${testDate}  Hora: ${testTime}`);

  await testExactDuplicates(barber, service, testDate, testTime, 5);
  await testOverlappingIntervals(barber, service, testDate, testTime);

  console.log("\n" + "=".repeat(60));
  console.log(`RESULTADO: ${passed} passou(aram) / ${failed} falhou(aram)`);
  console.log("=".repeat(60));

  await db.$disconnect();
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  db.$disconnect();
  process.exit(1);
});

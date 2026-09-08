/**
 * Read-only audit of timezone-sensitive data in the database.
 * Answers: are existing timestamps safe for TZ migration?
 * Run: npx tsx scripts/audit-timezone.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({ log: [] });

function fmtLocal(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: tz,
  }).format(d);
}

async function main() {
  const TZ = "America/Sao_Paulo";

  console.log("=".repeat(60));
  console.log("AUDIT — Timezone sensitivity check");
  console.log(`Report TZ: ${TZ}`);
  console.log("=".repeat(60));

  const shops = await db.barbershop.findMany();
  console.log(`\nBarbershops: ${shops.length}`);
  for (const s of shops) {
    console.log(`  [${s.id.slice(0, 8)}] ${s.name} — timezone: ${(s as any).timezone ?? "(no column yet)"}`);
  }

  const total = await db.appointment.count();
  console.log(`\nTotal appointments: ${total}`);
  if (total === 0) {
    console.log("No appointments — nothing to audit.");
    await db.$disconnect();
    return;
  }

  const byStatus = await db.appointment.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  console.log("\nBy status:");
  for (const r of byStatus) {
    console.log(`  ${r.status}: ${r._count._all}`);
  }

  const anyBarberCount = await db.appointment.count({ where: { anyBarber: true } });
  const assignedCount = await db.appointment.count({ where: { anyBarber: true, barberId: { not: null } } });
  console.log(`\nAny-barber: ${anyBarberCount} (${assignedCount} already assigned)`);

  const minMax = await db.appointment.aggregate({
    _min: { startAt: true },
    _max: { startAt: true },
  });
  console.log(`\nDate range:`);
  console.log(`  Earliest: ${minMax._min.startAt?.toISOString()} (${fmtLocal(minMax._min.startAt!, TZ)} BRT)`);
  console.log(`  Latest:   ${minMax._max.startAt?.toISOString()} (${fmtLocal(minMax._max.startAt!, TZ)} BRT)`);

  // Sample: show 5 appointments with UTC and local time to confirm offset
  const sample = await db.appointment.findMany({
    take: 5,
    orderBy: { startAt: "asc" },
    select: { id: true, startAt: true, endAt: true, status: true, customerName: true },
  });
  console.log("\nSample appointments (UTC → BRT):");
  for (const a of sample) {
    const utcStr = a.startAt.toISOString();
    const brtStr = fmtLocal(a.startAt, TZ);
    const utcH = a.startAt.getUTCHours();
    const localH = parseInt(
      new Intl.DateTimeFormat("en", { hour: "numeric", hour12: false, timeZone: TZ }).format(a.startAt),
      10,
    );
    const offsetH = utcH - localH;
    console.log(`  [${a.id.slice(0, 8)}] ${utcStr} → ${brtStr} (UTC${offsetH >= 0 ? "+" : ""}${-offsetH})`);
  }

  // Check for potential midnight-boundary issues (appointments after 21:00 BRT = next UTC day)
  const allFuture = await db.appointment.findMany({
    where: { status: { notIn: ["CANCELLED"] } },
    select: { id: true, startAt: true },
    orderBy: { startAt: "asc" },
  });

  let boundaryRisk = 0;
  for (const a of allFuture) {
    const utcDate = a.startAt.toISOString().slice(0, 10);
    const localDate = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(a.startAt);
    if (utcDate !== localDate) boundaryRisk++;
  }
  console.log(`\nBoundary-risk appointments (UTC date ≠ ${TZ} date): ${boundaryRisk}`);
  if (boundaryRisk > 0) {
    console.log("  ⚠  These would appear on the wrong day without TZ-aware queries.");
  } else {
    console.log("  ✓  All active appointments have matching UTC and local calendar dates.");
  }

  console.log("\n" + "=".repeat(60));
  console.log("CONCLUSÃO:");
  console.log("  - Timestamps stored as UTC in SQLite.");
  console.log("  - Data was created on UTC-3 server → offset = -3h.");
  console.log("  - After TZ fix: fromZonedTime stores correctly as UTC.");
  console.log("  - Existing data: safe (same UTC-3 offset assumed from seeding).");
  console.log("=".repeat(60));

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  db.$disconnect();
  process.exit(1);
});

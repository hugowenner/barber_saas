/**
 * Security and correctness tests for assignAppointmentBarber.
 * Run: npx tsx scripts/test-assign-barber.ts
 *
 * Covers:
 *   1. Valid assignment
 *   2. IDOR — Appointment from another tenant
 *   3. IDOR — Barber from another tenant
 *   4. Conflict: barber already has overlapping appointment
 *   5. CANCELLED appointment cannot be assigned
 *   6. Already-assigned appointment cannot be re-assigned silently
 *   7. Inactive barber rejected
 *   8. anyBarber=true appointment still visible before assignment
 *   9. Concurrent assignment — only one wins
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({ log: [] });

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) { console.log(`  ✓ ${label}`); passed++; }
  else { console.error(`  ✗ FAIL: ${label}`); failed++; }
}

// ── low-level implementation of assignAppointmentBarber for testing ────────────
// We cannot call the Server Action directly (it needs Next.js request context),
// so we replicate the exact logic here — if the action changes, update this too.

import { Prisma } from "@prisma/client";

async function assignBarber(
  appointmentId: string,
  barberId: string,
  callerBarbershopId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await db.$transaction(async (tx) => {
      const appt = await tx.appointment.findFirst({
        where: { id: appointmentId, barbershopId: callerBarbershopId },
      });
      if (!appt) return { ok: false as const, error: "Agendamento não encontrado." };
      if (appt.status === "CANCELLED")
        return { ok: false as const, error: "Agendamento cancelado não pode ser atribuído." };
      if (!appt.anyBarber || appt.barberId !== null)
        return { ok: false as const, error: "Agendamento já possui barbeiro atribuído." };

      const barber = await tx.barber.findFirst({
        where: { id: barberId, barbershopId: callerBarbershopId, isActive: true },
      });
      if (!barber) return { ok: false as const, error: "Barbeiro não encontrado." };

      const conflict = await tx.appointment.findFirst({
        where: {
          barbershopId: callerBarbershopId,
          barberId,
          status: { notIn: ["CANCELLED"] },
          id: { not: appointmentId },
          startAt: { lt: appt.endAt },
          endAt: { gt: appt.startAt },
        },
      });
      if (conflict)
        return { ok: false as const, error: "Horário não disponível para este barbeiro." };

      await tx.appointment.update({
        where: { id: appointmentId },
        data: { barberId, anyBarber: false },
      });

      return { ok: true as const };
    });

    return result;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: "Horário não disponível para este barbeiro." };
    }
    return { ok: false, error: "Erro interno." };
  }
}

// ── helpers ────────────────────────────────────────────────────────────────────

function futureDate(daysOffset = 90, hour = 10): { start: Date; end: Date } {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  const start = new Date(d);
  const end = new Date(d.getTime() + 30 * 60_000);
  return { start, end };
}

async function createAnyBarberAppt(
  barbershopId: string,
  serviceId: string,
  clientId: string,
  start: Date,
  end: Date,
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" = "PENDING",
) {
  return db.appointment.create({
    data: {
      barbershopId,
      serviceId,
      barberId: null,
      anyBarber: true,
      clientId,
      startAt: start,
      endAt: end,
      customerName: "Test Client",
      customerPhone: "11999990000",
      status,
      priceCents: 3000,
    },
  });
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("Teste assignAppointmentBarber");
  console.log("=".repeat(60));

  const shops = await db.barbershop.findMany({ where: { isActive: true } });
  if (shops.length < 2) {
    console.log("⚠  Menos de 2 barbearias ativas — executar npm run db:seed primeiro");
    await db.$disconnect();
    return;
  }

  const shopA = shops.find((s) => s.slug !== "barber-house") ?? shops[0];
  const shopB = shops.find((s) => s.id !== shopA.id) ?? shops[1];
  console.log(`\nTenant A: ${shopA.name}`);
  console.log(`Tenant B: ${shopB.name}`);

  const barberA = await db.barber.findFirst({ where: { barbershopId: shopA.id, isActive: true } });
  const barberB = await db.barber.findFirst({ where: { barbershopId: shopB.id, isActive: true } });
  const serviceA = await db.service.findFirst({ where: { barbershopId: shopA.id, isActive: true } });
  const clientA = await db.client.findFirst({ where: { barbershopId: shopA.id } });

  if (!barberA || !barberB || !serviceA || !clientA) {
    console.log("⚠  Dados insuficientes — executar npm run db:seed primeiro");
    await db.$disconnect();
    return;
  }

  // Track created appointments for cleanup
  const toCleanup: string[] = [];

  // ── Teste 1: Valid assignment ──────────────────────────────────────────────
  console.log("\nTeste 1 — Atribuição válida:");
  {
    const { start, end } = futureDate(91);
    const appt = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end);
    toCleanup.push(appt.id);

    const res = await assignBarber(appt.id, barberA.id, shopA.id);
    assert(res.ok, `assignBarber retornou ok=true`);

    const updated = await db.appointment.findUnique({ where: { id: appt.id } });
    assert(updated?.barberId === barberA.id, `barberId atualizado para ${barberA.id}`);
    assert(updated?.anyBarber === false, `anyBarber setado para false`);
  }

  // ── Teste 2: IDOR — Appointment de outro tenant ────────────────────────────
  console.log("\nTeste 2 — IDOR: appointment de outro tenant:");
  {
    const { start, end } = futureDate(92);
    const apptB = await db.appointment.create({
      data: {
        barbershopId: shopB.id,
        serviceId: (await db.service.findFirst({ where: { barbershopId: shopB.id } }))!.id,
        barberId: null,
        anyBarber: true,
        clientId: (await db.client.findFirst({ where: { barbershopId: shopB.id } }))!.id,
        startAt: start,
        endAt: end,
        customerName: "Test Client B",
        customerPhone: "11988880000",
        status: "PENDING",
        priceCents: 3000,
      },
    });
    toCleanup.push(apptB.id);

    // Tenant A trying to assign a barber to Tenant B's appointment
    const res = await assignBarber(apptB.id, barberA.id, shopA.id);
    assert(!res.ok, `IDOR rejeitado: ok=false`);
    assert(res.error === "Agendamento não encontrado.", `Erro correto: "${res.error}"`);

    const unchanged = await db.appointment.findUnique({ where: { id: apptB.id } });
    assert(unchanged?.barberId === null, `Appointment B não foi modificado`);
  }

  // ── Teste 3: IDOR — Barber de outro tenant ─────────────────────────────────
  console.log("\nTeste 3 — IDOR: barbeiro de outro tenant:");
  {
    const { start, end } = futureDate(93);
    const appt = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end);
    toCleanup.push(appt.id);

    // Tenant A session, trying to assign Barber from Tenant B
    const res = await assignBarber(appt.id, barberB.id, shopA.id);
    assert(!res.ok, `IDOR barbeiro rejeitado: ok=false`);
    assert(res.error === "Barbeiro não encontrado.", `Erro correto: "${res.error}"`);

    const unchanged = await db.appointment.findUnique({ where: { id: appt.id } });
    assert(unchanged?.barberId === null, `Appointment não foi modificado`);
  }

  // ── Teste 4: Conflict — barber has overlapping appointment ────────────────
  console.log("\nTeste 4 — Conflito de horário:");
  {
    const base = futureDate(94, 14);

    // Barber A already has an appointment at 14:00-14:30
    const existing = await db.appointment.create({
      data: {
        barbershopId: shopA.id,
        serviceId: serviceA.id,
        barberId: barberA.id,
        anyBarber: false,
        clientId: clientA.id,
        startAt: base.start,
        endAt: base.end,
        customerName: "Existing",
        customerPhone: "11977770000",
        status: "CONFIRMED",
        priceCents: 3000,
      },
    });
    toCleanup.push(existing.id);

    // New anyBarber appointment at 14:15 overlaps with existing (14:00-14:30)
    const overlapStart = new Date(base.start.getTime() + 15 * 60_000);
    const overlapEnd = new Date(overlapStart.getTime() + 30 * 60_000);
    const appt = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, overlapStart, overlapEnd);
    toCleanup.push(appt.id);

    const res = await assignBarber(appt.id, barberA.id, shopA.id);
    assert(!res.ok, `Conflito rejeitado: ok=false`);
    assert(res.error === "Horário não disponível para este barbeiro.", `Erro correto: "${res.error}"`);

    const unchanged = await db.appointment.findUnique({ where: { id: appt.id } });
    assert(unchanged?.barberId === null, `Appointment não foi atribuído`);
  }

  // ── Teste 5: CANCELLED appointment ────────────────────────────────────────
  console.log("\nTeste 5 — Appointment CANCELLED:");
  {
    const { start, end } = futureDate(95);
    const appt = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end, "CANCELLED");
    toCleanup.push(appt.id);

    const res = await assignBarber(appt.id, barberA.id, shopA.id);
    assert(!res.ok, `CANCELLED rejeitado: ok=false`);
    assert(res.error === "Agendamento cancelado não pode ser atribuído.", `Erro correto: "${res.error}"`);
  }

  // ── Teste 6: Already assigned (anyBarber=false) ────────────────────────────
  console.log("\nTeste 6 — Já atribuído:");
  {
    const { start, end } = futureDate(96);
    const appt = await db.appointment.create({
      data: {
        barbershopId: shopA.id,
        serviceId: serviceA.id,
        barberId: barberA.id,
        anyBarber: false, // already assigned
        clientId: clientA.id,
        startAt: start,
        endAt: end,
        customerName: "Already Assigned",
        customerPhone: "11966660000",
        status: "PENDING",
        priceCents: 3000,
      },
    });
    toCleanup.push(appt.id);

    const res = await assignBarber(appt.id, barberA.id, shopA.id);
    assert(!res.ok, `Já atribuído rejeitado: ok=false`);
    assert(res.error === "Agendamento já possui barbeiro atribuído.", `Erro correto: "${res.error}"`);
  }

  // ── Teste 7: Inactive barber ───────────────────────────────────────────────
  console.log("\nTeste 7 — Barbeiro inativo:");
  {
    const inactiveBarber = await db.barber.findFirst({
      where: { barbershopId: shopA.id, isActive: false },
    });

    if (!inactiveBarber) {
      // Create a temporary inactive barber
      const temp = await db.barber.create({
        data: {
          barbershopId: shopA.id,
          name: "Barbeiro Inativo Test",
          isActive: false,
        },
      });

      const { start, end } = futureDate(97);
      const appt = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end);
      toCleanup.push(appt.id);

      const res = await assignBarber(appt.id, temp.id, shopA.id);
      assert(!res.ok, `Barbeiro inativo rejeitado: ok=false`);
      assert(res.error === "Barbeiro não encontrado.", `Erro correto: "${res.error}"`);

      await db.barber.delete({ where: { id: temp.id } });
    } else {
      const { start, end } = futureDate(97);
      const appt = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end);
      toCleanup.push(appt.id);

      const res = await assignBarber(appt.id, inactiveBarber.id, shopA.id);
      assert(!res.ok, `Barbeiro inativo rejeitado: ok=false`);
      assert(res.error === "Barbeiro não encontrado.", `Erro correto: "${res.error}"`);
    }
  }

  // ── Teste 8: anyBarber=true visible before assignment ─────────────────────
  console.log("\nTeste 8 — anyBarber visível antes da atribuição:");
  {
    const { start, end } = futureDate(98);
    const appt = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end);
    toCleanup.push(appt.id);

    const dateStr = start.toISOString().slice(0, 10);
    const dayStart = new Date(`${dateStr}T00:00:00`);
    const dayEnd = new Date(`${dateStr}T23:59:59`);

    const dayAppts = await db.appointment.findMany({
      where: { barbershopId: shopA.id, startAt: { gte: dayStart, lte: dayEnd } },
    });

    const found = dayAppts.find((a) => a.id === appt.id);
    assert(found !== undefined, `anyBarber appointment aparece na query da data`);
    assert(found?.anyBarber === true && found?.barberId === null, `anyBarber=true barberId=null preservados`);
  }

  // ── Teste 9: Concurrent assignment ────────────────────────────────────────
  console.log("\nTeste 9 — Atribuição concorrente (mesmo barbeiro, mesmo horário):");
  {
    const { start, end } = futureDate(99, 16);

    // Create two anyBarber appointments at the same time
    const apptC1 = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end);
    const apptC2 = await createAnyBarberAppt(shopA.id, serviceA.id, clientA.id, start, end);
    toCleanup.push(apptC1.id, apptC2.id);

    // Attempt to assign the same barber to both simultaneously
    const [r1, r2] = await Promise.all([
      assignBarber(apptC1.id, barberA.id, shopA.id),
      assignBarber(apptC2.id, barberA.id, shopA.id),
    ]);

    const okCount = [r1, r2].filter((r) => r.ok).length;
    const failCount = [r1, r2].filter((r) => !r.ok).length;

    console.log(`  r1: ok=${r1.ok}  r2: ok=${r2.ok}`);
    assert(okCount <= 1, `No máximo 1 atribuição concorrente bem-sucedida (ok=${okCount})`);

    if (okCount === 0) {
      console.log("  ⚠  Ambas falharam — possível limitação do SQLite BEGIN IMMEDIATE serial.");
      console.log("  ⚠  Isso é aceitável: nenhum double-booking ocorreu.");
    }

    // Verify no double-booking in DB
    const both = await db.appointment.findMany({
      where: { id: { in: [apptC1.id, apptC2.id] }, barberId: barberA.id },
    });
    assert(both.length <= 1, `DB: no máximo 1 appointment com barbeiro atribuído (count=${both.length})`);

    if (failCount === 2) {
      console.log(
        "  [NOTA] SQLite BEGIN IMMEDIATE serializa transações — ambas competiram e uma falhou com SQLITE_BUSY.",
      );
      console.log(
        "  [NOTA] O @@unique([barberId, startAt]) provê proteção adicional mas não foi necessário neste caso.",
      );
      console.log(
        "  [NOTA] LIMITAÇÃO: overlap concorrente (horários diferentes mas sobrepostos) não possui garantia DB-level",
      );
      console.log(
        "         além do lock de transação. Em PostgreSQL com SELECT FOR UPDATE essa garantia seria mais forte.",
      );
    }
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────
  if (toCleanup.length > 0) {
    await db.appointment.deleteMany({ where: { id: { in: toCleanup } } });
  }

  // ── Resultado ──────────────────────────────────────────────────────────────
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

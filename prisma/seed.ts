import { PrismaClient, AppointmentStatus, BarbershopPlan } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Barbershop A — BASIC (existing, kept for continuity) ──────────────────
  const shop = await db.barbershop.upsert({
    where: { slug: "barber-house" },
    update: { plan: "BASIC", status: "ACTIVE" },
    create: {
      slug: "barber-house",
      name: "Barber House",
      tagline: "Tradição e estilo em cada corte",
      phone: "(11) 99999-0000",
      whatsapp: "5511999990000",
      email: "contato@barberhouse.com.br",
      instagram: "@barberhouse",
      street: "Rua das Palmeiras",
      number: "123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
      zip: "01310-000",
      plan: "BASIC",
      status: "ACTIVE",
      isActive: true,
    },
  });

  // ── Barbershop B — PRO ────────────────────────────────────────────────────
  const shopPro = await db.barbershop.upsert({
    where: { slug: "studio-alpha" },
    update: { plan: "PRO", status: "ACTIVE" },
    create: {
      slug: "studio-alpha",
      name: "Studio Alpha",
      tagline: "Cortes modernos com personalidade",
      phone: "(21) 98888-1111",
      whatsapp: "5521988881111",
      email: "contato@studioalpha.com.br",
      instagram: "@studioalpha",
      street: "Av. Atlântica",
      number: "500",
      district: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zip: "22010-000",
      plan: "PRO",
      status: "ACTIVE",
      isActive: true,
    },
  });

  // ── Barbershop C — PREMIUM ────────────────────────────────────────────────
  const shopPremium = await db.barbershop.upsert({
    where: { slug: "the-gentleman" },
    update: { plan: "PREMIUM", status: "ACTIVE" },
    create: {
      slug: "the-gentleman",
      name: "The Gentleman",
      tagline: "A experiência definitiva em grooming",
      phone: "(31) 97777-2222",
      whatsapp: "5531977772222",
      email: "contato@thegentleman.com.br",
      instagram: "@thegentleman",
      street: "Rua Alvares Cabral",
      number: "300",
      district: "Lourdes",
      city: "Belo Horizonte",
      state: "MG",
      zip: "30170-000",
      plan: "PREMIUM",
      status: "ACTIVE",
      isActive: true,
    },
  });

  // Business hours (Mon–Sat, 09:00–19:00)
  const weekdays = [
    { weekday: 1, label: "Segunda" },
    { weekday: 2, label: "Terça" },
    { weekday: 3, label: "Quarta" },
    { weekday: 4, label: "Quinta" },
    { weekday: 5, label: "Sexta" },
    { weekday: 6, label: "Sábado", closeMin: 17 * 60 },
  ];
  await db.businessHour.deleteMany({ where: { barbershopId: shop.id, barberId: null } });
  for (const h of weekdays) {
    await db.businessHour.create({
      data: {
        barbershopId: shop.id,
        weekday: h.weekday,
        openMin: 9 * 60,
        closeMin: h.closeMin ?? 19 * 60,
      },
    });
  }

  // Services
  const services = await Promise.all([
    db.service.upsert({
      where: { id: "svc-corte" },
      update: {},
      create: {
        id: "svc-corte",
        barbershopId: shop.id,
        name: "Corte",
        description: "Corte masculino moderno com acabamento perfeito.",
        durationMin: 30,
        priceCents: 4500,
        isActive: true,
        sortOrder: 1,
      },
    }),
    db.service.upsert({
      where: { id: "svc-barba" },
      update: {},
      create: {
        id: "svc-barba",
        barbershopId: shop.id,
        name: "Barba",
        description: "Modelagem e hidratação de barba com navalha.",
        durationMin: 20,
        priceCents: 3000,
        isActive: true,
        sortOrder: 2,
      },
    }),
    db.service.upsert({
      where: { id: "svc-corte-barba" },
      update: {},
      create: {
        id: "svc-corte-barba",
        barbershopId: shop.id,
        name: "Corte + Barba",
        description: "Combo completo: corte + barba com navalha.",
        durationMin: 50,
        priceCents: 7000,
        isActive: true,
        sortOrder: 3,
      },
    }),
    db.service.upsert({
      where: { id: "svc-sobrancelha" },
      update: {},
      create: {
        id: "svc-sobrancelha",
        barbershopId: shop.id,
        name: "Design de Sobrancelha",
        description: "Alinhamento e design de sobrancelha.",
        durationMin: 15,
        priceCents: 2000,
        isActive: true,
        sortOrder: 4,
      },
    }),
  ]);

  const [svcCorte, svcBarba, svcCorteBarba] = services;

  // Barbers
  const barbers = await Promise.all([
    db.barber.upsert({
      where: { id: "brb-joao" },
      update: {},
      create: {
        id: "brb-joao",
        barbershopId: shop.id,
        name: "João Silva",
        specialty: "Cortes clássicos e modernos",
        bio: "10 anos de experiência, especialista em degradê.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        isActive: true,
        sortOrder: 1,
      },
    }),
    db.barber.upsert({
      where: { id: "brb-rafael" },
      update: {},
      create: {
        id: "brb-rafael",
        barbershopId: shop.id,
        name: "Rafael Costa",
        specialty: "Barba e cuidados faciais",
        bio: "Especialista em barba e tratamentos capilares.",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        isActive: true,
        sortOrder: 2,
      },
    }),
    db.barber.upsert({
      where: { id: "brb-carlos" },
      update: {},
      create: {
        id: "brb-carlos",
        barbershopId: shop.id,
        name: "Carlos Mendes",
        specialty: "Cortes texturizados",
        bio: "Referência em cortes texturizados e coloração.",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        isActive: true,
        sortOrder: 3,
      },
    }),
  ]);

  const [bJoao, bRafael, bCarlos] = barbers;

  // Clients
  const clientsData = [
    { id: "cli-01", name: "Miguel Santos", phone: "11991110001", email: "miguel@email.com", totalAppointments: 8, totalSpentCents: 42000, preferredBarberId: bCarlos.id, preferredServiceId: svcCorteBarba.id },
    { id: "cli-02", name: "Lucas Oliveira", phone: "11991110002", email: "lucas@email.com", totalAppointments: 5, totalSpentCents: 22500, preferredBarberId: bJoao.id, preferredServiceId: svcCorte.id },
    { id: "cli-03", name: "Pedro Almeida", phone: "11991110003", email: null, totalAppointments: 3, totalSpentCents: 13500, preferredBarberId: bJoao.id, preferredServiceId: svcBarba.id },
    { id: "cli-04", name: "Gabriel Ferreira", phone: "11991110004", email: "gabriel@email.com", totalAppointments: 12, totalSpentCents: 54000, preferredBarberId: bCarlos.id, preferredServiceId: svcCorteBarba.id },
    { id: "cli-05", name: "Matheus Costa", phone: "11991110005", email: null, totalAppointments: 6, totalSpentCents: 18000, preferredBarberId: bRafael.id, preferredServiceId: svcBarba.id },
    { id: "cli-06", name: "Rafael Lima", phone: "11991110006", email: "rafael.l@email.com", totalAppointments: 4, totalSpentCents: 28000, preferredBarberId: bRafael.id, preferredServiceId: svcCorteBarba.id },
    { id: "cli-07", name: "Bruno Martins", phone: "11991110007", email: null, totalAppointments: 2, totalSpentCents: 9000, preferredBarberId: bJoao.id, preferredServiceId: svcCorte.id },
    { id: "cli-08", name: "Felipe Rodrigues", phone: "11991110008", email: "felipe@email.com", totalAppointments: 7, totalSpentCents: 31500, preferredBarberId: bCarlos.id, preferredServiceId: svcCorte.id },
    { id: "cli-09", name: "André Souza", phone: "11991110009", email: null, totalAppointments: 9, totalSpentCents: 63000, preferredBarberId: bCarlos.id, preferredServiceId: svcCorteBarba.id },
    { id: "cli-10", name: "Thiago Pereira", phone: "11991110010", email: "thiago@email.com", totalAppointments: 3, totalSpentCents: 13500, preferredBarberId: bJoao.id, preferredServiceId: svcCorte.id },
  ];

  const clients = await Promise.all(
    clientsData.map((c) =>
      db.client.upsert({
        where: { barbershopId_phone: { barbershopId: shop.id, phone: c.phone } },
        update: {},
        create: {
          id: c.id,
          barbershopId: shop.id,
          name: c.name,
          phone: c.phone,
          email: c.email,
          totalAppointments: c.totalAppointments,
          totalSpentCents: c.totalSpentCents,
          preferredBarberId: c.preferredBarberId,
          preferredServiceId: c.preferredServiceId,
          isActive: true,
        },
      })
    )
  );

  // Appointments — anchored to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function apptDate(dayOffset: number, startMin: number): Date {
    return new Date(today.getTime() + dayOffset * 86400000 + startMin * 60000);
  }

  const apptTemplates: Array<{
    dayOffset: number;
    startMin: number;
    durationMin: number;
    clientIdx: number;
    barber: typeof bJoao;
    service: typeof svcCorte;
    status: AppointmentStatus;
  }> = [
    // Today
    { dayOffset: 0, startMin: 9 * 60, durationMin: 50, clientIdx: 8, barber: bCarlos, service: svcCorteBarba, status: "COMPLETED" },
    { dayOffset: 0, startMin: 10 * 60, durationMin: 30, clientIdx: 3, barber: bJoao, service: svcCorte, status: "COMPLETED" },
    { dayOffset: 0, startMin: 690, durationMin: 50, clientIdx: 0, barber: bRafael, service: svcCorteBarba, status: "CONFIRMED" },
    { dayOffset: 0, startMin: 14 * 60, durationMin: 20, clientIdx: 4, barber: bCarlos, service: svcBarba, status: "CONFIRMED" },
    { dayOffset: 0, startMin: 15 * 60, durationMin: 30, clientIdx: 1, barber: bJoao, service: svcCorte, status: "CONFIRMED" },
    { dayOffset: 0, startMin: 16 * 60, durationMin: 50, clientIdx: 5, barber: bRafael, service: svcCorteBarba, status: "PENDING" },
    { dayOffset: 0, startMin: 17 * 60, durationMin: 30, clientIdx: 9, barber: bCarlos, service: svcCorte, status: "PENDING" },
    { dayOffset: 0, startMin: 1110, durationMin: 20, clientIdx: 2, barber: bJoao, service: svcBarba, status: "CANCELLED" },
    // Yesterday
    { dayOffset: -1, startMin: 9 * 60, durationMin: 50, clientIdx: 0, barber: bCarlos, service: svcCorteBarba, status: "COMPLETED" },
    { dayOffset: -1, startMin: 630, durationMin: 30, clientIdx: 6, barber: bJoao, service: svcCorte, status: "NO_SHOW" },
    { dayOffset: -1, startMin: 14 * 60, durationMin: 50, clientIdx: 4, barber: bRafael, service: svcCorteBarba, status: "COMPLETED" },
    { dayOffset: -1, startMin: 16 * 60, durationMin: 20, clientIdx: 5, barber: bCarlos, service: svcBarba, status: "COMPLETED" },
    // 2 days ago
    { dayOffset: -2, startMin: 570, durationMin: 50, clientIdx: 3, barber: bCarlos, service: svcCorteBarba, status: "COMPLETED" },
    { dayOffset: -2, startMin: 11 * 60, durationMin: 30, clientIdx: 1, barber: bJoao, service: svcCorte, status: "COMPLETED" },
    { dayOffset: -2, startMin: 15 * 60, durationMin: 50, clientIdx: 9, barber: bRafael, service: svcCorteBarba, status: "COMPLETED" },
    // 3 days ago
    { dayOffset: -3, startMin: 10 * 60, durationMin: 50, clientIdx: 8, barber: bCarlos, service: svcCorteBarba, status: "COMPLETED" },
    { dayOffset: -3, startMin: 870, durationMin: 20, clientIdx: 0, barber: bJoao, service: svcBarba, status: "COMPLETED" },
    { dayOffset: -3, startMin: 17 * 60, durationMin: 30, clientIdx: 4, barber: bRafael, service: svcCorte, status: "CANCELLED" },
    // Tomorrow
    { dayOffset: 1, startMin: 9 * 60, durationMin: 50, clientIdx: 3, barber: bCarlos, service: svcCorteBarba, status: "CONFIRMED" },
    { dayOffset: 1, startMin: 10 * 60, durationMin: 30, clientIdx: 1, barber: bJoao, service: svcCorte, status: "CONFIRMED" },
    { dayOffset: 1, startMin: 11 * 60, durationMin: 50, clientIdx: 5, barber: bRafael, service: svcCorteBarba, status: "PENDING" },
    { dayOffset: 1, startMin: 870, durationMin: 30, clientIdx: 0, barber: bCarlos, service: svcCorte, status: "CONFIRMED" },
    { dayOffset: 1, startMin: 16 * 60, durationMin: 50, clientIdx: 8, barber: bJoao, service: svcCorteBarba, status: "PENDING" },
    // Day after tomorrow
    { dayOffset: 2, startMin: 570, durationMin: 50, clientIdx: 2, barber: bRafael, service: svcCorteBarba, status: "CONFIRMED" },
    { dayOffset: 2, startMin: 13 * 60, durationMin: 30, clientIdx: 6, barber: bCarlos, service: svcCorte, status: "PENDING" },
    { dayOffset: 2, startMin: 930, durationMin: 20, clientIdx: 9, barber: bJoao, service: svcBarba, status: "CONFIRMED" },
  ];

  // Delete existing seed appointments to allow re-seeding
  await db.appointment.deleteMany({ where: { barbershopId: shop.id } });

  for (const t of apptTemplates) {
    const cli = clients[t.clientIdx];
    const start = apptDate(t.dayOffset, t.startMin);
    const end = new Date(start.getTime() + t.durationMin * 60000);
    await db.appointment.create({
      data: {
        barbershopId: shop.id,
        serviceId: t.service.id,
        barberId: t.barber.id,
        clientId: cli.id,
        startAt: start,
        endAt: end,
        customerName: cli.name,
        customerPhone: cli.phone,
        status: t.status,
        priceCents: t.service.priceCents,
        anyBarber: false,
      },
    });
  }

  // Update lastVisitAt for clients that have completed appointments
  for (const cli of clients) {
    const lastCompleted = await db.appointment.findFirst({
      where: { clientId: cli.id, status: "COMPLETED" },
      orderBy: { startAt: "desc" },
    });
    if (lastCompleted) {
      await db.client.update({
        where: { id: cli.id },
        data: { lastVisitAt: lastCompleted.startAt },
      });
    }
  }

  // ── Admin: Barber House (BASIC) — from env vars ───────────────────────────
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@barberhouse.com.br").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, barbershopId: shop.id },
    create: {
      email: adminEmail,
      name: "Administrador",
      passwordHash,
      role: "OWNER",
      barbershopId: shop.id,
    },
  });

  // ── Admin: Studio Alpha (PRO) ─────────────────────────────────────────────
  const proHash = await bcrypt.hash("StudioAlpha@123!", 12);
  await db.admin.upsert({
    where: { email: "admin@studioalpha.com.br" },
    update: { barbershopId: shopPro.id },
    create: {
      email: "admin@studioalpha.com.br",
      name: "Admin Studio Alpha",
      passwordHash: proHash,
      role: "OWNER",
      barbershopId: shopPro.id,
    },
  });

  // ── Admin: The Gentleman (PREMIUM) ───────────────────────────────────────
  const premiumHash = await bcrypt.hash("Gentleman@123!", 12);
  await db.admin.upsert({
    where: { email: "admin@thegentleman.com.br" },
    update: { barbershopId: shopPremium.id },
    create: {
      email: "admin@thegentleman.com.br",
      name: "Admin The Gentleman",
      passwordHash: premiumHash,
      role: "OWNER",
      barbershopId: shopPremium.id,
    },
  });

  // ── SUPER_ADMIN (platform) — from env vars ────────────────────────────────
  const superEmail = (process.env.SUPER_ADMIN_EMAIL ?? "super@barbersaas.com.br").toLowerCase();
  const superPassword = process.env.SUPER_ADMIN_PASSWORD ?? "SuperAdmin@123!";
  const superHash = await bcrypt.hash(superPassword, 12);

  await db.admin.upsert({
    where: { email: superEmail },
    update: { passwordHash: superHash },
    create: {
      email: superEmail,
      name: "Super Admin",
      passwordHash: superHash,
      role: "SUPER_ADMIN",
      barbershopId: null,
    },
  });

  console.log("Seed complete.");
  console.log(`  Barbershops: ${shop.name} (BASIC), ${shopPro.name} (PRO), ${shopPremium.name} (PREMIUM)`);
  console.log(`  Services: ${services.length}`);
  console.log(`  Barbers: ${barbers.length}`);
  console.log(`  Clients: ${clients.length}`);
  console.log(`  Appointments: ${apptTemplates.length}`);
  console.log(`  Admin (BASIC): ${adminEmail}`);
  console.log(`  Admin (PRO):   admin@studioalpha.com.br`);
  console.log(`  Admin (PREMIUM): admin@thegentleman.com.br`);
  console.log(`  SUPER_ADMIN:   ${superEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

import { db } from "@/lib/db";
import type { BarbershopPlan, BarbershopStatus } from "@prisma/client";

export interface BarbershopRow {
  id: string;
  name: string;
  slug: string;
  plan: BarbershopPlan;
  status: BarbershopStatus;
  createdAt: Date;
  _count: { admins: number; clients: number; appointments: number };
}

export interface SaasAdminStats {
  total: number;
  byPlan: Record<BarbershopPlan, number>;
  byStatus: Record<BarbershopStatus, number>;
  barbershops: BarbershopRow[];
}

export async function getSaasAdminStats(): Promise<SaasAdminStats> {
  const barbershops = await db.barbershop.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      plan: true,
      status: true,
      createdAt: true,
      _count: {
        select: { admins: true, clients: true, appointments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const byPlan: Record<BarbershopPlan, number> = { BASIC: 0, PRO: 0, PREMIUM: 0 };
  const byStatus: Record<BarbershopStatus, number> = { ACTIVE: 0, SUSPENDED: 0, CANCELLED: 0 };

  for (const b of barbershops) {
    byPlan[b.plan]++;
    byStatus[b.status]++;
  }

  return { total: barbershops.length, byPlan, byStatus, barbershops };
}

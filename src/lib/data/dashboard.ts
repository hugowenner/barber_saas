import type { DashboardStats } from "@/types/admin";
import { db } from "@/lib/db";
import { toAppointment } from "@/lib/adapters";
import { utcDayRange, todayInTZ } from "@/lib/tz";

const include = { service: true, barber: true, client: true } as const;

export async function getDashboardStats(
  barbershopId: string,
  timezone = "America/Sao_Paulo",
): Promise<DashboardStats> {
  const today = todayInTZ(timezone);
  const { gte, lt } = utcDayRange(today, timezone);

  const todayRows = await db.appointment.findMany({
    where: { barbershopId, startAt: { gte, lt } },
    include,
    orderBy: { startAt: "asc" },
  });

  const todayAppts = todayRows.map(toAppointment);

  const todayTotal = todayAppts.length;
  const todayConfirmed = todayAppts.filter((a) => a.status === "CONFIRMED").length;
  const todayPending = todayAppts.filter((a) => a.status === "PENDING").length;
  const todayCompleted = todayAppts.filter((a) => a.status === "COMPLETED").length;
  const todayRevenueBRL = todayAppts
    .filter((a) => a.status === "CONFIRMED" || a.status === "COMPLETED")
    .reduce((sum, a) => sum + a.priceBRL, 0);

  const now = new Date();
  const upcomingToday = todayAppts.filter(
    (a) => new Date(a.startAt) >= now && (a.status === "PENDING" || a.status === "CONFIRMED"),
  );

  const barbers = await db.barber.findMany({
    where: { barbershopId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const countMap = new Map<string, number>();
  for (const a of todayAppts) {
    if (a.status === "CANCELLED" || !a.barberId) continue;
    countMap.set(a.barberId, (countMap.get(a.barberId) ?? 0) + 1);
  }

  const barberSummary = barbers
    .map((b) => ({
      barberId: b.id,
      barberName: b.name,
      count: countMap.get(b.id) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    todayTotal,
    todayConfirmed,
    todayPending,
    todayCompleted,
    todayRevenueBRL,
    upcomingToday,
    barberSummary,
  };
}

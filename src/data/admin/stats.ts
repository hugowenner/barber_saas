import type { DashboardStats } from "@/types/admin";
import { BARBERS } from "@/data/barbers";
import { getTodaysAppointments } from "./appointments";

/**
 * Derive dashboard stats from today's mock appointments.
 * In the real DB, this is a single SQL query with COUNT + SUM + GROUP BY.
 */
export function getDashboardStats(): DashboardStats {
  const today = getTodaysAppointments();

  const todayTotal = today.length;
  const todayConfirmed = today.filter((a) => a.status === "CONFIRMED").length;
  const todayPending = today.filter((a) => a.status === "PENDING").length;
  const todayCompleted = today.filter((a) => a.status === "COMPLETED").length;

  // Revenue = sum of confirmed + completed appointments (pending doesn't count yet)
  const todayRevenueBRL = today
    .filter((a) => a.status === "CONFIRMED" || a.status === "COMPLETED")
    .reduce((sum, a) => sum + a.priceBRL, 0);

  // Upcoming today = appointments with start time >= now and status pending/confirmed
  const now = new Date();
  const upcomingToday = today
    .filter(
      (a) =>
        new Date(a.startAt) >= now &&
        (a.status === "PENDING" || a.status === "CONFIRMED"),
    )
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  // Barber summary = count of today's appointments per barber (any status except cancelled)
  const barberCounts = new Map<string, number>();
  for (const a of today) {
    if (a.status === "CANCELLED") continue;
    if (!a.barberId) continue;
    barberCounts.set(a.barberId, (barberCounts.get(a.barberId) ?? 0) + 1);
  }
  const barberSummary = BARBERS.map((b) => ({
    barberId: b.id,
    barberName: b.name,
    count: barberCounts.get(b.id) ?? 0,
  })).sort((a, b) => b.count - a.count);

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

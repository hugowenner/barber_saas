import type { Metadata } from "next";
import { CalendarDays, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  DashboardStats,
  UpcomingAppointments,
  BarberSummary,
} from "@/components/admin/DashboardStats";
import { getSession } from "@/lib/auth-session";
import { getDashboardStats } from "@/lib/data/dashboard";
import { getShopTimezone } from "@/lib/data/barbershop";
import { hourInTZ } from "@/lib/tz";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");

  const timezone = await getShopTimezone(session.barbershopId);
  const stats = await getDashboardStats(session.barbershopId, timezone);

  const greeting = getGreeting(timezone);

  return (
    <div className="space-y-8">
      <PageHeader
        title={greeting}
        description="Resumo do dia na barbearia."
      />

      <section aria-label="Indicadores de hoje">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h2 className="eyebrow">Hoje</h2>
        </div>
        <DashboardStats stats={stats} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="upcoming-heading" className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <h2 id="upcoming-heading" className="eyebrow">
              Próximos agendamentos
            </h2>
          </div>
          <UpcomingAppointments appointments={stats.upcomingToday} timezone={timezone} />
        </section>

        <section aria-labelledby="barber-summary-heading">
          <div className="mb-3 flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <h2 id="barber-summary-heading" className="eyebrow">
              Resumo dos barbeiros
            </h2>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <BarberSummary summary={stats.barberSummary} />
          </div>
        </section>
      </div>
    </div>
  );
}

function getGreeting(timezone: string): string {
  const h = hourInTZ(timezone);
  if (h < 12) return "Bom dia, Administrador";
  if (h < 18) return "Boa tarde, Administrador";
  return "Boa noite, Administrador";
}

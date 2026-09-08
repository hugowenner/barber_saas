import type { Metadata } from "next";
import { Building2, LayoutDashboard, ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";
import { getSaasAdminStats } from "@/lib/data/saas-admin";
import type { BarbershopPlan, BarbershopStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Dashboard · Barber SaaS" };

const PLAN_LABEL: Record<BarbershopPlan, string> = {
  BASIC:   "Basic",
  PRO:     "Pro",
  PREMIUM: "Premium",
};

const PLAN_COLOR: Record<BarbershopPlan, string> = {
  BASIC:   "bg-zinc-500/10 text-zinc-500",
  PRO:     "bg-blue-500/10 text-blue-500",
  PREMIUM: "bg-amber-500/10 text-amber-500",
};

const STATUS_ICON: Record<BarbershopStatus, React.ElementType> = {
  ACTIVE:    ShieldCheck,
  SUSPENDED: ShieldAlert,
  CANCELLED: ShieldOff,
};

const STATUS_COLOR: Record<BarbershopStatus, string> = {
  ACTIVE:    "text-emerald-500",
  SUSPENDED: "text-amber-500",
  CANCELLED: "text-destructive",
};

const STATUS_LABEL: Record<BarbershopStatus, string> = {
  ACTIVE:    "Ativa",
  SUSPENDED: "Suspensa",
  CANCELLED: "Cancelada",
};

export default async function SaasAdminDashboard() {
  const stats = await getSaasAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral da plataforma Barber SaaS
        </p>
      </div>

      {/* Top cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de barbearias"
          value={stats.total}
          icon={Building2}
          className="border-primary/20"
        />
        {(["BASIC", "PRO", "PREMIUM"] as BarbershopPlan[]).map((plan) => (
          <StatCard
            key={plan}
            label={PLAN_LABEL[plan]}
            value={stats.byPlan[plan]}
            icon={LayoutDashboard}
            className={PLAN_COLOR[plan]}
          />
        ))}
      </div>

      {/* Status cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(["ACTIVE", "SUSPENDED", "CANCELLED"] as BarbershopStatus[]).map((status) => {
          const Icon = STATUS_ICON[status];
          return (
            <div
              key={status}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"
            >
              <Icon className={`size-6 shrink-0 ${STATUS_COLOR[status]}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.byStatus[status]}</p>
                <p className="text-sm text-muted-foreground">{STATUS_LABEL[status]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barbershop table */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Barbearias</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Slug</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Plano</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Clientes</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Agendamentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.barbershops.map((b) => {
                const StatusIcon = STATUS_ICON[b.status];
                return (
                  <tr key={b.id} className="bg-card hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_COLOR[b.plan]}`}>
                        {PLAN_LABEL[b.plan]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${STATUS_COLOR[b.status]}`}>
                        <StatusIcon className="size-3" />
                        {STATUS_LABEL[b.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{b._count.clients}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{b._count.appointments}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {stats.barbershops.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhuma barbearia cadastrada ainda.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 rounded-lg border border-border bg-card p-5 ${className}`}>
      <Icon className="size-6 shrink-0 text-current opacity-60" />
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

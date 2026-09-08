import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Phone, Calendar, TrendingUp, User, Award } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth-session";
import { getClientById } from "@/lib/data/clients";
import { getAppointmentsByClient } from "@/lib/data/appointments";
import { getBarberById } from "@/lib/data/barbers";
import { getServiceById } from "@/lib/data/services";
import { formatBRL } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const session = await getSession();
  if (!session?.barbershopId) return { title: "Cliente não encontrado" };
  const client = await getClientById(id, session.barbershopId);
  if (!client) return { title: "Cliente não encontrado" };
  return { title: client.name };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.barbershopId) notFound();
  const barbershopId = session.barbershopId;
  const client = await getClientById(id, barbershopId);
  if (!client) notFound();

  const [history, preferredBarber, preferredService] = await Promise.all([
    getAppointmentsByClient(barbershopId, client.id),
    client.preferredBarberId ? getBarberById(client.preferredBarberId, barbershopId) : Promise.resolve(null),
    client.preferredServiceId ? getServiceById(client.preferredServiceId, barbershopId) : Promise.resolve(null),
  ]);

  const stats = [
    {
      icon: <Calendar className="size-4" />,
      label: "Último atendimento",
      value: client.lastVisitAt
        ? new Date(client.lastVisitAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "—",
    },
    { icon: <TrendingUp className="size-4" />, label: "Total de atendimentos", value: String(client.totalAppointments) },
    { icon: <TrendingUp className="size-4" />, label: "Total gasto", value: formatBRL(client.totalSpentBRL) },
    { icon: <Award className="size-4" />, label: "Barbeiro preferido", value: preferredBarber?.name ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm">
        <ArrowLeft className="size-4" />
        Voltar para clientes
      </Link>

      <PageHeader title={client.name} description={client.isActive ? "Cliente ativo" : "Cliente inativo"} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display text-lg tracking-[0.04em]">Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</div>
                <div className="text-sm tabular-nums text-foreground">{client.phone}</div>
              </div>
            </div>
            {client.email && (
              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</div>
                  <div className="text-sm text-foreground">{client.email}</div>
                </div>
              </div>
            )}
            <div className="border-t border-border pt-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Cliente desde</div>
              <div className="text-sm text-foreground">
                {new Date(client.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
            {client.notes && (
              <div className="border-t border-border pt-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Observações</div>
                <p className="mt-1 text-sm text-foreground">{client.notes}</p>
              </div>
            )}
            {preferredService && (
              <div className="border-t border-border pt-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Serviço preferido</div>
                <div className="text-sm text-foreground">{preferredService.name}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-primary">
                {s.icon}
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              </div>
              <div className="mt-2 font-display text-2xl tracking-[0.04em] text-foreground">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <section aria-labelledby="history-heading">
        <div className="mb-3 flex items-center gap-2">
          <h2 id="history-heading" className="eyebrow">Histórico de atendimentos</h2>
        </div>

        {history.length === 0 ? (
          <EmptyState title="Sem histórico" description="Este cliente ainda não possui atendimentos registrados." />
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-lg border border-border md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/40">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Data</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Serviço</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Barbeiro</th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((a) => (
                    <tr key={a.id} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 text-foreground">{new Date(a.startAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.serviceName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.barberName ?? "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3 text-right tabular-nums text-foreground">{formatBRL(a.priceBRL)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="space-y-3 md:hidden">
              {history.map((a) => (
                <li key={a.id}>
                  <article className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">{a.serviceName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(a.startAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })} · {a.barberName ?? "—"}
                        </div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="mt-2 border-t border-border pt-2 text-sm tabular-nums text-foreground">{formatBRL(a.priceBRL)}</div>
                  </article>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

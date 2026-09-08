"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Inbox, UserX, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Client } from "@/types/admin";

interface Props {
  initialClients: Client[];
}

export function ClientsClient({ initialClients }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialClients
      .filter((c) => {
        if (statusFilter === "active" && !c.isActive) return false;
        if (statusFilter === "inactive" && c.isActive) return false;
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.replace(/\D/g, "").includes(q.replace(/\D/g, ""))
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [search, statusFilter, initialClients]);

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes" description="Base de clientes da barbearia." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 bg-card"
            aria-label="Buscar cliente"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-full bg-card sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="Nenhum cliente encontrado"
          description="Ajuste a busca ou os filtros para ver mais resultados."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-border md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nome</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">WhatsApp</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Último atendimento</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-2 py-3" aria-label="Ações" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} onClick={() => router.push(`/admin/clients/${c.id}`)} className="cursor-pointer transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{c.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.lastVisitAt ? formatDateShort(c.lastVisitAt) : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">{c.totalAppointments}</td>
                    <td className="px-4 py-3"><ClientStatusPill active={c.isActive} /></td>
                    <td className="px-2 py-3 text-right"><ChevronRight className="size-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-2 md:hidden">
            {filtered.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 focus-ring">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{c.name}</span>
                      <ClientStatusPill active={c.isActive} small />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {c.phone} · {c.totalAppointments} atendimentos
                    </div>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ClientStatusPill({ active, small }: { active: boolean; small?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", small && "px-1.5 py-0 text-[10px]", active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-muted-foreground/30 bg-muted/30 text-muted-foreground")}>
      {active ? <UserCheck className="size-3" /> : <UserX className="size-3" />}
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

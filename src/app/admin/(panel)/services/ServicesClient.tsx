"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Clock, Tag } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatBRL, formatDuration } from "@/lib/format";
import { createService, updateService } from "@/lib/actions/services";
import type { Service } from "@/types";

type ServiceWithMeta = Service & { isActive: boolean; sortOrder: number };

interface Props {
  barbershopId: string;
  initialServices: ServiceWithMeta[];
}

export function ServicesClient({ barbershopId, initialServices }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceWithMeta | null>(null);

  const handleAdd = () => { setEditing(null); setDialogOpen(true); };
  const handleEdit = (s: ServiceWithMeta) => { setEditing(s); setDialogOpen(true); };

  const handleSave = (data: ServiceFormData) => {
    startTransition(async () => {
      if (editing) {
        await updateService(editing.id, data);
      } else {
        await createService(barbershopId, data);
      }
      setDialogOpen(false);
      setEditing(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Serviços"
        description="Gerencie os serviços oferecidos pela barbearia."
        actions={
          <Button onClick={handleAdd} disabled={isPending}>
            <Plus className="size-4" />
            Adicionar serviço
          </Button>
        }
      />

      {initialServices.length === 0 ? (
        <EmptyState
          icon={<Tag className="size-5" />}
          title="Nenhum serviço"
          description="Adicione o primeiro serviço para começar."
          action={
            <Button onClick={handleAdd}>
              <Plus className="size-4" />
              Adicionar serviço
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialServices.map((service) => (
            <li key={service.id}>
              <ServiceAdminCard service={service} onEdit={() => handleEdit(service)} />
            </li>
          ))}
        </ul>
      )}

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editing}
        onSave={handleSave}
      />
    </div>
  );
}

function ServiceAdminCard({ service, onEdit }: { service: ServiceWithMeta; onEdit: () => void }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-xl tracking-[0.04em] text-foreground">{service.name}</h3>
        <span className="font-display text-xl text-primary">{formatBRL(service.priceBRL)}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        {formatDuration(service.durationMin)}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {service.isActive ? "Ativo" : "Inativo"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="border-border bg-transparent text-foreground hover:bg-secondary"
        >
          <Pencil className="size-3.5" />
          Editar
        </Button>
      </div>
    </article>
  );
}

export interface ServiceFormData {
  name: string;
  description: string;
  durationMin: number;
  priceBRL: number;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceWithMeta | null;
  onSave: (data: ServiceFormData) => void;
}

function ServiceFormDialog({ open, onOpenChange, service, onSave }: ServiceFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMin, setDurationMin] = useState("30");
  const [priceBRL, setPriceBRL] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setName(service?.name ?? "");
      setDescription(service?.description ?? "");
      setDurationMin(String(service?.durationMin ?? 30));
      setPriceBRL(String(service?.priceBRL ?? ""));
    }
    onOpenChange(open);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(durationMin, 10);
    const price = parseFloat(priceBRL.replace(",", "."));
    if (!name.trim() || !duration || isNaN(price)) return;
    onSave({ name: name.trim(), description: description.trim(), durationMin: duration, priceBRL: price });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-[0.04em]">
            {service ? "Editar serviço" : "Adicionar serviço"}
          </DialogTitle>
          <DialogDescription>
            {service ? "Atualize as informações do serviço." : "Preencha as informações do novo serviço."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Nome</Label>
            <Input id="service-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Corte masculino" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-description">Descrição</Label>
            <Textarea id="service-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do serviço" className="bg-background" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-duration">Duração (min)</Label>
              <Input id="service-duration" type="number" min="5" step="5" required value={durationMin} onChange={(e) => setDurationMin(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-price">Preço (R$)</Label>
              <Input id="service-price" type="text" inputMode="decimal" required value={priceBRL} onChange={(e) => setPriceBRL(e.target.value)} placeholder="0,00" className="bg-background" />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {service ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

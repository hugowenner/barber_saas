"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Scissors, Pencil, UserCheck, UserX } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBarber, updateBarber } from "@/lib/actions/barbers";
import type { Barber, Service } from "@/types";

type BarberWithActive = Barber & { isActive: boolean };

interface Props {
  initialBarbers: BarberWithActive[];
  services: Service[];
}

export function BarbersClient({ initialBarbers, services }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BarberWithActive | null>(null);

  const handleAdd = () => { setEditing(null); setDialogOpen(true); };
  const handleEdit = (b: BarberWithActive) => { setEditing(b); setDialogOpen(true); };

  const handleToggleActive = (b: BarberWithActive) => {
    startTransition(async () => {
      await updateBarber(b.id, { isActive: !b.isActive });
      router.refresh();
    });
  };

  const handleSave = (data: BarberFormData) => {
    startTransition(async () => {
      if (editing) {
        await updateBarber(editing.id, data);
      } else {
        await createBarber(data);
      }
      setDialogOpen(false);
      setEditing(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barbeiros"
        description="Gerencie os barbeiros da barbearia."
        actions={
          <Button onClick={handleAdd} disabled={isPending}>
            <Plus className="size-4" />
            Adicionar barbeiro
          </Button>
        }
      />

      {initialBarbers.length === 0 ? (
        <EmptyState
          icon={<Scissors className="size-5" />}
          title="Nenhum barbeiro"
          description="Adicione o primeiro barbeiro para começar."
          action={
            <Button onClick={handleAdd}>
              <Plus className="size-4" />
              Adicionar barbeiro
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialBarbers.map((barber) => (
            <li key={barber.id}>
              <BarberAdminCard
                barber={barber}
                onEdit={() => handleEdit(barber)}
                onToggleActive={() => handleToggleActive(barber)}
              />
            </li>
          ))}
        </ul>
      )}

      <BarberFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        barber={editing}
        services={services}
        onSave={handleSave}
      />
    </div>
  );
}

interface BarberAdminCardProps {
  barber: BarberWithActive;
  onEdit: () => void;
  onToggleActive: () => void;
}

function BarberAdminCard({ barber, onEdit, onToggleActive }: BarberAdminCardProps) {
  const initials = barber.name.split(" ").slice(0, 2).map((p) => p[0]).join("");

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-secondary">
        {barber.imageUrl ? (
          <Image
            src={barber.imageUrl}
            alt={`Foto de ${barber.name}`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-5xl text-primary">
            {initials}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg tracking-[0.04em] text-foreground">{barber.name}</h3>
        <p className="mt-0.5 text-xs uppercase tracking-wider text-primary">{barber.specialty}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{barber.bio}</p>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 border-border bg-transparent text-foreground hover:bg-secondary"
          >
            <Pencil className="size-3.5" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleActive}
            aria-label={barber.isActive ? "Desativar barbeiro" : "Ativar barbeiro"}
            className="text-muted-foreground hover:text-foreground"
          >
            {barber.isActive ? <UserCheck className="size-4" /> : <UserX className="size-4" />}
          </Button>
        </div>
      </div>
    </article>
  );
}

export interface BarberFormData {
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string | null;
}

interface BarberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber: BarberWithActive | null;
  services: Service[];
  onSave: (data: BarberFormData) => void;
}

function BarberFormDialog({ open, onOpenChange, barber, services, onSave }: BarberFormDialogProps) {
  const [name, setName] = useState(barber?.name ?? "");
  const [specialty, setSpecialty] = useState(barber?.specialty ?? "");
  const [bio, setBio] = useState(barber?.bio ?? "");
  const [imageUrl, setImageUrl] = useState(barber?.imageUrl ?? "");
  const [offeredServices, setOfferedServices] = useState<Set<string>>(
    new Set(services.map((s) => s.id))
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setName(barber?.name ?? "");
      setSpecialty(barber?.specialty ?? "");
      setBio(barber?.bio ?? "");
      setImageUrl(barber?.imageUrl ?? "");
      setOfferedServices(new Set(services.map((s) => s.id)));
    }
    onOpenChange(open);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: name.trim(), specialty: specialty.trim(), bio: bio.trim(), imageUrl: imageUrl.trim() || null });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-[0.04em]">
            {barber ? "Editar barbeiro" : "Adicionar barbeiro"}
          </DialogTitle>
          <DialogDescription>
            {barber ? "Atualize as informações do barbeiro." : "Preencha as informações do novo barbeiro."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barber-name">Nome</Label>
            <Input id="barber-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do barbeiro" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barber-specialty">Especialidade</Label>
            <Input id="barber-specialty" required value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Ex: Especialista em cortes degradê" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barber-bio">Descrição</Label>
            <Textarea id="barber-bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Breve biografia do barbeiro" className="bg-background" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barber-image">URL da foto</Label>
            <Input id="barber-image" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="bg-background" />
          </div>

          <div className="space-y-2">
            <Label>Serviços oferecidos</Label>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-background p-3">
              {services.map((service) => (
                <label key={service.id} className="flex items-center gap-2 text-sm text-foreground">
                  <Checkbox
                    checked={offeredServices.has(service.id)}
                    onCheckedChange={(checked) => {
                      setOfferedServices((prev) => {
                        const next = new Set(prev);
                        if (checked) next.add(service.id);
                        else next.delete(service.id);
                        return next;
                      });
                    }}
                  />
                  {service.name}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim() || !specialty.trim()}>
              {barber ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

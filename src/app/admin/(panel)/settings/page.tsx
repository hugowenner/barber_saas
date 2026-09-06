"use client";

import { useState } from "react";
import { Save, CheckCircle2, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getInitialSettings } from "@/data/admin/settings";
import type { AdminSettings } from "@/types/admin";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(getInitialSettings);
  const { toast } = useToast();

  const updateBarbershop = (patch: Partial<AdminSettings["barbershop"]>) => {
    setSettings((s) => ({ ...s, barbershop: { ...s.barbershop, ...patch } }));
  };

  const updateHour = (
    weekday: number,
    patch: Partial<AdminSettings["hours"][number]>,
  ) => {
    setSettings((s) => ({
      ...s,
      hours: s.hours.map((h) =>
        h.weekday === weekday ? { ...h, ...patch } : h,
      ),
    }));
  };

  const updateBooking = (patch: Partial<AdminSettings["booking"]>) => {
    setSettings((s) => ({ ...s, booking: { ...s.booking, ...patch } }));
  };

  const updateWhatsapp = (patch: Partial<AdminSettings["whatsapp"]>) => {
    setSettings((s) => ({ ...s, whatsapp: { ...s.whatsapp, ...patch } }));
  };

  const handleSave = (section: string) => {
    // Mock save — no persistence yet.
    toast({
      title: "Configurações salvas",
      description: `As alterações da seção "${section}" foram aplicadas (mock).`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Ajuste as informações da barbearia e do agendamento."
      />

      <Tabs defaultValue="barbershop" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card sm:flex sm:w-auto">
          <TabsTrigger value="barbershop">Barbearia</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
          <TabsTrigger value="booking">Agendamento</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>

        {/* Barbearia */}
        <TabsContent value="barbershop" className="mt-4">
          <div className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              title="Informações da barbearia"
              description="Dados principais exibidos no site público."
            />

            <div className="space-y-2">
              <Label htmlFor="bp-name">Nome</Label>
              <Input
                id="bp-name"
                value={settings.barbershop.name}
                onChange={(e) => updateBarbershop({ name: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bp-description">Descrição</Label>
              <Textarea
                id="bp-description"
                rows={3}
                value={settings.barbershop.description}
                onChange={(e) =>
                  updateBarbershop({ description: e.target.value })
                }
                className="bg-background"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bp-phone">Telefone</Label>
                <Input
                  id="bp-phone"
                  value={settings.barbershop.phone}
                  onChange={(e) => updateBarbershop({ phone: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-email">E-mail</Label>
                <Input
                  id="bp-email"
                  type="email"
                  value={settings.barbershop.email}
                  onChange={(e) => updateBarbershop({ email: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>

            <Separator />

            <SectionTitle title="Endereço" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bp-street">Rua</Label>
                <Input
                  id="bp-street"
                  value={settings.barbershop.street}
                  onChange={(e) => updateBarbershop({ street: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-number">Número</Label>
                <Input
                  id="bp-number"
                  value={settings.barbershop.number}
                  onChange={(e) => updateBarbershop({ number: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-district">Bairro</Label>
                <Input
                  id="bp-district"
                  value={settings.barbershop.district}
                  onChange={(e) =>
                    updateBarbershop({ district: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-city">Cidade</Label>
                <Input
                  id="bp-city"
                  value={settings.barbershop.city}
                  onChange={(e) => updateBarbershop({ city: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-state">Estado</Label>
                <Input
                  id="bp-state"
                  value={settings.barbershop.state}
                  onChange={(e) => updateBarbershop({ state: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bp-zip">CEP</Label>
                <Input
                  id="bp-zip"
                  value={settings.barbershop.zip}
                  onChange={(e) => updateBarbershop({ zip: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>

            <SaveBar onSave={() => handleSave("Barbearia")} />
          </div>
        </TabsContent>

        {/* Horários */}
        <TabsContent value="hours" className="mt-4">
          <div className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              title="Horários de funcionamento"
              description="Defina os dias e horários em que a barbearia atende."
            />

            <ul className="space-y-3">
              {settings.hours.map((h) => (
                <li
                  key={h.weekday}
                  className="flex flex-col gap-3 rounded-md border border-border bg-background p-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex items-center justify-between gap-3 sm:w-32 sm:justify-start">
                    <span className="text-sm font-medium text-foreground">
                      {h.label}
                    </span>
                    <Switch
                      checked={h.enabled}
                      onCheckedChange={(checked) =>
                        updateHour(h.weekday, { enabled: checked })
                      }
                      aria-label={`Atender ${h.label}`}
                    />
                  </div>
                  <div
                    className={`grid grid-cols-2 gap-2 sm:flex sm:flex-1 sm:items-center sm:gap-3 ${
                      h.enabled ? "" : "opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`h-${h.weekday}-open`}
                        className="text-xs text-muted-foreground"
                      >
                        De
                      </Label>
                      <Input
                        id={`h-${h.weekday}-open`}
                        type="time"
                        value={h.open}
                        onChange={(e) =>
                          updateHour(h.weekday, { open: e.target.value })
                        }
                        disabled={!h.enabled}
                        className="h-9 w-28 bg-card"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`h-${h.weekday}-close`}
                        className="text-xs text-muted-foreground"
                      >
                        Até
                      </Label>
                      <Input
                        id={`h-${h.weekday}-close`}
                        type="time"
                        value={h.close}
                        onChange={(e) =>
                          updateHour(h.weekday, { close: e.target.value })
                        }
                        disabled={!h.enabled}
                        className="h-9 w-28 bg-card"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <SaveBar onSave={() => handleSave("Horários")} />
          </div>
        </TabsContent>

        {/* Agendamento */}
        <TabsContent value="booking" className="mt-4">
          <div className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              title="Regras de agendamento"
              description="Configure as regras que controlam o fluxo de agendamentos."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bk-lead">Antecedência mínima (horas)</Label>
                <Input
                  id="bk-lead"
                  type="number"
                  min="0"
                  value={settings.booking.minLeadHours}
                  onChange={(e) =>
                    updateBooking({ minLeadHours: parseInt(e.target.value, 10) || 0 })
                  }
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Tempo mínimo antes do horário.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bk-duration">Duração padrão (min)</Label>
                <Input
                  id="bk-duration"
                  type="number"
                  min="5"
                  step="5"
                  value={settings.booking.defaultDurationMin}
                  onChange={(e) =>
                    updateBooking({
                      defaultDurationMin: parseInt(e.target.value, 10) || 30,
                    })
                  }
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Duração usada como padrão para novos serviços.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-4">
              <div className="space-y-1">
                <Label htmlFor="bk-cancel" className="text-sm">
                  Permitir cancelamento
                </Label>
                <p className="text-xs text-muted-foreground">
                  Permite que clientes cancelem seus próprios agendamentos.
                </p>
              </div>
              <Switch
                id="bk-cancel"
                checked={settings.booking.allowCancellation}
                onCheckedChange={(checked) =>
                  updateBooking({ allowCancellation: checked })
                }
              />
            </div>

            {settings.booking.allowCancellation && (
              <div className="space-y-2">
                <Label htmlFor="bk-cancel-lead">
                  Antecedência para cancelamento (horas)
                </Label>
                <Input
                  id="bk-cancel-lead"
                  type="number"
                  min="0"
                  value={settings.booking.cancellationLeadHours}
                  onChange={(e) =>
                    updateBooking({
                      cancellationLeadHours: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="bg-background sm:w-48"
                />
                <p className="text-xs text-muted-foreground">
                  Tempo mínimo antes do horário para cancelar.
                </p>
              </div>
            )}

            <SaveBar onSave={() => handleSave("Agendamento")} />
          </div>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp" className="mt-4">
          <div className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-6">
            <SectionTitle
              title="Integração WhatsApp"
              description="Configure o envio de confirmações por WhatsApp."
            />

            <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-background p-4">
              <div className="space-y-1">
                <Label htmlFor="wa-enabled" className="text-sm">
                  Enviar confirmações
                </Label>
                <p className="text-xs text-muted-foreground">
                  Envia uma mensagem automática ao confirmar um agendamento.
                </p>
              </div>
              <Switch
                id="wa-enabled"
                checked={settings.whatsapp.enabled}
                onCheckedChange={(checked) =>
                  updateWhatsapp({ enabled: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wa-phone">Número do WhatsApp</Label>
              <Input
                id="wa-phone"
                value={settings.whatsapp.phone}
                onChange={(e) => updateWhatsapp({ phone: e.target.value })}
                placeholder="5511940001234"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Formato internacional sem + (ex: 5511940001234).
              </p>
            </div>

            {/* Connection status */}
            <div
              className={`flex items-center gap-3 rounded-md border p-4 ${
                settings.whatsapp.apiConnected
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
              }`}
            >
              {settings.whatsapp.apiConnected ? (
                <CheckCircle2 className="size-5 text-emerald-400" />
              ) : (
                <MessageSquare className="size-5 text-amber-400" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {settings.whatsapp.apiConnected
                    ? "API conectada"
                    : "API não conectada"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {settings.whatsapp.apiConnected
                    ? "Integração ativa. Mensagens serão enviadas automaticamente."
                    : "A integração oficial com a WhatsApp Business Platform será configurada em uma próxima etapa."}
                </p>
              </div>
              {!settings.whatsapp.apiConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="border-border bg-transparent text-muted-foreground"
                >
                  Conectar
                </Button>
              )}
            </div>

            <SaveBar onSave={() => handleSave("WhatsApp")} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- helpers ---------- */

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-0.5">
      <h2 className="font-display text-xl tracking-[0.04em] text-foreground">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function Separator() {
  return <div className="hairline-gold my-2" aria-hidden />;
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end border-t border-border pt-4">
      <Button onClick={onSave}>
        <Save className="size-4" />
        Salvar alterações
      </Button>
    </div>
  );
}

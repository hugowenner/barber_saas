"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CustomerFormProps {
  name: string;
  phone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
}

/**
 * Brazilian phone mask: (11) 91234-5678 or (11) 1234-5678
 * Keeps digits internally for WhatsApp link.
 */
function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function CustomerForm({
  name,
  phone,
  onNameChange,
  onPhoneChange,
}: CustomerFormProps) {
  const [touched, setTouched] = useState({ name: false, phone: false });

  const nameError =
    touched.name && name.trim().length < 2 ? "Informe seu nome." : null;
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneError =
    touched.phone && phoneDigits.length < 10
      ? "Telefone inválido. Inclua DDD."
      : null;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-display text-3xl tracking-[0.04em] text-foreground sm:text-4xl">
          Seus dados
        </h2>
        <p className="text-sm text-muted-foreground">
          Sem cadastro. É só para confirmarmos seu horário.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer-name" className="text-sm text-foreground">
            Nome
          </Label>
          <Input
            id="customer-name"
            type="text"
            autoComplete="name"
            placeholder="Como podemos te chamar?"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, name: true }))}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "name-error" : undefined}
            className={cn(
              "h-12 bg-card text-base",
              nameError && "border-destructive",
            )}
          />
          {nameError && (
            <p id="name-error" className="text-xs text-destructive">
              {nameError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-phone" className="text-sm text-foreground">
            WhatsApp
          </Label>
          <Input
            id="customer-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 91234-5678"
            value={phone}
            onChange={(e) => onPhoneChange(maskPhone(e.target.value))}
            onBlur={() => setTouched((s) => ({ ...s, phone: true }))}
            aria-invalid={Boolean(phoneError)}
            aria-describedby={phoneError ? "phone-error" : undefined}
            className={cn(
              "h-12 bg-card text-base tabular-nums",
              phoneError && "border-destructive",
            )}
          />
          {phoneError ? (
            <p id="phone-error" className="text-xs text-destructive">
              {phoneError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Vamos enviar a confirmação por aqui.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

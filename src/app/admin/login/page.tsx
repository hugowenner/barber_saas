"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/auth";
import { SITE_CONFIG } from "@/data/business";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12">
      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm"
      >
        <ArrowLeft className="size-4" />
        Voltar ao site
      </Link>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="font-display text-3xl tracking-[0.18em] text-foreground sm:text-4xl">
            {SITE_CONFIG.name}
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.25em] text-primary">
            Acesso administrativo
          </div>
        </div>

        <form
          action={formAction}
          className="space-y-5 rounded-lg border border-border bg-card p-6 sm:p-8"
        >
          {state?.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">
              E-mail
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@barberhouse.com.br"
              className="h-11 bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 bg-background"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !email || !password}
            className="h-11 w-full text-base"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

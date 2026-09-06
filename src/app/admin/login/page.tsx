"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import { SITE_CONFIG } from "@/data/business";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    // Mock: simulate a brief async login.
    setTimeout(() => {
      login(email, password);
      router.push("/admin/dashboard");
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12">
      {/* Back to site */}
      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm"
      >
        <ArrowLeft className="size-4" />
        Voltar ao site
      </Link>

      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center">
          <div className="font-display text-3xl tracking-[0.18em] text-foreground sm:text-4xl">
            {SITE_CONFIG.name}
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.25em] text-primary">
            Acesso administrativo
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-lg border border-border bg-card p-6 sm:p-8"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">
              E-mail
            </Label>
            <Input
              id="email"
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
            disabled={loading || !email || !password}
            className="h-11 w-full text-base"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-ring rounded-sm"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>

        {/* Mock hint */}
        <p className="text-center text-xs text-muted-foreground">
          MVP: qualquer e-mail e senha funcionam. Autenticação real será
          implementada na próxima etapa.
        </p>
      </div>
    </div>
  );
}

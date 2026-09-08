"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";

interface SaasAdminShellProps {
  children: React.ReactNode;
  user: { name: string; email: string };
}

const NAV = [
  { href: "/saas-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/saas-admin/barbershops", label: "Barbearias", icon: Building2 },
];

export function SaasAdminShell({ children, user }: SaasAdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card/40">
        <div className="flex h-16 items-center border-b border-border px-6">
          <div>
            <div className="font-display text-sm tracking-[0.15em] text-foreground">
              BARBER SAAS
            </div>
            <div className="text-xs text-primary tracking-[0.1em] uppercase">
              Plataforma
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-primary">
              Super Admin
            </p>
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="pl-64">
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

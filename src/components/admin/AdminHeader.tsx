"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth";
import type { AdminUser } from "@/components/admin/AdminShell";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/appointments": "Agendamentos",
  "/admin/clients": "Clientes",
  "/admin/barbers": "Barbeiros",
  "/admin/services": "Serviços",
  "/admin/settings": "Configurações",
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  OWNER: "Proprietário",
  MANAGER: "Gerente",
  BARBER: "Barbeiro",
};

interface AdminHeaderProps {
  onMenuClick: () => void;
  user: AdminUser;
}

export function AdminHeader({ onMenuClick, user }: AdminHeaderProps) {
  const pathname = usePathname();

  const title = TITLES[pathname] ?? "Admin";
  const initials = (user.name ?? "A")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-ring md:hidden"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="font-display text-2xl tracking-[0.06em] text-foreground sm:text-3xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/" target="_blank">
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">Ver site</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2 border-l border-border pl-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium leading-tight text-foreground">
              {user.name ?? "Administrador"}
            </div>
            <div className="text-xs leading-tight text-muted-foreground">
              {ROLE_LABELS[user.role] ?? user.role}
            </div>
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Sair"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

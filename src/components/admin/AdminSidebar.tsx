"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Users,
  Scissors,
  Tag,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/data/business";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Agenda", href: "/admin/agenda", icon: CalendarDays },
  { label: "Agendamentos", href: "/admin/appointments", icon: Calendar },
  { label: "Clientes", href: "/admin/clients", icon: Users },
  { label: "Barbeiros", href: "/admin/barbers", icon: Scissors },
  { label: "Serviços", href: "/admin/services", icon: Tag },
  { label: "Configurações", href: "/admin/settings", icon: Settings },
] as const;

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <BrandMark />
        <div className="leading-none">
          <div className="font-display text-base tracking-[0.18em] text-foreground">
            {SITE_CONFIG.name}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-primary">
            Admin
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto p-3"
        aria-label="Navegação administrativa"
      >
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-ring",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-ring"
        >
          <ArrowLeft className="size-4 shrink-0" />
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <span
      aria-hidden
      className="inline-flex size-7 items-center justify-center rounded-sm border border-primary/40 bg-secondary"
    >
      <span className="block h-4 w-px bg-primary" />
      <span className="mx-px block h-4 w-px bg-foreground/60" />
      <span className="block h-4 w-px bg-primary" />
    </span>
  );
}

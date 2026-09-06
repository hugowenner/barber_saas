"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import { useIsClient } from "@/hooks/use-is-client";
import { Loader2 } from "lucide-react";

/**
 * Layout for all panel pages (everything except /admin/login).
 *
 * Client-side auth guard: redirects to /admin/login if no mock user is set.
 * This is a placeholder until NextAuth server-side sessions land.
 */
export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAdminAuthStore((s) => s.user);
  const isClient = useIsClient();
  const router = useRouter();

  useEffect(() => {
    if (isClient && !user) {
      router.replace("/admin/login");
    }
  }, [isClient, user, router]);

  // During SSR / first client render / redirect: show a minimal loading state.
  if (!isClient || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Carregando" />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

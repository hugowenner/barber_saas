import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth-session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      user={{
        name: session.name,
        email: session.email,
        role: session.role,
        barbershopPlan: session.barbershopPlan,
      }}
    >
      {children}
    </AdminShell>
  );
}

import { redirect } from "next/navigation";
import { SaasAdminShell } from "@/components/saas-admin/SaasAdminShell";
import { getSession, isSuperAdmin } from "@/lib/auth-session";

export default async function SaasAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !isSuperAdmin(session)) {
    redirect("/admin/login");
  }

  return (
    <SaasAdminShell user={{ name: session.name, email: session.email }}>
      {children}
    </SaasAdminShell>
  );
}

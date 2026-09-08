import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import { getAdminSettings } from "@/lib/data/settings";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.barbershopId) redirect("/admin/login");
  const initialSettings = await getAdminSettings(session.barbershopId);
  return <SettingsForm initialSettings={initialSettings} barbershopId={session.barbershopId} />;
}

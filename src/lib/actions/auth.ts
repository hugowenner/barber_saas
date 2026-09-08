"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth-session";

export type LoginState = { error: string } | null;

// Dummy hash used to prevent timing-based user enumeration
const DUMMY_HASH = "$2b$12$GhvMmNVjRW29ulnudl.LbuAnCX4pVpQ1sEWkPdA4AaaI0gl1MgJpm";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "E-mail e senha são obrigatórios." };
  }

  const admin = await db.admin.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      barbershopId: true,
      passwordHash: true,
      barbershop: { select: { plan: true, status: true } },
    },
  });

  // Always run bcrypt compare to prevent timing-based enumeration
  const hashToCheck = admin?.passwordHash ?? DUMMY_HASH;
  const valid = await bcrypt.compare(password, hashToCheck);

  if (!admin || !admin.passwordHash || !valid) {
    return { error: "E-mail ou senha inválidos." };
  }

  // Regular admins must belong to an active barbershop
  if (admin.role !== "SUPER_ADMIN") {
    if (!admin.barbershopId || !admin.barbershop) {
      return { error: "Conta não vinculada a uma barbearia." };
    }
    if (admin.barbershop.status === "SUSPENDED") {
      return { error: "Esta barbearia está suspensa. Entre em contato com o suporte." };
    }
    if (admin.barbershop.status === "CANCELLED") {
      return { error: "Esta conta foi cancelada. Entre em contato com o suporte." };
    }
  }

  const token = await signSession({
    sub: admin.id,
    email: admin.email,
    name: admin.name ?? "Administrador",
    role: admin.role,
    barbershopId: admin.barbershopId ?? null,
    barbershopPlan: admin.barbershop?.plan ?? null,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions(7 * 24 * 60 * 60));

  // Route SUPER_ADMIN to the platform panel; everyone else to the shop panel
  if (admin.role === "SUPER_ADMIN") {
    redirect("/saas-admin/dashboard");
  } else {
    redirect("/admin/dashboard");
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

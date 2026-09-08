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
    select: { id: true, email: true, name: true, role: true, barbershopId: true, passwordHash: true },
  });

  // Always run bcrypt compare to prevent timing-based enumeration
  const hashToCheck = admin?.passwordHash ?? DUMMY_HASH;
  const valid = await bcrypt.compare(password, hashToCheck);

  if (!admin || !admin.passwordHash || !valid || !admin.barbershopId) {
    return { error: "E-mail ou senha inválidos." };
  }

  const token = await signSession({
    sub: admin.id,
    email: admin.email,
    name: admin.name ?? "Administrador",
    role: admin.role,
    barbershopId: admin.barbershopId,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions(7 * 24 * 60 * 60));

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AdminRole, BarbershopPlan } from "@prisma/client";

export const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionPayload {
  sub: string;           // admin.id
  email: string;
  name: string;
  role: AdminRole;
  barbershopId: string | null;        // null for SUPER_ADMIN
  barbershopPlan: BarbershopPlan | null; // null for SUPER_ADMIN
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET env var is not set");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySession(token);
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

/** True only for the platform super-administrator. */
export function isSuperAdmin(session: SessionPayload | null): boolean {
  return session?.role === "SUPER_ADMIN";
}

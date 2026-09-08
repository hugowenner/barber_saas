import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET;

interface TokenPayload {
  role?: string;
}

async function decodeToken(token: string): Promise<TokenPayload | null> {
  try {
    if (!AUTH_SECRET) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // ── /admin/login — always public ─────────────────────────────────────────
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const isAdminRoute   = pathname.startsWith("/admin");
  const isSaasRoute    = pathname.startsWith("/saas-admin");

  if (!isAdminRoute && !isSaasRoute) return NextResponse.next();

  // ── Require valid JWT for both /admin/* and /saas-admin/* ────────────────
  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return redirectToLogin(request);
  }

  const payload = await decodeToken(token);
  if (!payload) {
    return redirectToLogin(request);
  }

  const isSuperAdmin = payload.role === "SUPER_ADMIN";

  // ── /saas-admin/*: SUPER_ADMIN only ──────────────────────────────────────
  if (isSaasRoute) {
    if (!isSuperAdmin) {
      // Regular admin tried to access the platform panel
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── /admin/*: any authenticated user, but redirect SUPER_ADMIN out ───────
  if (isAdminRoute) {
    if (isSuperAdmin) {
      // SUPER_ADMIN has no barbershop — send to platform panel
      return NextResponse.redirect(new URL("/saas-admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/saas-admin/:path*"],
};

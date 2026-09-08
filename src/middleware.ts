import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET;

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Only guard /admin/* routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Login page is always public
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get("admin_session")?.value;
  if (!token) return redirectToLogin(request);

  try {
    if (!AUTH_SECRET) throw new Error("AUTH_SECRET not set");
    await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET));
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

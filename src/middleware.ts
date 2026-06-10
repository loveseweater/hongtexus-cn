import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: protect with auth
  // Note: /admin pages and /api/admin routes both need admin protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (
      pathname === "/admin/login" ||
      pathname.startsWith("/api/admin/auth")
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const decoded = JSON.parse(
        Buffer.from(token, "base64").toString("utf-8")
      );

      if (!decoded.authenticated || decoded.expiresAt < Date.now()) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Non-admin routes: use next-intl locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip static files, internal Next.js paths, and API routes (handled by Pages Functions)
    "/((?!_next/static|_next/image|favicon.ico|images/|api/).*)",
  ],
};

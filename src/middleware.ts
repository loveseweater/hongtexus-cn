import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin page routes: protect with auth
  // API routes are excluded - they handle auth themselves
  if (pathname.startsWith("/admin") && !pathname.startsWith("/api/")) {
    if (pathname === "/admin/login") {
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

  // Non-admin routes: use next-intl locale routing (ja/ru added)
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip API routes (handled by route handlers), static files, and internal paths
    "/((?!api/|_next/static|_next/image|favicon.ico|images/|sitemap.xml|robots.txt).*)",
  ],
};

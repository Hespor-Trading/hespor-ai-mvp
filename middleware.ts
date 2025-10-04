import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public: "/", "/connect", "/auth/*", "/terms", "/privacy", ads endpoints, and static assets
 * Private: everything else (e.g. "/dashboard")
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // static & internals
  const isStatic = /\.[a-z0-9]+$/i.test(pathname);
  if (
    isStatic ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // public routes
  const publicPaths = new Set<string>([
    "/",
    "/connect",                // allow first hop after login
    "/terms",
    "/privacy",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/verify/pending",
    "/auth/callback",
    "/api/ads/start",
    "/api/ads/callback",
  ]);

  const isAuth = pathname === "/auth" || pathname.startsWith("/auth/");
  const isAds = pathname.startsWith("/api/ads/start") || pathname.startsWith("/api/ads/callback");

  if (publicPaths.has(pathname) || isAuth || isAds) {
    return NextResponse.next();
  }

  // session cookie (when present)
  const hasSession =
    Boolean(req.cookies.get("sb-access-token")?.value) ||
    Boolean(req.cookies.get("supabase-auth-token")?.value);

  // block private pages without a session
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

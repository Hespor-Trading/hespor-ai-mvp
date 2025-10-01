import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Central auth gate.
 * - Public: "/", "/auth/*", Ads auth endpoints, static assets
 * - Private: "/connect", "/dashboard", and everything else not listed in `publicPaths`
 *
 * Logic:
 * - If NO Supabase session cookie -> redirect to /auth/sign-in (except public paths)
 * - If logged in -> allow
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that should NOT require auth
  const publicPaths = new Set<string>([
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/verify/pending",
    "/auth/callback",
    "/api/ads/start",
    "/api/ads/callback",
  ]);

  // Allow all /auth/* and /api/ads/* subpaths
  const isAuthPath = pathname === "/auth" || pathname.startsWith("/auth/");
  const isAdsAuthApi =
    pathname.startsWith("/api/ads/start") ||
    pathname.startsWith("/api/ads/callback");

  const isExplicitPublic = publicPaths.has(pathname) || isAuthPath || isAdsAuthApi;

  // Detect Supabase session (support both modern and legacy cookie names)
  // @supabase/ssr sets: sb-access-token / sb-refresh-token
  // Legacy Auth Helpers may set: supabase-auth-token (JSON array string)
  const hasSession =
    Boolean(req.cookies.get("sb-access-token")?.value) ||
    Boolean(req.cookies.get("supabase-auth-token")?.value);

  // If not logged in and trying to access a private path -> redirect to /auth/sign-in
  if (!isExplicitPublic && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("redirectedFrom", pathname); // optional breadcrumb
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Exclude Next.js internals and favicon from middleware
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};

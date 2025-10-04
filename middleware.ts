import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware
 * - Public: "/", "/connect", "/auth/*", "/terms", "/privacy", Ads auth endpoints,
 *           and ANY static asset (images/css/js/fonts/etc.)
 * - Private: everything else (e.g., "/dashboard")
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Always let static assets & Next internals through
  const isStaticAsset = /\.[a-z0-9]+$/i.test(pathname);
  if (
    isStaticAsset ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // 2) Public routes
  const publicPaths = new Set<string>([
    "/",
    "/connect", // allow landing after login to avoid edge cookie race
    "/terms",
    "/privacy",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/verify/pending",
    "/auth/callback",
    "/api/ads/start",
    "/api/ads/callback",
  ]);
  const isAuthPath = pathname === "/auth" || pathname.startsWith("/auth/");
  const isAdsAuthApi =
    pathname.startsWith("/api/ads/start") ||
    pathname.startsWith("/api/ads/callback");

  const isExplicitPublic =
    publicPaths.has(pathname) || isAuthPath || isAdsAuthApi;

  // 3) Supabase session cookie (when present)
  const hasSession =
    Boolean(req.cookies.get("sb-access-token")?.value) ||
    Boolean(req.cookies.get("supabase-auth-token")?.value);

  // 4) If private and no session -> redirect to sign-in
  if (!isExplicitPublic && !hasSession) {
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

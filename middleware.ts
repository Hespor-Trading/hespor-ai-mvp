import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public: "/", "/auth/*", "/terms", "/privacy", ads auth endpoints, and static assets
 * Private: "/connect", "/dashboard" (and other non-public pages)
 *
 * Session detection supports multiple cookie names used by Supabase.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Always let static assets / Next internals through
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
  const isAuthPath = pathname === "/auth" || pathname.startsWith("/auth/");
  const isAdsAuthApi =
    pathname.startsWith("/api/ads/start") ||
    pathname.startsWith("/api/ads/callback");

  const isPublic =
    pathname === "/" ||
    pathname === "/terms" ||
    pathname === "/privacy" ||
    isAuthPath ||
    isAdsAuthApi;

  // 3) Robust Supabase session detection
  const hasSession =
    Boolean(req.cookies.get("sb-access-token")?.value) || // @supabase/ssr
    Boolean(req.cookies.get("supabase-auth-token")?.value) || // auth-helpers legacy
    Boolean(req.cookies.get("sb:token")?.value); // some setups

  // 4) Protect private routes when not signed in
  if (!isPublic && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // 5) If Ads just connected, let them into /dashboard even if redirect chain continues
  const adsConnected = req.cookies.get("ads_connected")?.value === "1";
  if (pathname.startsWith("/dashboard") && adsConnected) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

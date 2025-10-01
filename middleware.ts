import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware
 * - Public: "/", "/auth/*", "/terms", "/privacy", Ads auth endpoints, and ANY static asset (e.g. .png, .svg, .css, .js)
 * - Private: everything else (e.g. /connect, /dashboard)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Always let static assets pass (logo, images, css, js, fonts, etc.)
  //    Example: "/hespor-logo.png" must not be intercepted.
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

  // 2) Public routes that never require auth
  const publicPaths = new Set<string>([
    "/",
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

  // 3) Detect Supabase session cookie
  const hasSession =
    Boolean(req.cookies.get("sb-access-token")?.value) ||
    Boolean(req.cookies.get("supabase-auth-token")?.value);

  // 4) If the path is private and user is not logged in -> send to sign-in
  if (!isExplicitPublic && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next internals; static assets are handled above.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Public routes (never blocked) */
const PUBLIC_PATHS = new Set<string>([
  "/",                  // landing
  "/signin",            // sign in page
  "/signup",            // sign up page (if you have it)
  "/auth",              // allow /auth/* if you use it
  "/api/ads/callback",  // Amazon Ads OAuth redirect
  "/api/devlogin",      // dev login endpoint (this file below)
]);

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/ads/")) return true;
  return false;
}

/** Detect a logged-in session (dev: hespor_auth cookie) */
function isLoggedIn(req: NextRequest) {
  const c = req.cookies;
  // NextAuth cookies
  if (c.get("__Secure-next-auth.session-token") || c.get("next-auth.session-token")) return true;
  // Supabase cookies
  if (c.get("sb-access-token") || c.get("sb:token")) return true;
  // Dev/custom cookie
  if (c.get("hespor_auth")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // Allow public routes
  if (isPublic(pathname)) return NextResponse.next();

  // Everything else requires login (including /connect and /dashboard)
  if (!isLoggedIn(req)) {
    const to = url.clone();
    to.pathname = "/signin";
    const brand = url.searchParams.get("brand") || "DECOGAR";
    to.searchParams.set("brand", brand);
    to.searchParams.set("next", pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
    return NextResponse.redirect(to);
  }

  // If logged in and heading to /dashboard, enforce Ads connection only
  if (pathname.startsWith("/dashboard")) {
    const ads = req.cookies.get("ads_connected")?.value;
    if (ads !== "1") {
      const go = url.clone();
      go.pathname = "/connect";
      go.searchParams.set("brand", url.searchParams.get("brand") || "DECOGAR");
      go.searchParams.set("need", "ads");
      return NextResponse.redirect(go);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };

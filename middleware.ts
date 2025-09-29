Totally get it. We’re not touching your Sign In / Sign Up code or UI at all. The only thing that can “hide” them is middleware that redirects too aggressively. Here’s the clean, copy-paste fix plus exactly how your external “Connect now” button should link.

Step 1 — Use this middleware (keeps your Sign In/Sign Up pages exactly as they are)

Replace your middleware.ts with this:

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public (never blocked) routes — your auth pages & the Ads OAuth callback
 * Keep these so your existing sign-in / sign-up UI shows exactly as-is.
 */
const PUBLIC_PATHS = new Set<string>([
  "/",                  // your landing page
  "/signin",            // your existing sign-in page
  "/signup",            // your existing sign-up page
  "/auth",              // if you use /auth/* routes (keep the wildcard below)
  "/api/ads/callback",  // must be public for Amazon redirect
]);

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/auth/")) return true;       // allow /auth/*
  if (pathname.startsWith("/api/ads/")) return true;    // allow /api/ads/*
  return false;
}

/** Detect your logged-in session (update names to match your auth lib if needed) */
function isLoggedIn(req: NextRequest) {
  const c = req.cookies;
  // NextAuth cookies
  if (c.get("__Secure-next-auth.session-token") || c.get("next-auth.session-token")) return true;
  // Supabase cookies
  if (c.get("sb-access-token") || c.get("sb:token")) return true;
  // Custom cookie (rename if yours is different)
  if (c.get("hespor_auth")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // Always allow public routes (auth pages & OAuth callback)
  if (isPublic(pathname)) return NextResponse.next();

  // Require login for everything else (including /connect and /dashboard)
  if (!isLoggedIn(req)) {
    const to = url.clone();
    to.pathname = "/signin";
    // preserve brand and where the user was going
    const brand = url.searchParams.get("brand") || "DECOGAR";
    to.searchParams.set("brand", brand);
    to.searchParams.set("next", pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
    return NextResponse.redirect(to);
  }

  // If logged in and heading to dashboard, enforce Ads connection only
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

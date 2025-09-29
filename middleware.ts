// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes (never blocked)
function isPublic(pathname: string) {
  // landing and all auth pages (sign-in, sign-up, reset, callbacks)
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth/")) return true;
  // Ads OAuth callback must be public
  if (pathname.startsWith("/api/ads/")) return true;
  return false;
}

// Detect logged-in session (Supabase cookies)
function isLoggedIn(req: NextRequest) {
  const c = req.cookies;
  // Supabase sets one or both of these
  if (c.get("sb-access-token") || c.get("sb:token")) return true;
  // (Optional) if you also mint a custom cookie:
  if (c.get("hespor_auth")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Always allow public routes
  if (isPublic(path)) return NextResponse.next();

  // Require login for /connect and /dashboard (and anything else non-public)
  const authed = isLoggedIn(req);
  if (!authed) {
    const to = url.clone();
    to.pathname = "/auth/sign-in";
    // preserve where they were going (e.g., /connect)
    to.searchParams.set(
      "next",
      path + (url.search ? `?${url.searchParams.toString()}` : "")
    );
    return NextResponse.redirect(to);
  }

  // If logged in and heading to /dashboard, enforce Ads connection only
  if (path.startsWith("/dashboard")) {
    const ads = req.cookies.get("ads_connected")?.value;
    if (ads !== "1") {
      const go = url.clone();
      go.pathname = "/connect";
      return NextResponse.redirect(go);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };

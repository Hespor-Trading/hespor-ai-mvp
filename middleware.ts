import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protects app routes, but lets users into /dashboard if Ads just connected
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths
  const publicPaths = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/verify/pending",
    "/auth/callback",
    "/api/ads/start",
    "/api/ads/callback",
    "/api/ads/status",
    "/api/auth/resend",
    "/api/stripe/checkout",
  ];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If we just connected Ads, callback set this cookie:
  const adsConnected = req.cookies.get("ads_connected")?.value === "1";

  // If user tries to access /dashboard and we have the recent connection cookie,
  // do NOT bounce them back to /connect.
  if (pathname.startsWith("/dashboard") && adsConnected) {
    return NextResponse.next();
  }

  // Basic auth presence check (Supabase sets sb-access-token cookie when signed in)
  // If you use a different auth, adjust this.
  const hasSession =
    !!req.cookies.get("sb-access-token") || !!req.cookies.get("sb:token");

  if (!hasSession && !pathname.startsWith("/auth")) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  // Optional: if you still want to force Connect before Dashboard:
  // we now base "connected" on a lightweight status API instead of guessing here.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};

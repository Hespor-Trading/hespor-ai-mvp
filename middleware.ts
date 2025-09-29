// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add every publicly accessible path here (no auth required)
const PUBLIC_PATHS = new Set<string>([
  "/",                  // landing
  "/signin",
  "/signup",
  "/auth",              // if you use a catch-all like /auth/*
  "/connect",           // keep connect public if you want users to auth after
  "/api/ads/callback",  // must stay public for OAuth redirect
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // allow subpaths like /auth/*, /api/ads/*
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/ads/")) return true;
  return false;
}

// Try to detect a signed-in session for common providers
function isAuthed(req: NextRequest) {
  const cookies = req.cookies;
  // NextAuth:
  if (cookies.get("next-auth.session-token") || cookies.get("__Secure-next-auth.session-token")) return true;
  // Supabase:
  if (cookies.get("sb-access-token") || cookies.get("sb:token")) return true;
  // Your custom cookie (adjust the name if you set one):
  if (cookies.get("hespor_auth")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // Always allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Require sign-in for everything else (e.g., /dashboard)
  if (!isAuthed(req)) {
    const redirect = url.clone();
    redirect.pathname = "/signin";
    // preserve 'brand' so you can flow back after login
    const b = url.searchParams.get("brand") || "DECOGAR";
    redirect.searchParams.set("brand", b);
    redirect.searchParams.set("next", url.pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
    return NextResponse.redirect(redirect);
  }

  // If signed in and heading to /dashboard, ensure Ads is connected
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

export const config = {
  // Apply to all routes so we can allow/deny precisely above
  matcher: ["/:path*"],
};

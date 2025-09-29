// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isPublic(pathname: string) {
  // landing + ALL auth pages + Ads OAuth callback
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/ads/")) return true;
  return false;
}

function isLoggedIn(req: NextRequest) {
  const c = req.cookies;
  // Supabase cookies (one or both)
  if (c.get("sb-access-token") || c.get("sb:token")) return true;
  // (optional) your own cookie if you ever set one
  if (c.get("hespor_auth")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Always allow public routes
  if (isPublic(path)) return NextResponse.next();

  // Everything else (incl. /connect, /dashboard) needs login
  if (!isLoggedIn(req)) {
    const to = url.clone();
    to.pathname = "/auth/sign-in";
    to.searchParams.set("next", path + (url.search ? `?${url.searchParams.toString()}` : ""));
    return NextResponse.redirect(to);
  }

  // If logged in and going to dashboard, require Ads connect
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

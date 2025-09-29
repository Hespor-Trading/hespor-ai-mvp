import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isPublic(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth/")) return true;     // sign-in, sign-up, reset, callback
  if (pathname.startsWith("/api/ads/")) return true;  // Ads OAuth callback
  return false;
}

function isLoggedIn(req: NextRequest) {
  const c = req.cookies;
  // Supabase cookies (one or both)
  if (c.get("sb-access-token") || c.get("sb:token")) return true;
  // (optional) custom cookie
  if (c.get("hespor_auth")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  if (isPublic(path)) return NextResponse.next();

  if (!isLoggedIn(req)) {
    const to = url.clone();
    to.pathname = "/auth/sign-in";
    to.searchParams.set("next", path + (url.search ? `?${url.searchParams.toString()}` : ""));
    return NextResponse.redirect(to);
  }

  if (path.startsWith("/dashboard")) {
    const ads = req.cookies.get("ads_connected")?.value;
    if (ads !== "1") return NextResponse.redirect(new URL("/connect", url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };

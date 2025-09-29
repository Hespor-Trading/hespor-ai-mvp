// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublic = (p: string) =>
  p === "/" || p.startsWith("/auth/") || p.startsWith("/api/ads/");

const isLoggedIn = (req: NextRequest) => {
  const c = req.cookies;
  return !!(c.get("sb-access-token") || c.get("sb:token") || c.get("hespor_auth"));
};

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

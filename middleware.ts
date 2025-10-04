import { NextResponse, NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset",
  "/auth/callback",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;                  // allow APIs (no auth loops)
  if (pathname.startsWith("/_next/")) return true;                 // next assets
  if (pathname.startsWith("/favicon")) return true;
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json)$/.test(pathname)) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Always try to refresh session so cookies stay valid
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // 1) If NOT logged in and hitting a protected path -> go to sign-in (preserve `next`)
  if (!session && !isPublicPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("next", pathname + req.nextUrl.search); // keep next
    return NextResponse.redirect(url);
  }

  // 2) If logged in and visits a public auth page -> send them to /connect (so flow continues)
  if (session && (pathname === "/auth/sign-in" || pathname === "/auth/sign-up" || pathname === "/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/connect";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)|sitemap.xml|robots.txt).*)",
  ],
};

import { NextResponse, NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset",
  "/auth/callback",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/legal")) return true; // any nested legal route
  // allow static & api without auth loops
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|txt|xml|json)$/.test(pathname)) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // refresh session cookies if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname, search } = req.nextUrl;
  const isPublic = isPublicPath(pathname);

  // 1) Not logged in & protected route -> go to sign-in, preserving "next"
  if (!session && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.search = search
      ? `?next=${encodeURIComponent(pathname + search)}`
      : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // 2) Logged in and on "entry" auth pages -> send to /connect (do NOT redirect /auth/callback or reset pages)
  if (
    session &&
    (pathname === "/auth/sign-in" || pathname === "/auth/sign-up" || pathname === "/auth/register")
  ) {
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

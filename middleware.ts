import { NextResponse, NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/auth/sign-in",
  "/auth/callback",
  "/auth/register",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
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

  // try refresh session (important so cookies stay valid)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname, search } = req.nextUrl;
  const isPublic = isPublicPath(pathname);

  // 1) If NOT logged in and route is protected → go to sign-in with "next"
  if (!session && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.search = search ? `?next=${encodeURIComponent(pathname + search)}` : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // 2) If logged in and on an auth page → send to /connect
  if (session && pathname.startsWith("/auth")) {
    const url = req.nextUrl.clone();
    url.pathname = "/connect";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return res;
}

// apply to all routes except Next.js internal assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)|sitemap.xml|robots.txt).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Let static assets pass straight through (fixes /favicon.png 404)
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json|css|js|map)$/i.test(
      pathname
    );

  if (isStatic) {
    return NextResponse.next();
  }

  // --- your existing middleware rules (keep as-is or minimal) ---
  return NextResponse.next();
}

export const config = {
  // Exclude static files from matching entirely (belt + suspenders)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json|css|js|map)).*)",
  ],
};

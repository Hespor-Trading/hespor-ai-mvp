import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets through
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json|css|js|map)$/i.test(pathname);
  if (isStatic) return NextResponse.next();

  // Public marketing root stays open
  const isPublicMarketing = pathname === "/" || pathname.startsWith("/terms") || pathname.startsWith("/privacy");
  if (isPublicMarketing) return NextResponse.next();

  // Stripe webhook must remain public
  if (pathname.startsWith("/api/stripe/webhook")) return NextResponse.next();

  const isProtected = pathname.startsWith("/app") || pathname.startsWith("/api");
  if (!isProtected) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (user) return res;

  // APIs return 401; pages redirect to sign-in
  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/auth/sign-in";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json|css|js|map)).*)",
  ],
};

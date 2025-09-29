// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Only guard dashboard routes:
  if (pathname.startsWith("/dashboard")) {
    const adsCookie = req.cookies.get("ads_connected")?.value;
    if (adsCookie !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/connect";
      // keep brand if present
      const brand = searchParams.get("brand") || "DECOGAR";
      url.searchParams.set("brand", brand);
      url.searchParams.set("need", "ads");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

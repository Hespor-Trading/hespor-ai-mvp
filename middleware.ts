// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  if (pathname.startsWith("/dashboard")) {
    const ads = req.cookies.get("ads_connected")?.value;
    if (ads !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/connect";
      url.searchParams.set("brand", searchParams.get("brand") || "DECOGAR");
      url.searchParams.set("need", "ads");
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };

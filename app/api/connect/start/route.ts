import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // don't prerender this route

export async function GET(req: Request) {
  // Make absolute URL based on the current request
  const redirectTo = new URL("/dashboard", req.url);

  const res = NextResponse.redirect(redirectTo);

  // mark fake connections (MVP)
  res.cookies.set("ads_ok", "1", { path: "/", httpOnly: false, maxAge: 60 * 60 * 24 * 30 });
  res.cookies.set("sp_ok",  "1", { path: "/", httpOnly: false, maxAge: 60 * 60 * 24 * 30 });

  return res;
}

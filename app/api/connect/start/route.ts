import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect("/dashboard");
  // mark “connected” with a simple cookie (MVP)
  res.cookies.set("ads_ok", "1", { path: "/", httpOnly: false, maxAge: 60*60*24*30 });
  res.cookies.set("sp_ok", "1",  { path: "/", httpOnly: false, maxAge: 60*60*24*30 });
  return res;
}

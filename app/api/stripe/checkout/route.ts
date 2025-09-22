import { NextResponse } from "next/server";

export async function POST() {
  // Temporary stub (no Stripe yet)
  return NextResponse.json({
    url: "/dashboard", // pretend checkout succeeded
  });
}

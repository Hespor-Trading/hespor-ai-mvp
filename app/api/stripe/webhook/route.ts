import { NextResponse } from "next/server";

export async function POST() {
  // Temporary stub (no Stripe webhook yet)
  return NextResponse.json({ received: true });
}

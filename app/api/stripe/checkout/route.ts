import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const price = process.env.STRIPE_PRICE_ID_49;
    if (!price) return NextResponse.json({ error: "No price configured" }, { status: 400 });

    const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${base}/subscription?status=success`,
      cancel_url: `${base}/subscription?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "stripe_error" }, { status: 500 });
  }
}

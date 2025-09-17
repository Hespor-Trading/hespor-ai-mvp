import { NextResponse } from "next/server";
import Stripe from "stripe";

// keep Stripe client simple to avoid TS unions
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));

  // Expect these from the dashboard form
  const brand = String(body.brand || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const acos = String(body.acos ?? "25");           // break-even ACOS %
  const asin = String(body.asin ?? "").toUpperCase();

  if (!brand) {
    return NextResponse.json({ ok: false, error: "Brand is required" }, { status: 400 });
  }

  const base =
    process.env.NEXT_PUBLIC_APP_URL || "https://hespor-ai-mvp-eight.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID_49!, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${base}/dashboard?paid=1&brand=${brand}`,
    cancel_url: `${base}/dashboard`,
    client_reference_id: brand, // we’ll use this in the webhook
    metadata: { brand, acos, asin },
  });

  return NextResponse.json({ url: session.url });
}

import { NextResponse } from "next/server";
import Stripe from "stripe";

// No apiVersion here to avoid TS union mismatch
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { acos, asin } = await req.json().catch(() => ({ acos: "25", asin: "" }));

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://hespor-ai-mvp-eight.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID_49!, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${base}/dashboard?paid=1`,
    cancel_url: `${base}/dashboard`,
    metadata: { acos, asin },
  });

  return NextResponse.json({ url: session.url });
}

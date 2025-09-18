import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // no apiVersion

export async function POST(req: Request) {
  try {
    const { brand, acos, asin } = await req.json();
    if (!brand) return NextResponse.json({ error: "Missing brand" }, { status: 400 });

    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID_49!, quantity: 1 }],
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/cancel`,
      metadata: { brand, acos: String(acos ?? ""), asin: String(asin ?? "") },
    });

    if (!session.url) return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 500 });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}

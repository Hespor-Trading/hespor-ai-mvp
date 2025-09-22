import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const SECRET = process.env.STRIPE_SECRET_KEY;
    const PRICE_ID = process.env.STRIPE_PRICE_ID_MONTHLY;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!SECRET || !PRICE_ID) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID_MONTHLY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(SECRET, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${APP_URL}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/dashboard?checkout=canceled`,
      billing_address_collection: "auto",
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Stripe checkout failed", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

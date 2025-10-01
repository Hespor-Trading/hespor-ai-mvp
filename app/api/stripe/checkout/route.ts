import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const SECRET = process.env.STRIPE_SECRET_KEY;
    // Accept either name you’ve used
    const PRICE =
      process.env.STRIPE_PRICE_ID ?? process.env.STRIPE_PRICE_ID_49;

    if (!SECRET || !PRICE) {
      return NextResponse.json(
        { error: "missing_env", message: "Missing Stripe envs" },
        { status: 500 }
      );
    }

    // Do not pass apiVersion so TypeScript union types don’t conflict
    const stripe = new Stripe(SECRET);

    // Optional overrides (successUrl/cancelUrl) from client
    const body = await req.json().catch(() => ({} as any));
    const base =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://app.hespor.com";

    const successUrl = body?.successUrl || `${base}/success`;
    const cancelUrl = body?.cancelUrl || `${base}/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: "stripe_failed", message: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

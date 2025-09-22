import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sk = process.env.STRIPE_SECRET_KEY;
  if (!sig || !secret || !sk) return NextResponse.json({ error: "Missing Stripe webhook envs" }, { status: 500 });

  const raw = await req.text();
  const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid signature: " + err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: mark user's plan as "pro" in your datastore (lookup by session.customer or customer_email)
    console.log("Stripe PRO enabled for session:", session.id);
  }

  return NextResponse.json({ received: true });
}

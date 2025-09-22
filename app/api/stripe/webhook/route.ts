import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sk = process.env.STRIPE_SECRET_KEY;

  if (!secret || !sk) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET / STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing Stripe-Signature" }, { status: 400 });

  const raw = await req.text(); // raw body required

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: mark the user/account as "Pro" in your DB using session.customer / client_reference_id
    console.log("Checkout complete:", session.id);
  }

  return NextResponse.json({ received: true });
}

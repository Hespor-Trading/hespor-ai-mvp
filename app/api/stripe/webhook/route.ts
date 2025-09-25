import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const sk = process.env.STRIPE_SECRET_KEY;
  const wh = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sk || !wh) {
    return NextResponse.json(
      { error: "Missing Stripe envs (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)" },
      { status: 500 }
    );
  }

  // Read the raw request body for webhook signature verification
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  // ✅ No apiVersion passed (avoids TS union mismatch)
  const stripe = new Stripe(sk);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, wh);
  } catch (err: any) {
    return NextResponse.json(
      { error: "invalid_signature", message: err?.message || "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle a few common events (no-ops for MVP)
  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "invoice.payment_succeeded":
      // TODO: mark user/tenant as paid in your DB
      break;
    default:
      // ignore others
      break;
  }

  return NextResponse.json({ received: true });
}

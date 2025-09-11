import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// No apiVersion here to avoid TS union mismatch
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(
      `Webhook signature verification failed: ${err.message}`,
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("✅ checkout.session.completed");
      break;
    case "invoice.payment_succeeded":
      console.log("✅ invoice.payment_succeeded");
      break;
    case "customer.subscription.deleted":
      console.log("⚠️ customer.subscription.deleted");
      break;
    default:
      console.log(`ℹ️ unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";

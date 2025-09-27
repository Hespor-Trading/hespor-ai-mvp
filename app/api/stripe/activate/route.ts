// app/api/stripe/activate/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) return new Response("Missing session_id", { status: 400 });

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const uid = (session.metadata as any)?.uid;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

  if (!uid || !customerId) {
    return NextResponse.redirect(new URL("/dashboard?upgrade=missing", process.env.NEXT_PUBLIC_APP_URL!));
  }

  // Store customer id and set plan=pro
  await sbAdmin.from("profiles").update({
    stripe_customer_id: customerId,
    plan: "pro",
  }).eq("id", uid);

  return NextResponse.redirect(new URL("/dashboard?upgrade=ok", process.env.NEXT_PUBLIC_APP_URL!));
}

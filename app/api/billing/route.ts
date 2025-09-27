// app/api/billing/route.ts
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
  const uid = url.searchParams.get("uid");
  if (!uid) return new Response("Missing uid", { status: 400 });

  const { data: prof, error } = await sbAdmin.from("profiles").select("stripe_customer_id").eq("id", uid).maybeSingle();
  if (error || !prof?.stripe_customer_id) {
    return NextResponse.redirect(new URL("/dashboard?billing=missing_customer", process.env.NEXT_PUBLIC_APP_URL!));
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: prof.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return NextResponse.redirect(portal.url, 302);
}

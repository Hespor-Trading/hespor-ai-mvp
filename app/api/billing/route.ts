// app/api/billing/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase environment not configured" }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sbAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
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

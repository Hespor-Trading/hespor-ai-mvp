import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PROVISIONER_URL = process.env.PROVISIONER_URL!;
const HMAC_SECRET = process.env.PROVISIONER_HMAC_SECRET!;

// helper to HMAC-sign the provisioner payload
function sign(body: string) {
  return crypto.createHmac("sha256", HMAC_SECRET).update(body).digest("hex");
}

export async function POST(req: Request) {
  const raw = await req.text();                // keep raw body for Stripe verification
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(
      `Webhook signature verification failed: ${err.message}`,
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    // you can still log other events if you like
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // pull back what we saved in checkout
  const brand = String(
    session.client_reference_id || session.metadata?.brand || ""
  )
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  const acosPct = Number(session.metadata?.acos ?? 25);
  const primaryASIN = String(session.metadata?.asin ?? "").toUpperCase();

  if (!brand) {
    return NextResponse.json({ ok: false, error: "Missing brand" }, { status: 400 });
  }

  // --- Build provisioner payload ---
  // NOTE: replace refresh tokens with your real envs if not already present.
  const payload = {
    brand,
    ads: {
      client_id: process.env.AMZN_ADS_CLIENT_ID!,
      client_secret: process.env.AMZN_ADS_CLIENT_SECRET!,
      refresh_token: process.env.AMZN_ADS_REFRESH_TOKEN!,     // add in Vercel if missing
      profile_id: "2819081650104503",
      api_region: "na",
    },
    spapi: {
      SP_LWA_CLIENT_ID: process.env.SPAPI_CLIENT_ID!,
      SP_LWA_CLIENT_SECRET: process.env.SPAPI_CLIENT_SECRET!,
      SP_REFRESH_TOKEN: process.env.SPAPI_REFRESH_TOKEN!,      // add in Vercel if missing
      SP_REGION: "na",
    },
    config: {
      breakEvenACOS: acosPct / 100,  // engine expects 0.25 not 25
      salePrice: 20,
      primaryASIN,
      thresholdUnits: 50,
    },
  };

  const body = JSON.stringify(payload);
  const hespSig = sign(body);

  const resp = await fetch(PROVISIONER_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hesp-signature": hespSig,
    },
    body,
  });

  const text = await resp.text();
  return NextResponse.json({ ok: true, upstreamStatus: resp.status, upstream: text });
}

// keep Node.js runtime for raw body behavior
export const runtime = "nodejs";

// app/api/provision/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Read the raw body once
    const raw = await req.text();

    // Optional HMAC check (only if PROVISIONER_HMAC_SECRET is set)
    const secret = process.env.PROVISIONER_HMAC_SECRET || "";
    if (secret) {
      const sigHeader = req.headers.get("x-hespor-signature") || "";
      const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
      const valid =
        sigHeader.length === digest.length &&
        crypto.timingSafeEqual(Buffer.from(sigHeader), Buffer.from(digest));
      if (!valid) {
        return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
      }
    }

    // Parse JSON after HMAC
    let body: any = {};
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    // Minimal validation
    if (!body?.brand) return NextResponse.json({ ok: false, error: "brand required" }, { status: 400 });
    const ads = body?.ads || {};
    const required = ["client_id", "client_secret", "refresh_token", "profile_id", "api_region"];
    for (const k of required) {
      if (!ads[k]) return NextResponse.json({ ok: false, error: `ads.${k} required` }, { status: 400 });
    }

    const url = process.env.PROVISIONER_URL;
    if (!url) return NextResponse.json({ ok: false, error: "PROVISIONER_URL not set" }, { status: 500 });

    // Call your Lambda Function URL
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(
      { upstreamStatus: upstream.status, ...data },
      { status: upstream.ok ? 200 : 502 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}

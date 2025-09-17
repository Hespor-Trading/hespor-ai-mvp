// app/api/provision/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function verifyHmac(req: NextRequest) {
  const secret = process.env.PROVISIONER_HMAC_SECRET || "";
  const sig = req.headers.get("x-hespor-signature") || "";
  if (!secret) return true; // allow if not set (dev)
  // Body is streamed; clone text for HMAC then reparse
  return req.text().then(raw => {
    const h = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const ok = crypto.timingSafeEqual(Buffer.from(h), Buffer.from(sig || "", "utf8"));
    return { ok, raw };
  });
}

export async function POST(req: NextRequest) {
  try {
    const check = await verifyHmac(req);
    if ("ok" in check && !check.ok) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }
    const raw = "raw" in check ? check.raw : await req.text();
    const body = JSON.parse(raw || "{}");

    // Minimal validation
    if (!body?.brand) return NextResponse.json({ ok: false, error: "brand required" }, { status: 400 });
    const ads = body?.ads || {};
    const required = ["client_id","client_secret","refresh_token","profile_id","api_region"];
    for (const k of required) if (!ads[k]) {
      return NextResponse.json({ ok: false, error: `ads.${k} required` }, { status: 400 });
    }

    const url = process.env.PROVISIONER_URL;
    if (!url) return NextResponse.json({ ok: false, error: "PROVISIONER_URL not set" }, { status: 500 });

    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));
    return NextResponse.json({ upstreamStatus: resp.status, ...data }, { status: resp.ok ? 200 : 502 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}

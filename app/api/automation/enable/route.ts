import { NextResponse } from "next/server";
import { lambda } from "@/lib/aws";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const fn = process.env.PROVISIONER_FUNCTION!;
    const client = lambda();
    const res = await client.send(
      new (await import("@aws-sdk/client-lambda")).InvokeCommand({
        FunctionName: fn,
        Payload: new TextEncoder().encode(JSON.stringify({ brand: process.env.HESPOR_DEFAULT_BRAND || "DECOGAR" })),
      })
    );
    return NextResponse.json({ ok: true, statusCode: res.StatusCode });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

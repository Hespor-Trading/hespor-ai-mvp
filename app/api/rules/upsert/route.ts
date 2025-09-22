import { NextRequest, NextResponse } from "next/server";
import { secrets } from "@/lib/aws";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const brand = (body.brand || "DECOGAR").toUpperCase();
    const rules = {
      breakEvenACOS: Number(body.acos || 25),
      inventoryCSV: `Inventory/${brand}.csv`,
      focus: { primaryASIN: String(body.asin || "B0EXAMPLE") },
      safety: { maxBidChangePct: 0.30, maxBudgetChangePct: 0.30 },
    };

    const sm = secrets();
    const name = `amazon-ads/rules/${brand}`;
    const Put = (await import("@aws-sdk/client-secrets-manager")).PutSecretValueCommand;
    const Create = (await import("@aws-sdk/client-secrets-manager")).CreateSecretCommand;

    await sm.send(new Put({ SecretId: name, SecretString: JSON.stringify(rules) })).catch(async (e: any) => {
      if (String(e?.name) === "ResourceNotFoundException") {
        await sm.send(new Create({ Name: name, SecretString: JSON.stringify(rules) }));
      } else throw e;
    });

    return NextResponse.json({ ok: true, name });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

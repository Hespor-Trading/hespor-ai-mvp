import { NextResponse } from "next/server";
import { s3 } from "@/lib/aws";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { brandFromQuery } from "@/lib/amazon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = process.env.HESPOR_S3_BUCKET || "hespor-ad-engine";

async function streamToString(stream: any) {
  if (stream?.getReader) {
    const reader = stream.getReader(); const chunks: Uint8Array[] = [];
    while (true) { const { value, done } = await reader.read(); if (done) break; if (value) chunks.push(value); }
    return new TextDecoder().decode(Buffer.concat(chunks as any));
  }
  return await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (c: any) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

export async function GET(req: Request) {
  try {
    const brand = brandFromQuery(new URL(req.url).search);
    const prefix = `applied/${brand}/`;
    const client = s3();

    const listed = await client.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }));
    const contents = listed.Contents || [];
    if (!contents.length) return NextResponse.json({ items: [], note: "No applied files yet." });

    contents.sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0));
    const latestKey = contents[0].Key!;
    const obj = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: latestKey }));
    const body = await streamToString(obj.Body);

    let json: any = {}; try { json = JSON.parse(body); } catch {}

    const items: Array<{ time: string; title: string; detail: string }> = [];
    const t = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});

    const up = json.bidAdjustments?.filter((x: any) => x.delta > 0) || [];
    const down = json.bidAdjustments?.filter((x: any) => x.delta < 0) || [];
    const paused = (json.stateChanges || []).filter((x: any) => x.newState === "paused");
    const negs = json.negatives || [];
    const budgets = json.campaignBudgetChanges || [];

    if (up.length) items.push({ time: t, title: "Raised bids on winners", detail: `Increased bids on ${up.length} strong keywords.` });
    if (down.length) items.push({ time: t, title: "Cut bids to reduce waste", detail: `Lowered bids on ${down.length} weak keywords.` });
    if (paused.length) items.push({ time: t, title: "Paused wasteful terms", detail: `Paused ${paused.length} terms with spend but no sales.` });
    if (negs.length) items.push({ time: t, title: "Blocked poor searches", detail: `Added ${negs.length} negatives to stop irrelevant spend.` });
    if (budgets.length) items.push({ time: t, title: "Raised budgets on profitable campaigns", detail: `+10% on ${budgets.length} campaigns with profit & stock.` });
    if (!items.length) items.push({ time: t, title: "Applied actions loaded", detail: `File: ${latestKey.split("/").pop()}` });

    return NextResponse.json({ items, key: latestKey });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to load actions", detail: String(e?.message || e) }, { status: 500 });
  }
}

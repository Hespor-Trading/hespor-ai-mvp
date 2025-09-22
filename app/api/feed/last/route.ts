import { NextResponse } from "next/server";
import { s3 } from "@/lib/aws";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = process.env.HESPOR_S3_BUCKET || "hespor-ad-engine";
// For now we use DECOGAR brand per your canonical layout; you can pass ?brand=NAME later.
const BRAND = process.env.HESPOR_DEFAULT_BRAND || "DECOGAR";
const PREFIX = `applied/${BRAND}/`;

async function streamToString(stream: ReadableStream | NodeJS.ReadableStream) {
  if ("getReader" in (stream as ReadableStream)) {
    // Web stream
    const reader = (stream as ReadableStream).getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return new TextDecoder().decode(Buffer.concat(chunks as any));
  } else {
    // Node stream
    const nodeStream = stream as NodeJS.ReadableStream;
    return await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      nodeStream.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      nodeStream.on("error", reject);
      nodeStream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  }
}

export async function GET() {
  try {
    const client = s3();

    // 1) Find newest applied file for the brand
    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: PREFIX })
    );
    const contents = listed.Contents || [];
    if (contents.length === 0) {
      return NextResponse.json({ items: [], note: "No applied files found yet." });
    }
    contents.sort((a, b) => {
      const aT = a.LastModified ? a.LastModified.getTime() : 0;
      const bT = b.LastModified ? b.LastModified.getTime() : 0;
      return bT - aT;
    });
    const latestKey = contents[0].Key!;
    // 2) Load file
    const obj = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: latestKey }));
    const body = await streamToString(obj.Body as any);

    // 3) Parse & humanize
    let json: any;
    try {
      json = JSON.parse(body);
    } catch {
      json = {};
    }

    // Expecting something like actions arrays; we’ll humanize common fields
    // If your applier writes a different shape, the fallback still shows a readable summary.
    const items: Array<{ time: string; title: string; detail: string }> = [];

    const appliedAt = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const pushItem = (title: string, detail: string) =>
      items.push({ time: appliedAt, title, detail });

    // Heuristics based on typical fields you described
    const bidUps = json.bidAdjustments?.filter((x: any) => x.delta && x.delta > 0) || [];
    if (bidUps.length) pushItem(
      "Raised bids on best sellers",
      `We raised bids on ${bidUps.length} strong keywords to capture more profitable traffic.`
    );

    const bidDowns = json.bidAdjustments?.filter((x: any) => x.delta && x.delta < 0) || [];
    if (bidDowns.length) pushItem(
      "Cut bids to reduce waste",
      `We lowered bids on ${bidDowns.length} underperforming keywords to stop overspending.`
    );

    const paused = (json.stateChanges || []).filter((x: any) => x.newState === "paused");
    if (paused.length) pushItem(
      "Paused wasteful terms",
      `We paused ${paused.length} keywords/targets that were spending without sales.`
    );

    const negatives = json.negatives || [];
    if (negatives.length) pushItem(
      "Blocked poor searches",
      `We added ${negatives.length} negatives so money doesn’t go to irrelevant searches.`
    );

    const budgets = json.campaignBudgetChanges || [];
    if (budgets.length) pushItem(
      "Increased budget on winners",
      `We raised budgets on ${budgets.length} campaigns that are profitable and well stocked.`
    );

    // Fallback if file doesn’t have those arrays
    if (!items.length) {
      pushItem("Applied actions processed", `Latest file: ${latestKey.split("/").pop()}`);
    }

    return NextResponse.json({ items, key: latestKey });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to load last applied actions", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}

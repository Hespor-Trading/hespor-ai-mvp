export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function streamToString(stream: any) {
  const chunks: any[] = [];
  for await (const chunk of stream as Readable) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function GET() {
  const Bucket = process.env.S3_BUCKET!;
  const Prefix = "applied/DECOGAR/"; // later: per client

  try {
    const listed = await s3.send(new ListObjectsV2Command({ Bucket, Prefix }));
    if (!listed.Contents || listed.Contents.length === 0) {
      return NextResponse.json({ items: ["No actions applied yet."] });
    }
    const Key = listed.Contents.sort(
      (a,b)=> (b.LastModified!.getTime() - a.LastModified!.getTime())
    )[0].Key!;
    const obj = await s3.send(new GetObjectCommand({ Bucket, Key }));
    const json = JSON.parse(await streamToString(obj.Body as any));

    const items: string[] = [];
    (json.success || []).forEach((x: any) => {
      if (x.type === "keywordBid") items.push(`Changed bid for keyword ${x.keywordText || x.id} to $${x.bid}.`);
      if (x.type === "negKeyword") items.push(`Added negative keyword “${x.keywordText}” (${x.matchType}).`);
      if (x.type === "campaignBudget") items.push(`Adjusted campaign budget ${x.campaignId} to $${x.budget}.`);
    });
    return NextResponse.json({ items: items.slice(0, 10) });
  } catch {
    return NextResponse.json({ items: ["(Could not read applied actions)"] });
  }
}

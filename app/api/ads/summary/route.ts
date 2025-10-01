import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGION = process.env.AWS_REGION || "ca-central-1";
const BUCKET = process.env.HESPOR_S3_BUCKET!;
const s3 = new S3Client({ region: REGION });

async function bodyToString(body: any): Promise<string> {
  if (!body) return "";
  // In Node 18+/Vercel, AWS SDK often provides a web ReadableStream with transformToString
  // @ts-ignore
  if (typeof body.transformToString === "function") {
    // @ts-ignore
    return await body.transformToString();
  }
  // Node.js Readable stream fallback
  return await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    body.on("data", (c: Buffer) => chunks.push(c));
    body.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    body.on("error", reject);
  });
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const brand = u.searchParams.get("brand") || "default";
  const range = u.searchParams.get("range") || "30d";

  try {
    // Look for any processed rollup file first; if none, we’ll return an empty summary
    const prefix = `ads/processed/${brand}/`;
    const list = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: 1 })
    );

    if (list.Contents && list.Contents.length > 0) {
      const key = list.Contents[0].Key!;
      const obj = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      const text = await bodyToString(obj.Body as any);
      const json = JSON.parse(text);
      return NextResponse.json({
        ...json,
        period: range,
      });
    }
  } catch (e) {
    // swallow and fall through to empty state
    console.error("summary route error:", e);
  }

  // Empty-state default
  return NextResponse.json({
    spend: 0,
    sales: 0,
    acos: null,
    orders: 0,
    ctr: null,
    period: range,
  });
}

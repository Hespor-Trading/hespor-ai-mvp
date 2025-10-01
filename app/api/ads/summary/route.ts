import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { readableStreamToBytes } from "node:stream/web";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REGION = process.env.AWS_REGION || "ca-central-1";
const BUCKET = process.env.HESPOR_S3_BUCKET!;

const s3 = new S3Client({ region: REGION });

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const brand = u.searchParams.get("brand") || "default";
  const range = u.searchParams.get("range") || "30d";

  // Look for any processed rollup file first; if none, look for a raw folder (return zeros)
  try {
    const prefix = `ads/processed/${brand}/`;
    const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: 1 }));
    if (list.Contents && list.Contents.length > 0) {
      // read the first rollups.json we find (you can refine date filtering later)
      const key = list.Contents[0].Key!;
      const obj = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      // @ts-ignore
      const bytes = await obj.Body?.transformToByteArray?.() || new Uint8Array();
      const json = JSON.parse(new TextDecoder().decode(bytes));
      return NextResponse.json({
        ...json,
        period: range,
      });
    }
  } catch (e) {
    // fallthrough to empty
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

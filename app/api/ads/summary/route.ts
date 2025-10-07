import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- S3 (optional rollup) ---
const REGION = process.env.AWS_REGION || "ca-central-1";
const BUCKET = process.env.HESPOR_S3_BUCKET || "";
const s3 = new S3Client({ region: REGION });

async function bodyToString(body: any): Promise<string> {
  if (!body) return "";
  // In Node 18+/Vercel, AWS SDK often gives a web ReadableStream with transformToString
  // @ts-ignore
  if (typeof body.transformToString === "function") {
    // @ts-ignore
    return await body.transformToString("utf-8");
  }
  // Node stream fallback
  return await new Promise((resolve, reject) => {
    let data = "";
    body.setEncoding?.("utf8");
    body.on?.("data", (chunk: string) => (data += chunk));
    body.on?.("end", () => resolve(data));
    body.on?.("error", reject);
  });
}

function parseRangeDays(range: string): number {
  const m = String(range || "").match(/^(\d+)d$/i);
  return m ? Math.max(1, parseInt(m[1], 10)) : 30;
}

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function tryS3Summary(brand: string, range: string) {
  if (!BUCKET) return null;
  try {
    const prefix = `ads/processed/${brand}/`;
    const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: 1 }));
    if (list.Contents && list.Contents.length > 0) {
      const key = list.Contents[0].Key!;
      const obj = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      const text = await bodyToString(obj.Body as any);
      const json = JSON.parse(text);
      return { ...json, period: range };
    }
  } catch (e) {
    console.error("summary: s3 rollup lookup failed:", e);
  }
  return null;
}

async function supabaseAggregate(user_id: string, days: number) {
  // We aggregate from ads_search_terms:
  //   sales := sum(sales14d)
  //   spend := sum(cost)
  //   orders := sum(purchases14d)
  //   acos := spend/sales * 100 (if sales > 0)
  const since = isoDay(new Date(Date.now() - days * 86400000));

  // Pull only the columns we need to keep payload small
  const { data, error } = await supabaseAdmin
    .from("ads_search_terms")
    .select("sales, cost, orders, day")
    .eq("user_id", user_id)
    .gte("day", since);

  if (error) throw error;

  let sales = 0;
  let spend = 0;
  let orders = 0;
  for (const r of data || []) {
    sales += Number(r.sales || 0);
    spend += Number(r.cost || 0);
    orders += Number(r.orders || 0);
  }
  const acos = sales > 0 ? Number(((spend / sales) * 100).toFixed(2)) : null;

  // CTR is not available from search_terms; return null (can compute later from an impressions-based dataset)
  return { sales, spend, orders, acos, ctr: null };
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const brand = u.searchParams.get("brand") || "default";
  const range = u.searchParams.get("range") || "30d";
  const days = parseRangeDays(range);

  // 1) First, if you have an S3 rollup, use it (fast path)
  const fromS3 = await tryS3Summary(brand, range);
  if (fromS3) return NextResponse.json(fromS3);

  // 2) Otherwise, aggregate live from Supabase for the current user
  try {
    // try cookie-auth first
    let user_id: string | null = null;
    try {
      const supabase = getSupabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      user_id = user?.id ?? null;
    } catch {}

    // allow explicit ?user_id override for service calls
    user_id = user_id || u.searchParams.get("user_id");

    if (!user_id) {
      // No user context; return empty state instead of 401 (UI-friendly)
      return NextResponse.json({
        spend: 0,
        sales: 0,
        acos: null,
        orders: 0,
        ctr: null,
        period: range,
      });
    }

    const agg = await supabaseAggregate(user_id, days);
    return NextResponse.json({
      ...agg,
      period: range,
    });
  } catch (e) {
    console.error("summary: supabase aggregate failed:", e);
    // UI-friendly empty state on error
    return NextResponse.json({
      spend: 0,
      sales: 0,
      acos: null,
      orders: 0,
      ctr: null,
      period: range,
    });
  }
}

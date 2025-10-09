// app/api/ads/report/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getAccessTokenForUser,
  getReportStatus,
  downloadReportFile,
} from "@/lib/ads/reports"; // use your existing helpers

type Row = {
  user_id: string;
  profile_id: string;
  day: string;          // YYYY-MM-DD
  campaign_id: string;
  ad_group_id: string;
  keyword_text: string;
  search_term: string;
  match_type: string;
  impressions: number;
  clicks: number;
  cost: number;
  orders: number;
  sales: number;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id") || "";
    const report_id = url.searchParams.get("report_id") || "";

    if (!user_id || !report_id) {
      return NextResponse.json({ ok: false, reason: "missing params" }, { status: 400 });
    }

    // Profile for user (needed to stamp profile_id into rows)
    const { data: prof, error: profErr } = await db
      .from("ads_profiles")
      .select("profile_id, country")
      .eq("user_id", user_id)
      .maybeSingle();
    if (profErr) throw profErr;
    if (!prof) return NextResponse.json({ ok: false, reason: "no-ads-profile" }, { status: 400 });

    const profile_id = prof.profile_id;
    const country = (prof.country || "NA").toUpperCase();

    const accessToken = await getAccessTokenForUser(user_id);
    if (!accessToken) return NextResponse.json({ ok: false, reason: "no-access-token" }, { status: 400 });

    // 1) Ask Amazon for status
    const status = await getReportStatus({ accessToken, reportId: report_id, region: country, profileId: profile_id });
    if (status === "PENDING" || status === "PROCESSING") {
      return NextResponse.json({ ok: false, status: "PENDING", reportId: report_id });
    }
    if (status !== "COMPLETED") {
      return NextResponse.json({ ok: false, status, reportId: report_id }, { status: 500 });
    }

    // 2) Download + parse
    const fileBuffer = await downloadReportFile({ accessToken, reportId: report_id, region: country, profileId: profile_id });
    // The report is GZIP_JSON per our request above:
    // If your helper doesn’t already unzip+parse, do it here.
    const jsonText = fileBuffer.toString(); // if already unzipped
    const records = JSON.parse(jsonText) as any[];

    // 3) Map to DB rows
    const rows: Row[] = records
      .map((r: any): Row => ({
        user_id,
        profile_id,
        day: r.date,
        campaign_id: String(r.campaignId ?? ""),
        ad_group_id: String(r.adGroupId ?? ""),
        keyword_text: String(r.keywordText ?? ""),
        search_term: String(r.searchTerm ?? ""),
        match_type: String(r.matchType ?? ""),
        impressions: Number(r.impressions ?? 0),
        clicks: Number(r.clicks ?? 0),
        cost: Number(r.cost ?? 0),
        orders: Number(r.purchases14d ?? 0),
        sales: Number(r.sales14d ?? 0),
      }))
      .filter((r: Row) =>
        r.day && r.search_term && r.keyword_text && r.campaign_id && r.ad_group_id
      );

    // 4) Upsert into ads_search_terms
    // Make sure your table has these columns:
    // user_id uuid, profile_id text, day date, campaign_id text, ad_group_id text,
    // keyword_text text, search_term text, match_type text,
    // impressions int8, clicks int8, cost numeric, orders int8, sales numeric
    if (rows.length) {
      const { error: upErr } = await db.from("ads_search_terms").upsert(rows, {
        onConflict: "user_id,profile_id,day,campaign_id,ad_group_id,search_term",
        ignoreDuplicates: false
      });
      if (upErr) throw upErr;
    }

    return NextResponse.json({ ok: true, rows: rows.length, reportId: report_id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, reason: "error", details: String(err?.message || err) }, { status: 500 });
  }
}

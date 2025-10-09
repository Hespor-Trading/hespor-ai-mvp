// app/api/ads/sync/searchterms/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db"; // whatever you already use to talk to Supabase
import { getAccessTokenForUser } from "@/lib/ads/auth"; // you already have this
import { createSpSearchTermReport } from "@/lib/ads/reports"; // you already have this

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) return NextResponse.json({ ok: false, reason: "missing user_id" }, { status: 400 });

    // days must be <= 30 (Amazon limit)
    const daysParam = Number(url.searchParams.get("days") || 30);
    const days = Number.isFinite(daysParam) ? Math.min(daysParam, 30) : 30;

    // get profile + country for this user (from ads_profiles table)
    const { data: profileRow, error: profileErr } = await db
      .from("ads_profiles")
      .select("profile_id, country")
      .eq("user_id", user_id)
      .maybeSingle();

    if (profileErr) throw profileErr;
    if (!profileRow) {
      return NextResponse.json({ ok: false, reason: "no-ads-profile", details: "Run /api/ads/enrich first" }, { status: 400 });
    }

    const profile_id: string = profileRow.profile_id;
    const country: string = profileRow.country?.toUpperCase?.() || "NA";

    // get LWA access token for this user
    const accessToken = await getAccessTokenForUser(user_id);
    if (!accessToken) {
      return NextResponse.json({ ok: false, reason: "no-access-token" }, { status: 400 });
    }

    // Build date range (last N days, inclusive)
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1)); // e.g. 30 days window

    const yyyy_mm_dd = (d: Date) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

    const startDate = yyyy_mm_dd(start);
    const endDate = yyyy_mm_dd(end);

    // Create the report (DO NOT POLL HERE)
    const reportId = await createSpSearchTermReport({
      accessToken,
      profileId: profile_id,
      region: country, // "NA" / "EU" / "FE"
      config: {
        name: `sp-searchterms-${Date.now()}`,
        startDate,
        endDate,
        timeUnit: "DAILY",
        // Allowed for spSearchTerm:
        groupBy: ["searchTerm"],
        columns: [
          "date",
          "campaignId",
          "campaignName",
          "adGroupId",
          "adGroupName",
          "keywordText",
          "matchType",
          "searchTerm",
          "impressions",
          "clicks",
          "cost",
          "purchases14d",
          "sales14d"
        ],
        adProduct: "SPONSORED_PRODUCTS",
        reportTypeId: "spSearchTerm",
        // Amazon requires report format if supported
        format: "GZIP_JSON"
      }
    });

    if (!reportId) {
      return NextResponse.json({ ok: false, reason: "failed-to-create-report" }, { status: 500 });
    }

    // Immediately return the reportId (client will poll /api/ads/report)
    return NextResponse.json({ ok: true, reportId, days, startDate, endDate });
  } catch (err: any) {
    return NextResponse.json({ ok: false, reason: "error", details: String(err?.message || err) }, { status: 500 });
  }
}

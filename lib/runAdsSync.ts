// lib/runAdsSync.ts
export async function runAdsSync(userId: string, days = 30, pollMs = 4000, maxPolls = 60) {
  // 1) Enrich (sets profile_id/region/brand and upserts ads_profiles)
  const enrich = await fetch(`/api/ads/enrich?user_id=${userId}`, { cache: 'no-store' })
    .then(r => r.json());
  if (!enrich?.ok) throw new Error(`enrich failed: ${enrich?.reason || enrich?.details || 'unknown'}`);

  // 2) Create search-term report (Amazon side) — returns reportId
  const created = await fetch(`/api/ads/sync/searchterms?user_id=${userId}&days=${days}`, { cache: 'no-store' })
    .then(r => r.json());
  if (!created?.ok || !created?.reportId) {
    throw new Error(`create report failed: ${created?.reason || created?.details || 'unknown'}`);
  }
  const reportId = created.reportId;

  // 3) Poll /api/ads/report until ingestion completes
  let polls = 0;
  while (polls < maxPolls) {
    // This endpoint both checks status AND ingests when COMPLETE
    const status = await fetch(`/api/ads/report?user_id=${userId}&report_id=${reportId}`, { cache: 'no-store' })
      .then(r => r.json());

    if (status?.ok === true) {
      // rows were ingested into ads_search_terms
      return { rows: status.rows ?? 0, reportId };
    }
    if (status?.status && status.status !== 'PENDING') {
      // e.g. FAILED / CANCELLED
      throw new Error(`report status: ${status.status}`);
    }

    polls += 1;
    await new Promise(res => setTimeout(res, pollMs));
  }
  throw new Error('timed out waiting for report');
}

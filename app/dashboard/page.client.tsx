"use client";

import TopBar from './TopBar';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Summary = { spend: number; sales: number; acos: number | null; orders: number; ctr: number | null; period: string; };
type TopTerm = {search_term:string, clicks:number, cost:number, sales:number, orders:number, acos:number|null};
type TopCampaign = {campaign_id:string, clicks:number, cost:number, sales:number, orders:number, acos:number|null};
type TopData = { terms: TopTerm[]; campaigns: TopCampaign[]; since?: string };

function useBrand() {
  const sp = useSearchParams();
  return sp.get("brand") || "default";
}

/* ... TopBar, KpiCard, useFreeBadge, LeftColumn, Chatbot stay unchanged ... */

function DashboardBody({ userId }: { userId: string }) {
  const brand = useBrand();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [top, setTop] = useState<TopData | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function refetchAll() {
    const [s, t] = await Promise.all([
      fetch(`/api/ads/summary?brand=${encodeURIComponent(brand)}&range=30d`).then(r=>r.json()),
      fetch(`/api/ads/top?days=30`).then(r=>r.json()),
    ]);
    setSummary(s);
    setTop(t?.error ? null : t);
  }

  useEffect(() => { refetchAll(); }, [brand]);

  // 🔁 FULLY AUTOMATED SYNC
  async function doSync() {
    if (!userId) return;
    setSyncing(true);
    setMsg("Preparing…");
    try {
      // 1) Enrich (gets/sets profile & region; also creates ads_profiles)
      const enr = await fetch(`/api/ads/enrich?user_id=${userId}`).then(r=>r.json());
      if (!enr?.ok) throw new Error(enr?.details || enr?.reason || "enrich failed");

      // 2) Create Search Terms report (30d window)
      setMsg("Requesting report…");
      const crt = await fetch(`/api/ads/sync/searchterms?user_id=${userId}&days=30`).then(r=>r.json());
      if (!crt?.ok || !crt?.reportId) throw new Error(crt?.details || "create report failed");
      const reportId = crt.reportId;

      // 3) Poll until COMPLETED, then API writes rows to ads_search_terms
      setMsg("Waiting for report…");
      const start = Date.now();
      while (true) {
        const st = await fetch(`/api/ads/report?user_id=${userId}&report_id=${reportId}`).then(r=>r.json());
        if (st?.ok) {
          setMsg(`Imported ${st.rows} rows`);
          break;
        }
        if (st?.status && st.status !== "COMPLETED") {
          // still pending
        }
        if (Date.now() - start > 120000) { // 2 min guard
          throw new Error("timeout while waiting for report");
        }
        await new Promise(r => setTimeout(r, 2000));
      }

      // 4) Refresh dashboard data
      await refetchAll();
      setMsg("Done");
      setTimeout(()=>setMsg(null), 3000);
    } catch (e:any) {
      setMsg(e?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <TopBar />

      <div className="rounded-2xl border p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Summary</div>
            <div className="text-xs text-slate-400">Window: 30 days</div>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-xs text-slate-500">{msg}</span>}
            <button
              onClick={doSync}
              className="rounded-lg bg-emerald-500 text-black px-4 py-2 disabled:opacity-60"
              disabled={syncing}
            >
              {syncing ? "Syncing…" : "Sync now"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <KpiCard label="Sales (30d)" value={`$${(summary?.sales ?? 0).toLocaleString()}`} />
          <KpiCard label="Spend (30d)" value={`$${(summary?.spend ?? 0).toLocaleString()}`} />
          <KpiCard label="ACOS (30d)" value={summary?.acos == null ? "—" : `${summary?.acos}%`} />
          <KpiCard label="Orders (30d)" value={`${summary?.orders ?? 0}`} />
        </div>
      </div>

      {/* ... the rest of your layout unchanged ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LeftColumn terms={top?.terms || []} />
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm font-semibold mb-2">Assistant</div>
            <Chatbot adsContext={top} />
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm font-semibold mb-2">Top Campaigns (30d)</div>
            <div className="space-y-2 max-h-60 overflow-auto">
              {(top?.campaigns || []).slice(0,10).map((c,i)=>(
                <div key={i} className="text-xs flex items-center justify-between border-b last:border-b-0 pb-1">
                  <div className="truncate max-w-[60%]">Campaign {c.campaign_id}</div>
                  <div className="text-right shrink-0">
                    <div>Sales ${(c.sales||0).toLocaleString()}</div>
                    <div className="text-slate-500">ACOS {c.acos==null?'—':c.acos+'%'}</div>
                  </div>
                </div>
              ))}
              {!top?.campaigns?.length && <div className="text-xs text-slate-500">No campaign stats yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({ userId }: { userId: string }) {
  return (
    <Suspense>
      <DashboardBody userId={userId} />
    </Suspense>
  );
}

'use client';

import { useEffect, useState } from 'react';
import TopBar from './TopBar';

type Summary = {
  spend: number | null;
  sales: number | null;
  acos: number | null;
  orders: number | null;
  ctr: number | null;
  period: string;
};

type Props = {
  userId: string;     // pass the logged-in user's id
  days?: number;      // default 30
};

export default function DashboardClient({ userId, days = 30 }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topTerms, setTopTerms] = useState<any[]>([]);
  const range = `${days}d`;

  async function load() {
    // NOTE: these endpoints already exist in your project per your screenshots.
    const [sRes, tRes] = await Promise.all([
      fetch(`/api/ads/summary?range=${range}`, { cache: 'no-store' }),
      fetch(`/api/ads/top?range=${range}&limit=15`, { cache: 'no-store' }),
    ]);
    const s = await sRes.json();
    const t = await tRes.json();
    setSummary(s);
    setTopTerms(t.items ?? []);
  }

  useEffect(() => {
    load();
  }, [range]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <TopBar userId={userId} days={days} onRefetch={load} />

      <div className="rounded-2xl border p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Summary</h2>
          <span className="text-sm text-gray-500">Window: {range}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Stat label="SPEND" value={`$${summary?.spend ?? 0}`} />
          <Stat label="SALES" value={`$${summary?.sales ?? 0}`} />
          <Stat label="ACOS" value={summary?.acos == null ? '—' : `${summary.acos}%`} />
          <Stat label="ORDERS" value={`${summary?.orders ?? 0}`} />
        </div>
      </div>

      <div className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="font-semibold mb-3">Top Search Terms ({range})</h2>
        {topTerms.length === 0 ? (
          <p className="text-sm text-gray-500">No recent search terms yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Search Term</th>
                  <th className="py-2 pr-4">Keyword</th>
                  <th className="py-2 pr-4">Clicks</th>
                  <th className="py-2 pr-4">Orders</th>
                  <th className="py-2 pr-4">Sales</th>
                </tr>
              </thead>
              <tbody>
                {topTerms.map((x: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-4">{x.search_term}</td>
                    <td className="py-2 pr-4">{x.keyword_text}</td>
                    <td className="py-2 pr-4">{x.clicks}</td>
                    <td className="py-2 pr-4">{x.orders}</td>
                    <td className="py-2 pr-4">${x.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

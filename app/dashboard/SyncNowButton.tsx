'use client';

import { useState } from 'react';

type Props = {
  userId: string;
  days?: number;          // default 30
  onDone?: () => void;    // called when data is stored
};

export default function SyncNowButton({ userId, days = 30, onDone }: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleClick() {
    try {
      setLoading(true);
      setMsg('Starting…');

      // 1) create report
      const r1 = await fetch(`/api/ads/sync/searchterms?user_id=${userId}&days=${days}`, { cache: 'no-store' });
      const j1 = await r1.json();
      if (!r1.ok || !j1.ok) throw new Error(j1.details || j1.reason || 'create report failed');
      const { reportId } = j1;
      setMsg('Report created. Fetching…');

      // 2) poll for completion
      const started = Date.now();
      while (Date.now() - started < 120000) { // up to 2 minutes
        const r2 = await fetch(`/api/ads/report?user_id=${userId}&report_id=${reportId}`, { cache: 'no-store' });
        const j2 = await r2.json();

        if (j2.ok === true) {
          setMsg(`Stored ${j2.rows} rows.`);
          onDone?.();
          setLoading(false);
          return;
        }
        if (j2.status && j2.status !== 'PENDING') {
          throw new Error(j2.status || 'report failed');
        }

        setMsg('Still processing…');
        await new Promise(res => setTimeout(res, 3000));
      }
      throw new Error('Timed out waiting for report');
    } catch (e: any) {
      setMsg(e?.message || 'Sync failed');
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? 'Syncing…' : 'Sync now'}
      </button>
      {msg && <span className="text-sm text-gray-600">{msg}</span>}
    </div>
  );
}

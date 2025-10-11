// components/SyncAdsButton.tsx
'use client';

import { useState } from 'react';
import { runAdsSync } from '@/lib/runAdsSync';

export default function SyncAdsButton({ userId, days = 30, onDone }: {
  userId: string;
  days?: number;
  onDone?: (result: { rows: number; reportId: string }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const click = async () => {
    setLoading(true);
    setMsg('Syncing search terms…');
    try {
      const result = await runAdsSync(userId, days);
      setMsg(`Done. Ingested ${result.rows} rows.`);
      onDone?.(result);
    } catch (e: any) {
      setMsg(`Error: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={click}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50"
      >
        {loading ? 'Syncing…' : 'Sync now'}
      </button>
      {msg && <span className="text-sm text-gray-600">{msg}</span>}
    </div>
  );
}

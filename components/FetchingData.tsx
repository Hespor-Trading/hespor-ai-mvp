"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FetchingData({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>("running");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      try {
        const r = await fetch(`/api/sync-status?user_id=${userId}`, { cache: "no-store" });
        const j = await r.json();
      
        if (!mounted) return;
        setProgress(Number(j.progress ?? 0));
        setStatus(j.status || "running");
        if (j.status === "done") {
          router.refresh();
          return; // stop polling; page will re-render
        }
      } catch {
        // ignore
      }
      setTimeout(tick, 5000);
    };
    tick();
    return () => { mounted = false; };
  }, [userId, router]);

  return (
    <div className="max-w-2xl mx-auto p-10 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        <div className="text-lg font-medium">Pulling last 60–90 days of reports…</div>
        <div className="text-sm text-gray-600">This may take a few minutes. We’ll notify you when ready.</div>
        <div className="mt-2 text-xs text-gray-500">{status === "running" ? `Progress ${progress}%` : status}</div>
      </div>
    </div>
  );
}

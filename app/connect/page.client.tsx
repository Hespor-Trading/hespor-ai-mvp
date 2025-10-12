"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ConnectClient() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const qs = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stepMsg, setStepMsg] = useState<string>("");

  // resolve current user
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) { router.push("/auth/sign-in"); return; }
      setUserId(session.user.id);
    })();
  }, [supabase, router]);

  // auto-start sync immediately after coming back from Amazon
  useEffect(() => {
    const connected = qs.get("ads") === "connected";
    if (connected && userId && !busy) {
      void runFullSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs, userId]);

  async function runFullSync() {
    if (!userId) return;
    setBusy(true);
    try {
      setStepMsg("Preparing your account (profiles & region)...");
      await fetch(`/api/ads/enrich?user_id=${userId}`, { cache: "no-store" });

      setStepMsg("Creating Amazon report (last 30 days)...");
      const r1 = await fetch(`/api/ads/sync/searchterms?user_id=${userId}&days=30`, { cache: "no-store" });
      const j1 = await r1.json();
      if (!j1.ok || !j1.reportId) throw new Error(j1.details || "Could not create report");

      setStepMsg("Fetching data from Amazon — this can take a bit...");
      // poll up to ~2 minutes total (40 * 3s)
      let tries = 0;
      while (tries < 40) {
        const r2 = await fetch(`/api/ads/report?user_id=${userId}&report_id=${j1.reportId}`, { cache: "no-store" });
        const j2 = await r2.json();
        if (j2.ok && typeof j2.rows === "number") {
          setStepMsg(`Imported ${j2.rows} rows. Finishing up...`);
          break;
        }
        await new Promise(res => setTimeout(res, 3000));
        tries++;
      }
      // go to dashboard (server components will re-read Supabase)
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setStepMsg(e?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  // If you already have an OAuth URL, use it below.
  const connectUrl = "/api/ads/auth"; // <— your existing Ads OAuth start endpoint

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Connect your Amazon Ads</h1>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        {!busy ? (
          <>
            <p className="text-gray-600">
              Connect your Amazon Ads account. We’ll automatically pull the last 30 days of data and send you to your dashboard.
            </p>
            <div className="mt-4">
              <Button
                asChild
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={!userId}
              >
                <a href={connectUrl}>Connect Amazon Ads</a>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              After you approve access on Amazon, you’ll be redirected here and the import will start automatically.
            </p>
          </>
        ) : (
          <LoadingBlock message={stepMsg || "Loading… please be patient while we pull your data."} />
        )}
      </div>
    </div>
  );
}

function LoadingBlock({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      <div className="text-sm text-gray-700">{message}</div>
    </div>
  );
}

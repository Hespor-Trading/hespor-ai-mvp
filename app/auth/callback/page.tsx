"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * PUBLIC handoff after auth (email/password or OAuth):
 * Reads ?next and navigates there. Default: /connect
 */
function CallbackInner() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const next = search.get("next") || "/connect";
    router.replace(next);
  }, [router, search]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">Finishing sign-in…</h1>
        <p className="text-gray-700">One moment while we complete your login.</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-700">Loading…</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}

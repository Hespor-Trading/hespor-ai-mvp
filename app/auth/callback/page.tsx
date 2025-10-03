"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Public handoff page used both after OAuth AND after password login.
 * It pushes to the requested next path (default: /connect).
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

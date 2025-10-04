"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * PUBLIC handoff after auth (email/password or OAuth):
 * Ensures cookies are set, then navigates to ?next or /connect
 */
function CallbackInner() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const supabase = createClientComponentClient();
    async function run() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });
      }
      const next = search.get("next") || "/connect";
      router.replace(next);
    }
    run();
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

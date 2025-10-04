"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * After magic-link / OAuth, set cookies then send to ?next or /connect
 */
function Inner() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const supabase = createClientComponentClient();
    (async () => {
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
    })();
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
    <Suspense fallback={<div className="min-h-[60vh] grid place-items-center">Loading…</div>}>
      <Inner />
    </Suspense>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * After Supabase completes OAuth/email link, we land here.
 * If a session exists -> push to /connect
 * If not -> back to /auth/sign-in
 *
 * We don’t read Supabase directly here; the middleware already enforces.
 * We simply push to the intended destination, and the middleware will allow/deny.
 */
export default function Page() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    // If we arrived here via email verification or OAuth completion,
    // head to /connect. If not logged in, middleware will send to /auth/sign-in.
    const next = search.get("next");
    router.replace(next || "/connect");
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

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackInner() {
  const router = useRouter();
  const _sp = useSearchParams(); // reading guards hydration; not used directly

  useEffect(() => {
    // Supabase handles the OAuth response itself; we just move the user along.
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700">Finishing sign-in…</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Finishing sign-in…</p>
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}

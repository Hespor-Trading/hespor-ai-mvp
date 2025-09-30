import { Suspense } from "react";
import ResetClient from "./Client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8">
            <p className="text-sm">Loading…</p>
          </div>
        </div>
      }
    >
      <ResetClient />
    </Suspense>
  );
}

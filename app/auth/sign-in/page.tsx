import { Suspense } from "react";
import SignInClient from "./Client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-emerald-600" />}>
      <SignInClient />
    </Suspense>
  );
}

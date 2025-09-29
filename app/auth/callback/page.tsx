"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

async function routeAfterLogin(router: any) {
  const sb = supabaseBrowser();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.id) {
    router.replace("/auth/sign-in");
    return;
  }

  const { count } = await sb
    .from("spapi_credentials")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (!count || count === 0) router.replace("/connect");
  else router.replace("/dashboard");
}

function CallbackInner() {
  const router = useRouter();
  const _sp = useSearchParams();

  useEffect(() => {
    routeAfterLogin(router);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700">Finishing sign-in…</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-700">Finishing sign-in…</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}

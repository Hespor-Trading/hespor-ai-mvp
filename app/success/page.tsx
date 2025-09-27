"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function Success() {
  const router = useRouter();
  const qp = useSearchParams();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseBrowser().auth.getUser();
      if (!user) return router.replace("/auth/sign-in");

      // MVP: flag plan as pro
      await supabaseBrowser().from("profiles").update({ plan: "pro" }).eq("id", user.id);
      router.replace("/dashboard");
    })();
  }, [router, qp]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-2xl bg-white p-8 shadow">
        Activating your subscription…
      </div>
    </div>
  );
}

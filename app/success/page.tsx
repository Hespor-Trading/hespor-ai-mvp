"use client";
export const dynamic = "force-dynamic"; // don't prerender
export const revalidate = 0;

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseBrowser().auth.getUser();
      if (!user) {
        router.replace("/auth/sign-in");
        return;
      }

      // MVP: flag plan as pro on success
      await supabaseBrowser()
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", user.id);

      router.replace("/dashboard");
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="rounded-2xl bg-white p-8 shadow text-center">
        <h1 className="text-xl font-semibold mb-2">Activating your subscription…</h1>
        <p className="text-gray-600">One moment while we update your account.</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

// tiny helper to parse tokens when Supabase returns them in the URL hash
function parseHash(hash: string) {
  // e.g. #access_token=...&refresh_token=...&expires_in=...
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const access_token = params.get("access_token") || undefined;
  const refresh_token = params.get("refresh_token") || undefined;
  return { access_token, refresh_token };
}

export default function OAuthCallback() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();

      // Case A: Newer flow returns ?code=...
      const code = search.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace("/dashboard");
        return;
      }

      // Case B: Older flow returns #access_token=... in the hash
      const { access_token, refresh_token } = parseHash(window.location.hash || "");
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        router.replace("/dashboard");
        return;
      }

      // Fallback: if already signed in, just go
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/sign-in?error=oauth_callback");
      }
    })();
  }, [router, search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="rounded-xl bg-white px-6 py-8 shadow">
        <p className="text-gray-700">Finishing sign-in…</p>
      </div>
    </div>
  );
}

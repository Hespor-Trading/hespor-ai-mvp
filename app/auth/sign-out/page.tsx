"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignOutPage() {
  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut();
      } catch {}
      // Redirect to marketing site per your request
      window.location.replace("https://hespor.com");
    })();
  }, []);
  return <div className="p-6">Signing you out…</div>;
}

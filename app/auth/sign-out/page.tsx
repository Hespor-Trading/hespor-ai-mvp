"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function SignOutPage() {
  useEffect(() => {
    (async () => {
      try {
        const supabase = supabaseBrowser();
        await supabase.auth.signOut();
      } catch {}
      // Redirect to marketing site per your request
      window.location.replace("https://hespor.com");
    })();
  }, []);
  return <div className="p-6">Signing you out…</div>;
}

"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Listens for Supabase SIGNED_IN and mirrors the client session into
 * HTTP-only cookies via /api/auth/session, then hard-redirects to /connect.
 */
export default function CookieBridge() {
  useEffect(() => {
    const supabase = createClientComponentClient();

    // On first mount (in case we already have a session)
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });
      }
    });

    // Also subscribe to SIGNED_IN events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });
        // Hard redirect so middleware sees cookies
        window.location.assign("/connect");
      }
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  return null;
}

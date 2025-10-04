"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Mirrors the client session into HTTP-only cookies
 * so middleware can "see" the login, then sends you to /connect.
 */
export default function CookieBridge() {
  useEffect(() => {
    const supabase = createClientComponentClient();

    const sync = async () => {
      const { data } = await supabase.auth.getSession();
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
    };

    // on first load (handles "already signed in" cases)
    void sync();

    // and on state changes (fresh sign-ins)
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
        // hard redirect so middleware runs with cookies
        window.location.assign("/connect");
      }
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  return null;
}

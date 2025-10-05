"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

function Inner() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const sp = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const verified = sp.get("verified");
  const awaiting = sp.get("awaiting");

  useEffect(() => {
    if (verified === "1") {
      toast.success("Email verified. You can sign in now.");
    }

    // Show “check inbox” ONLY right after Sign Up
    let shouldShowAwaiting = false;
    try {
      const flag = sessionStorage.getItem("hespor_awaiting_verification");
      shouldShowAwaiting = awaiting === "1" && flag === "1";
      if (shouldShowAwaiting) {
        sessionStorage.removeItem("hespor_awaiting_verification");
      }
    } catch {}
    if (shouldShowAwaiting) {
      toast.message("Check your inbox to confirm your email.", {
        description: "Didn’t get it? Use Resend below.",
      });
    }
  }, [verified, awaiting]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message?.toLowerCase();
        if (msg.includes("email not confirmed")) {
          toast.error("Please verify your email first.");
        } else {
          toast.error("Email or password is incorrect.");
        }
        return;
      }
      // ✅ Always land on /connect after a successful sign in
      router.replace("/connect");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (!email) {
      toast.error("Enter your email, then click Resend.");
      return;
    }
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const txt = await res.text();
        toast.error(txt || "Could not resend right now.");
      } else {
        toast.success("Verification email re-sent.");
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-center mb-4">
          {/* Bigger logo */}
          <Image src="/hespor-logo.png" alt="Hespor" width={80} height={80} priority />
        </div>

        <h1 className="text-lg font-semibold text-center mb-6">Sign in</h1>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              type="password"
              autoComplete="current-password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 text-white px-4 py-3 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="/auth/reset" className="underline">
              Forgot password?
            </Link>
            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="underline"
              title="Resend verification email"
            >
              {resending ? "Resending…" : "Resend verification"}
            </button>
          </div>

          <div className="text-center text-sm mt-1">
            <Link href="/legal/terms" className="underline">
              Terms
            </Link>{" "}
            ·{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy
            </Link>
          </div>

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/auth/sign-up" className="underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignInClient() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

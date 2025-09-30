"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import LegalModal from "@/components/LegalModal";

type FriendlyError =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "rate_limited"
  | "unknown";

const errorMap: Record<FriendlyError, string> = {
  invalid_credentials: "Email or password is incorrect.",
  email_not_confirmed: "Please verify your email first. We’ve sent you a confirmation link.",
  rate_limited: "Too many attempts. Please wait a minute and try again.",
  unknown: "Something went wrong. Please try again.",
};

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);

  useEffect(() => {
    if (params.get("created") === "1") toast.success("Account created. Please sign in.");
    if (params.get("verified") === "1") toast.success("Email verified! You can sign in now.");
    if (params.get("reset") === "1") toast.success("Password updated. Sign in with your new password.");
  }, [params]);

  async function signInWithPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      const m = (error.message || "").toLowerCase();
      if (m.includes("email not confirmed")) return setErr(errorMap.email_not_confirmed);
      if (m.includes("invalid")) return setErr(errorMap.invalid_credentials);
      if (m.includes("rate")) return setErr(errorMap.rate_limited);
      return setErr(errorMap.unknown);
    }

    router.push("/connect");
  }

  async function signInWithGoogle() {
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/verify/pending` },
    });
    setLoading(false);
    if (error) setErr(errorMap.unknown);
  }

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Image src="/hespor-logo.png" alt="Hespor" width={80} height={80} priority />
          <h1 className="text-xl font-semibold">Sign in to Hespor</h1>
        </div>

        {err && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={signInWithPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2.5 hover:opacity-90 disabled:opacity-50"
            type="submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full rounded-lg border border-black py-2.5 hover:bg-black hover:text-white transition"
          >
            Continue with Google
          </button>

          <div className="text-right">
            <Link className="text-sm underline" href="/auth/reset">
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline">
            Sign up
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-black">
          By using Hespor, you agree to our{" "}
          <button
            type="button"
            onClick={() => setLegalOpen(true)}
            className="underline"
          >
            Terms &amp; Conditions
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setLegalOpen(true)}
            className="underline"
          >
            Privacy Policy
          </button>
          .
        </div>

        {/* Legal modal (same UI as Sign-up) */}
        <LegalModal open={legalOpen} onClose={() => setLegalOpen(false)} />
      </div>
    </div>
  );
}

export default function SignInClient() {
  // Suspense keeps Next happy when useSearchParams is used
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

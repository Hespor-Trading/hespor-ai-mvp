"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
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
  rate_limited: "Too many attempts. Please try again later.",
  unknown: "Something went wrong. Please try again.",
};

function Inner() {
  const router = useRouter();
  const search = useSearchParams();
  const supabase = createClientComponentClient();

  const formRef = useRef<HTMLFormElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<FriendlyError | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);

  useEffect(() => {
    const error = search.get("error");
    if (error) {
      setErr("unknown");
      toast.error("Sign-in failed. Please try again.");
    }
  }, [search]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("email not confirmed")) setErr("email_not_confirmed");
        else if (msg.includes("invalid")) setErr("invalid_credentials");
        else if (msg.includes("rate")) setErr("rate_limited");
        else setErr("unknown");
        toast.error(errorMap[err ?? "unknown"]);
        return;
      }

      // 🔒 Do NOT go directly to /connect (avoids edge-cookie race with middleware)
      // Use the public callback handoff, then it will push to /connect.
      router.replace("/auth/callback?next=/connect");
    } catch (e) {
      console.error("SIGN-IN ERROR:", e);
      setErr("unknown");
      toast.error("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Image src="/hespor-logo.png" alt="Hespor" width={80} height={80} priority unoptimized />
          <h1 className="text-xl font-semibold">Sign in to Hespor</h1>
        </div>

        {err && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {errorMap[err]}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 text-white py-2 font-semibold hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link href="/auth/reset" className="underline">
              Forgot password?
            </Link>
            <button type="button" className="underline" onClick={() => setLegalOpen(true)}>
              Terms & Privacy
            </button>
          </div>

          <div className="text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/auth/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </form>

        <LegalModal open={legalOpen} onClose={() => setLegalOpen(false)} />
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

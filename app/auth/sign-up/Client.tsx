"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function Inner() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const sp = useSearchParams();

  const next = sp.get("next") || "/connect";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const origin =
      typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL!;

    // Pure Supabase ready-made sign up (no extra profile upserts, no builder.catch)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }

    // Go to “check your email” screen (optional route in your app)
    router.replace(`/auth/verify/pending?email=${encodeURIComponent(email)}`);
  }

  async function signUpWithGoogle() {
    setLoading(true);
    const origin =
      typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL!;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen w-full bg-emerald-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Image src="/hespor-logo.png" alt="Hespor" width={56} height={56} priority />
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-gray-600 text-center">
            Sign up and we’ll email you a verification link.
          </p>
        </div>

        <button
          onClick={signUpWithGoogle}
          disabled={loading}
          className="w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <form onSubmit={signUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white rounded-md py-2 font-semibold hover:bg-emerald-700 transition"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link className="text-emerald-700 font-medium" href="/auth/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpClient() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

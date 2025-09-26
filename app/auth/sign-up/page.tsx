"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const form = e.currentTarget as any;
    const email = form.email.value as string;
    const password = form.password.value as string;

    const { error } = await supabaseBrowser().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"}/auth/sign-in`,
      },
    });

    setLoading(false);
    if (error) setErr(error.message);
    else setOk(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-500">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/hespor-logo.png" alt="HESPOR" width={160} height={40} />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up for HESPOR
        </h1>

        {ok ? (
          <p className="text-center text-gray-700">
            We sent a confirmation link to your email. Verify, then log in.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/auth/sign-in" className="font-medium text-emerald-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

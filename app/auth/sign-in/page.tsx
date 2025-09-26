"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const form = e.currentTarget as any;
    const email = form.email.value as string;
    const password = form.password.value as string;

    const { error } = await supabaseBrowser().auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-500">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/hespor-logo.png" alt="HESPOR" width={160} height={40} />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Log In to HESPOR
        </h1>

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
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <a href="/auth/reset" className="text-emerald-600 hover:underline">
            Forgot password?
          </a>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          New to HESPOR?{" "}
          <a href="/auth/sign-up" className="font-medium text-emerald-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

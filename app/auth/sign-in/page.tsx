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
    setErr(""); setLoading(true);

    const f = e.currentTarget as any;
    const email = f.email.value.trim();
    const password = f.password.value;

    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    router.push("/dashboard");
  }

  async function handleGoogle() {
    await supabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"}/dashboard`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-500">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Image src="/hespor-logo.png" alt="HESPOR" width={160} height={40} />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In to HESPOR</h1>

        <button onClick={handleGoogle} type="button" className="w-full mb-4 rounded-lg border border-gray-300 py-2 font-medium hover:bg-gray-50 transition">
          Continue with Google
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input type="password" name="password" placeholder="Password" required className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50">
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <a href="/auth/reset" className="text-emerald-600 hover:underline">Forgot password?</a>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          New to HESPOR? <a href="/auth/sign-up" className="font-medium text-emerald-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

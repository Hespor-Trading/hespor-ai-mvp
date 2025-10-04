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

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    brand: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agree) return alert("Please accept Terms & Privacy first.");
    if (form.password !== form.confirm) return alert("Passwords do not match.");

    setLoading(true);
    const origin =
      typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL!;

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          amazon_brand: form.brand,
        },
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setLoading(false);
    if (error) return alert(error.message);

    // show "check your email" screen (see files below)
    router.replace(`/auth/verify/pending?email=${encodeURIComponent(form.email)}`);
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
          <div className="h-16 w-16 relative">
            <Image
              src="/hespor-logo.png"
              alt="Hespor"
              fill
              sizes="64px"
              priority
              className="object-contain"
            />
          </div>
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
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-1/2 rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-1/2 rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <input
            type="text"
            name="brand"
            required
            value={form.brand}
            onChange={handleChange}
            placeholder="Amazon brand"
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@email.com"
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Password (min 6 chars)"
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            name="confirm"
            required
            value={form.confirm}
            onChange={handleChange}
            placeholder="Confirm password"
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-emerald-500"
          />

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1 accent-emerald-600"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-emerald-700 font-medium" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-emerald-700 font-medium" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

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

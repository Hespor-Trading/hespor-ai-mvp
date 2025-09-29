"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
  accept: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms & Privacy to continue." }),
  }),
});

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    const fd = new FormData(e.currentTarget);
    const data = {
      email: String(fd.get("email") || "").trim(),
      password: String(fd.get("password") || ""),
      accept: fd.get("accept") === "on",
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setErr(parsed.error.errors[0].message);
      return;
    }

    try {
      sessionStorage.setItem("last_sign_up_email", data.email);
    } catch {}

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify/pending`,
      },
    });
    setLoading(false);

    if (error) {
      setErr(error.message || "Failed to create account.");
      return;
    }

    router.push("/auth/sign-in?created=1");
  }

  async function signUpWithGoogle() {
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/verify/pending` },
    });
    setLoading(false);
    if (error) setErr(error.message || "Google sign-in failed.");
  }

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Image src="/hespor-logo.png" alt="Hespor" width={80} height={80} priority />
          <h1 className="text-xl font-semibold">Create your Hespor account</h1>
        </div>

        {err && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
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
              placeholder="At least 8 chars, 1 number, 1 symbol"
            />
          </div>

          <div id="legal" className="rounded-lg border p-3 bg-emerald-50">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="accept" className="mt-1" />
              <span className="text-black">
                I agree to the{" "}
                <button type="button" className="underline" onClick={() => setShowTerms(true)}>
                  Terms &amp; Conditions
                </button>{" "}
                and{" "}
                <button type="button" className="underline" onClick={() => setShowPrivacy(true)}>
                  Privacy Policy
                </button>
                .
              </span>
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2.5 hover:opacity-90 disabled:opacity-50"
            type="submit"
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          <button
            type="button"
            onClick={signUpWithGoogle}
            className="w-full rounded-lg border border-black py-2.5 hover:bg-black hover:text-white transition"
          >
            Continue with Google
          </button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </form>

        {/* Simple modal drawers using <dialog> (keeps black text on emerald header) */}
        {showTerms && (
          <dialog open className="w-full max-w-2xl rounded-xl p-0 border shadow-2xl">
            <div className="bg-emerald-600 text-black p-4 font-semibold">Terms &amp; Conditions</div>
            <iframe className="w-full h-[60vh] p-4" src="/legal/terms" title="Terms & Conditions" />
            <div className="p-4 text-right">
              <button className="underline" onClick={() => setShowTerms(false)}>Close</button>
            </div>
          </dialog>
        )}
        {showPrivacy && (
          <dialog open className="w-full max-w-2xl rounded-xl p-0 border shadow-2xl">
            <div className="bg-emerald-600 text-black p-4 font-semibold">Privacy Policy</div>
            <iframe className="w-full h-[60vh] p-4" src="/legal/privacy" title="Privacy Policy" />
            <div className="p-4 text-right">
              <button className="underline" onClick={() => setShowPrivacy(false)}>Close</button>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

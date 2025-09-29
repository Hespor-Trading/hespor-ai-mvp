"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

const strongPw = (pw: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,64})/.test(pw); // ≥8, upper, lower, number

function Logo() {
  return (
    <div className="flex justify-center mb-6">
      <Image
        src="/hespor-logo.png"
        alt="HESPOR"
        width={160}
        height={40}
        onError={(e) => {
          (e.target as any).style.display = "none";
          const f = document.getElementById("logo-fallback");
          if (f) (f as any).style.display = "block";
        }}
      />
      <img
        id="logo-fallback"
        src="/hespor-logo.png"
        alt="HESPOR"
        width={160}
        height={40}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const f = e.currentTarget as any;
    const email = f.email.value.trim();
    const email2 = f.email2.value.trim();
    const password = f.password.value;
    const password2 = f.password2.value;
    const first_name = f.first_name.value.trim();
    const last_name = f.last_name.value.trim();
    const business_name = f.business_name.value.trim();
    const store_brand = f.store_brand.value.trim();
    const terms = f.terms.checked;

    if (!terms) {
      setErr("Please accept the Terms & Privacy.");
      setLoading(false);
      return;
    }
    if (email !== email2) {
      setErr("Emails do not match.");
      setLoading(false);
      return;
    }
    if (password !== password2) {
      setErr("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!strongPw(password)) {
      setErr(
        "Password must be 8+ chars and include upper, lower, and a number."
      );
      setLoading(false);
      return;
    }

    const sb = supabaseBrowser();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name, business_name, store_brand },
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"
        }/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes("already registered"))
        setErr("That email is already registered. Try logging in.");
      else setErr(error.message);
      return;
    }

    if (data?.user && !data?.session) {
      setOk(true);
      setCooldown(60);
    } else {
      router.push("/auth/sign-in?new=1");
    }
  }

  async function handleGoogle() {
    await supabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"
        }/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }

  async function resendConfirmation() {
    setErr("");
    const email = emailRef.current?.value?.trim();
    if (!email) {
      setErr("Enter your email above first.");
      return;
    }

    const { error } = await supabaseBrowser().auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"
        }/auth/callback`,
      },
    });

    if (error) {
      setErr(error.message);
      return;
    }
    setCooldown(60);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-500">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Logo />

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up for HESPOR
        </h1>

        {ok ? (
          <div className="text-center">
            <p className="text-gray-700">
              We sent a confirmation link to your email. After verifying, please
              log in.
            </p>

            <button
              onClick={resendConfirmation}
              disabled={cooldown > 0}
              className="mt-4 w-full rounded-lg border border-gray-300 py-2 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend confirmation email"}
            </button>

            <p className="text-xs text-gray-500 mt-2">
              Tip: check your Spam/Junk folder. Outlook sometimes delays these.
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogle}
              type="button"
              className="w-full mb-4 rounded-lg border border-gray-300 py-2 font-medium hover:bg-gray-50 transition"
            >
              Continue with Google
            </button>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="first_name"
                  placeholder="First name"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  name="last_name"
                  placeholder="Last name"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <input
                name="business_name"
                placeholder="Business / Company name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                name="store_brand"
                placeholder="Amazon store / brand (optional)"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <input
                ref={emailRef}
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                name="email2"
                placeholder="Confirm email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="password"
                name="password2"
                placeholder="Confirm password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="terms" className="h-4 w-4" />
                I agree to the{" "}
                <a href="/terms" className="text-emerald-600 underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-emerald-600 underline">
                  Privacy Policy
                </a>
                .
              </label>

              {err && <p className="text-sm text-red-600">{err}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/sign-in"
            className="font-medium text-emerald-600 hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

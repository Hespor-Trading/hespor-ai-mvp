"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function Inner() {
  const supabase = createClientComponentClient();
  const sp = useSearchParams();
  const email = sp.get("email") || "";
  const next = sp.get("next") || "/connect";

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function resend() {
    if (!email) {
      setStatus("error");
      setMessage("Missing email address.");
      return;
    }
    setStatus("sending");
    setMessage("");
    const origin =
      typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL!;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Verification email sent. Check your inbox (and spam).");
  }

  return (
    <div className="min-h-screen w-full bg-emerald-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="h-16 w-16 relative">
            <Image src="/hespor-logo.png" alt="Hespor" fill sizes="64px" priority className="object-contain" />
          </div>
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="text-sm text-gray-600 text-center">
            We’ve sent a verification link to <span className="font-medium">{email || "your email"}</span>.
            Click it to activate your account.
          </p>
        </div>

        <button
          onClick={resend}
          disabled={status === "sending"}
          className="w-full bg-emerald-600 text-white rounded-md py-2 font-semibold hover:bg-emerald-700 transition"
        >
          {status === "sending" ? "Resending..." : "Resend verification email"}
        </button>

        {message ? (
          <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>{message}</p>
        ) : null}

        <p className="text-xs text-gray-600 mt-6 text-center">
          Wrong email?{" "}
          <Link className="text-emerald-700 font-medium" href="/auth/sign-up">
            Go back to sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPending() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

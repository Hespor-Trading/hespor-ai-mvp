"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPending() {
  const [counter, setCounter] = useState(60);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("last_sign_up_email") : null;
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCounter((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  async function resend() {
    if (!email) return alert("Missing email.");
    const res = await fetch("/api/auth/resend", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      alert("Verification email resent.");
      setCounter(60);
    } else {
      const msg = await res.text();
      alert(msg || "Could not resend yet. Try again shortly.");
    }
  }

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8 text-center space-y-4">
        <h1 className="text-xl font-semibold">Check your inbox</h1>
        <p>We sent a verification link to <b>{email || "your email"}</b>.</p>
        <p>Didn’t get it? You can resend after {counter}s.</p>
        <button
          disabled={counter > 0}
          onClick={resend}
          className="rounded-lg border border-black px-4 py-2 hover:bg-black hover:text-white disabled:opacity-50"
        >
          Resend verification email
        </button>

        <div className="text-sm">Once verified, you’ll be redirected to Sign In.</div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase";

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

export default function ResetPage() {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setErr("");
    const email = (e.currentTarget as any).email.value.trim();
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${
          process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"
        }/auth/update-password`,
      }
    );
    if (error) setErr(error.message);
    else setMsg("Check your email for a password reset link.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-500">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-center mb-4">
          Reset your password
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Your email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          <button className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 transition">
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}

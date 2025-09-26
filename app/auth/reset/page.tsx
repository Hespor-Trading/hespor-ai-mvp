"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function ResetPage() {
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.currentTarget as any).email.value as string;
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"}/auth/update-password`,
    });
    setMsg(error ? error.message : "Check your email for the reset link.");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50 p-6">
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Reset password</h1>
        <input name="email" type="email" placeholder="Email" className="w-full rounded-lg border px-4 py-2 mb-3" required />
        <button className="w-full rounded-lg bg-emerald-500 py-2 text-white">Send reset link</button>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </form>
    </div>
  );
}

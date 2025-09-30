"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const passSchema = z
  .string()
  .min(8, "Min 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(/[^A-Za-z0-9]/, "Include at least one special character");

export default function ResetClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const token = sp.get("token");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function sendReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null); setOk(null);
    const email = new FormData(e.currentTarget).get("email") as string;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (error) setErr(error.message);
    else setOk("Email sent. Check your inbox.");
  }

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null); setOk(null);
    const password = new FormData(e.currentTarget).get("password") as string;
    const parsed = passSchema.safeParse(password);
    if (!parsed.success) return setErr(parsed.error.errors[0].message);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) setErr(error.message);
    else router.replace("/auth/sign-in?reset=1");
  }

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8 space-y-4">
        {!token ? (
          <>
            <h1 className="text-xl font-semibold text-center">Forgot password</h1>
            {err && <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
            {ok && <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">{ok}</div>}
            <form onSubmit={sendReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
              </div>
              <button className="w-full rounded-lg bg-black text-white py-2.5">Send reset link</button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-center">Set a new password</h1>
            {err && <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">New password</label>
                <input name="password" type="password" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
              </div>
              <button className="w-full rounded-lg bg-black text-white py-2.5">Update password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

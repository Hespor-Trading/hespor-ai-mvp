"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import LegalModal from "@/components/LegalModal";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Min 8 characters").regex(/[A-Z]/, "Include at least one uppercase letter"),
});

export default function Client() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [openLegal, setOpenLegal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState<{ email: string; password: string }>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const parsed = SignUpSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!agree) {
      toast.error("You must agree to the Terms & Privacy.");
      return;
    }

    setLoading(true);
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
      const emailRedirectTo = `${appUrl}/auth/sign-in?verified=1`;

      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { emailRedirectTo },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Verification email sent. Please check your inbox.");
      router.replace("/auth/sign-in");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-center mb-4">
          <Image src="/hespor-logo.png" alt="Hespor" width={40} height={40} />
          <span className="ml-2 text-xl font-semibold">Hespor</span>
        </div>
        <h1 className="text-lg font-semibold text-center mb-6">Create your account</h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 chars with 1 uppercase"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            I agree to the{" "}
            <Link href="/legal/terms" className="underline">Terms</Link> and{" "}
            <Link href="/legal/privacy" className="underline">Privacy</Link>.
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 text-white px-4 py-3 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">Sign in</Link>
          </p>
        </form>
      </div>

      <LegalModal open={openLegal} setOpen={setOpenLegal} />
    </div>
  );
}

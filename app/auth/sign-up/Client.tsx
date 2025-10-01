"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import LegalModal from "@/components/LegalModal";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  businessName: z.string().min(1, "Required"),
  brand: z.string().min(1, "Required"),
  fullName: z.string().min(1, "Required"),
});

export default function SignUpClient() {
  const router = useRouter();
  const [legalOpen, setLegalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    businessName: "",
    brand: "",
    fullName: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = SignUpSchema.safeParse(form);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Please check your inputs";
      toast.error(msg);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/app/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error("Sign up failed. Please try again.");
        return;
      }
      router.replace("/auth/verify/pending");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white/95 shadow-xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          {/* ✅ ensure logo always renders */}
          <Image src="/hespor-logo.png" alt="Hespor" width={80} height={80} priority unoptimized />
          <h1 className="text-xl font-semibold">Create your Hespor account</h1>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              type="email"
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              placeholder="Your company"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Your brand"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="John Carter"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 text-white py-2 font-semibold hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="md:col-span-2 text-xs text-center text-gray-600">
            By signing up, you agree to the{" "}
            <button type="button" className="underline" onClick={() => setLegalOpen(true)}>
              Terms & Privacy
            </button>
            .
          </div>

          <div className="md:col-span-2 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </form>

        <LegalModal open={legalOpen} onClose={() => setLegalOpen(false)} />
      </div>
    </div>
  );
}

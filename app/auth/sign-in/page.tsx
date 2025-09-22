"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // TODO: wire to your auth backend or NextAuth signIn()
      console.log("Sign in", { email, password, remember });
      window.location.href = "/connect"; // temporary redirect on success
    } catch (err) {
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <img src="/logo-dark.png" alt="Hespor" className="h-7" />
          <span className="sr-only">HESPOR</span>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-[#0a0a0a]">Log In to HESPOR</h1>
        <p className="mb-5 text-sm text-gray-600">Welcome back! Please enter your details.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/auth/forgot" className="text-xs underline text-[#0a0a0a]">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
              placeholder="••••••••"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border"
            />
            Remember me (if this is a private computer)
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl px-4 py-2 text-white ${
              loading ? "bg-gray-400" : "bg-[#0a0a0a] hover:bg-black"
            }`}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          New to HESPOR?{" "}
          <Link href="/auth/sign-up" className="text-[#0a0a0a] underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

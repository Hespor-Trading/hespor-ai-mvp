"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as any;
    const email = form.email.value;
    const password = form.password.value;

    // Call your custom API to create a new user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      // Automatically sign them in after registration
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/connect",
      });
    } else {
      alert("Sign-up failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-500">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/hespor-logo.png"
            alt="HESPOR"
            width={160}
            height={40}
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up for HESPOR
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/auth/sign-in" className="font-medium text-emerald-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

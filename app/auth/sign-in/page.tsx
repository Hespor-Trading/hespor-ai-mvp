"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInPage() {
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
          Log In to HESPOR
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = (e.currentTarget as any).email.value;
            const password = (e.currentTarget as any).password.value;
            signIn("credentials", { email, password, callbackUrl: "/connect" });
          }}
          className="space-y-4"
        >
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
            className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to HESPOR?{" "}
          <a href="/auth/sign-up" className="font-medium text-emerald-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

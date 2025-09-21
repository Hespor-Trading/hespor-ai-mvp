"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [ok, setOk] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem("hespor_user_email", email.trim())
    localStorage.setItem("hespor_user_password", password)
    setOk(true)
    setTimeout(() => {
      window.location.href = "/auth/sign-in"
    }, 900)
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top brand bar */}
      <div className="w-full border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6 flex items-center justify-center">
          <Image src="/hespor-logo.png" alt="HESPOR" width={160} height={40} />
        </div>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-center">Create your HESPOR account</h1>
        <div className="mt-6 border-t border-gray-200" />

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Please enter your email"
              required
              className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Please enter your password"
              required
              className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 transition">
            Sign Up
          </button>
          {ok && <p className="text-sm text-emerald-700">Saved! Redirecting…</p>}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-emerald-700 font-medium">
            Log In
          </Link>
        </p>
      </div>
    </main>
  )
}

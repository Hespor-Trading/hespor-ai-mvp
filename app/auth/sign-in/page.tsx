"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [err, setErr] = useState("")

  useEffect(() => {
    const savedE = localStorage.getItem("hespor_user_email")
    if (savedE) setEmail(savedE)
    if (localStorage.getItem("hespor_authed") === "1") window.location.href = "/connect"
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const savedEmail = (localStorage.getItem("hespor_user_email") || "admin@hespor.com").toLowerCase()
    const savedPass = localStorage.getItem("hespor_user_password") || "Hespor123!"
    if (email.trim().toLowerCase() === savedEmail && password === savedPass) {
      if (remember) localStorage.setItem("hespor_authed", "1")
      window.location.href = "/connect"
    } else {
      setErr("Invalid email or password")
    }
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
        <h1 className="text-3xl font-semibold text-center">Log In to HESPOR</h1>
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Password</label>
              <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="Please enter your password"
              required
              className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && <p className="text-sm text-rose-600">{err}</p>}

          <label className="inline-flex items-center gap-2 text-sm select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
            />
            <span>
              Remember Me <span className="text-gray-500">(if this is a private computer)</span>
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 transition"
          >
            LOG IN
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to HESPOR?{" "}
          <Link href="/auth/sign-up" className="text-emerald-700 font-medium">
            Sign Up Now
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          Problems or questions?{" "}
          <a href="mailto:info@hespor.com" className="text-emerald-700 font-medium">
            Contact Us
          </a>
        </p>
      </div>
    </main>
  )
}

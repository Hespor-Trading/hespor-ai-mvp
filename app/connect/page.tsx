// app/connect/page.tsx
// Drop this file into your Next.js app router project (./app/connect/page.tsx)
// TailwindCSS assumed. No external deps required.
// Uses public envs: NEXT_PUBLIC_SP_OAUTH_URL, NEXT_PUBLIC_ADS_OAUTH_URL
// If you don't have the OAuth URLs yet, the buttons will be disabled.

'use client'

import Image from 'next/image'
import { useMemo } from 'react'

export default function ConnectPage() {
  const SP_URL = process.env.NEXT_PUBLIC_SP_OAUTH_URL || ''
  const ADS_URL = process.env.NEXT_PUBLIC_ADS_OAUTH_URL || ''

  const canConnect = useMemo(() => Boolean(SP_URL && ADS_URL), [SP_URL, ADS_URL])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Swap /logo.svg with your actual asset; or use text fallback */}
            <div className="relative h-8 w-8 rounded-xl bg-emerald-600" aria-hidden />
            <span className="font-semibold tracking-tight text-xl">HESPOR</span>
          </div>
          <nav className="text-sm hidden sm:block">
            <a href="/" className="text-gray-500 hover:text-gray-900 transition">Home</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-xs font-medium ring-1 ring-inset ring-emerald-200">From chaos to control</span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
            Connect your Amazon accounts
            <span className="block text-emerald-600">and unlock Hespor AI</span>
          </h1>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Securely authorize Seller Central (SP‑API) and Amazon Ads so our AI can
            diagnose wasted spend, surface missed opportunities, and suggest fixes you
            approve. No contracts. You stay in control.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={SP_URL || '#'}
              aria-disabled={!SP_URL}
              className={`inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${SP_URL ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              1) Connect Amazon Seller (SP‑API)
            </a>
            <a
              href={ADS_URL || '#'}
              aria-disabled={!ADS_URL}
              className={`inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${ADS_URL ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              2) Connect Amazon Ads
            </a>
            <p className="text-xs text-gray-500">
              You’ll be redirected to Amazon to sign in and grant read access. You can revoke at any time in Seller Central / Ads settings.
            </p>
          </div>
        </div>

        {/* Right card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold">What happens next</h2>
          <ol className="mt-4 space-y-4 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
              <div>
                <p className="font-medium">Secure Amazon login</p>
                <p className="text-gray-500">We redirect you to Amazon’s official OAuth page — we never see your password.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</span>
              <div>
                <p className="font-medium">Instant diagnostics</p>
                <p className="text-gray-500">Your dashboard lights up with ACoS/TACoS, wasted spend, win/loss keywords, and quick wins.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</span>
              <div>
                <p className="font-medium">Approve fixes (optional)</p>
                <p className="text-gray-500">Our AI proposes changes. You approve before anything is applied — zero risk.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">4</span>
              <div>
                <p className="font-medium">Scale smarter</p>
                <p className="text-gray-500">Focus budget on winners, protect inventory, and grow profitably.</p>
              </div>
            </li>
          </ol>

          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-900 ring-1 ring-inset ring-emerald-200">
            <p className="font-medium">Data use</p>
            <p className="mt-1">We analyze ads & listings only. We never access your funds, customer PII, or credentials.</p>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            <span>Amazon SP‑API & Ads Partner compliant</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HESPOR. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="mailto:info@hespor.com" className="hover:text-gray-900">info@hespor.com</a>
            <a href="https://hespor.com" className="hover:text-gray-900">hespor.com</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Image src="/logo.jpg" alt="HESPOR AI" width={120} height={32} className="h-8 w-auto" />
            <p className="text-sm text-muted-foreground">AI-powered Amazon PPC automation that talks to you.</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Learning Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-[var(--brand-green)] hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hespor AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

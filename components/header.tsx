"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-6">
        <Link href="/" className="flex items-center space-x-2 pl-3 md:pl-0 transition-opacity hover:opacity-80">
          <Image
            src="/images/design-mode/Black%20Logo%20%281%29.png"
            alt="HESPOR"
            width={140}
            height={35}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>

        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link href="#features" className="text-foreground/60 transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-foreground/60 transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="#pricing" className="text-foreground/60 transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/about" className="text-foreground/60 transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-foreground/60 transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button size="sm" className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"

interface AuthControlsProps {
  size?: "sm" | "default" | "lg"
  showEmail?: boolean
}

export function AuthControls({ size = "sm", showEmail = false }: AuthControlsProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-9 w-20 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        {showEmail && <span className="hidden text-sm text-muted-foreground md:inline-block">{user.email}</span>}
        <Button
          variant="ghost"
          size={size}
          onClick={handleSignOut}
          className="text-foreground/60 hover:text-foreground"
        >
          Sign Out
        </Button>
        <Link href="/dashboard">
          <Button size={size} className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white">
            Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/auth/login">
        <Button variant="ghost" size={size} className="hidden md:inline-flex">
          Sign In
        </Button>
      </Link>
      <Link href="/auth/sign-up">
        <Button size={size} className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white">
          Get Started
        </Button>
      </Link>
    </div>
  )
}

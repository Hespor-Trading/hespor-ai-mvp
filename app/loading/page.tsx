"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LoadingPage() {
  const router = useRouter()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    let isActive = true

    async function checkStatus() {
      try {
        const res = await fetch("/api/amazon/status", { cache: "no-store" })

        if (res.status === 401) {
          if (isActive && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true
            router.replace("/auth/login")
          }
          return
        }

        const data = await res.json()

        if (!isActive || hasRedirectedRef.current) return

        if (data?.status === "ready") {
          hasRedirectedRef.current = true
          router.replace("/dashboard")
        } else if (data?.status === "missing" || data?.status === "partial") {
          // If not connected yet, send the user to onboarding
          hasRedirectedRef.current = true
          router.replace("/onboarding")
        }
      } catch {
        // Ignore transient errors and try again shortly
      }
    }

    // Initial check
    checkStatus()

    // Poll briefly in case the session finalizes right after callback
    const id = setInterval(checkStatus, 2000)

    return () => {
      isActive = false
      clearInterval(id)
    }
  }, [router])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Preparing your account…</p>
      </div>
    </div>
  )
}

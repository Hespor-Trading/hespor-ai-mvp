"use client"

import { useState } from "react"

import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle")
  const [msg, setMsg] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("idle")
    setMsg("")
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    if (error) {
      setStatus("error")
      setMsg(error.message)
      return
    }
    setStatus("sent")
    setMsg("If that email exists, a reset link has been sent.")
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <button type="submit">Send reset link</button>
      {msg && <p data-status={status}>{msg}</p>}
    </form>
  )
}

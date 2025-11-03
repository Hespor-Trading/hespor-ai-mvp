"use client"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Debug = {
  env: { NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY_prefix: string; projectRef: string }
  runtime: { origin: string; expectedCallback: string; expectedAmazonNext: string }
}

export default function AuthHealth() {
  const [debug, setDebug] = useState<Debug | null>(null)
  const [sessionStatus, setSessionStatus] = useState<string>("checking?")
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/auth/debug").then(r=>r.json()).then(setDebug).catch(e=>setErrors(x=>[...x, "debug_fetch:"+String(e)]))
  }, [])

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      if (error) setErrors(x=>[...x, "getSession:"+error.message])
      setSessionStatus(data?.session ? "HAS_SESSION" : "NO_SESSION")
    }
    run()
  }, [])

  const oauthStartUrl = useMemo(() => {
    if (!debug) return "#"
    const params = new URLSearchParams({ redirect_to: `${debug.runtime.expectedCallback}?next=/connect/amazon` })
    // Supabase JS uses its own flow, but this gives a clickable sanity check against provider disable/mismatch
    return `${debug.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&${params.toString()}`
  }, [debug])

  if (!debug) return <pre>Loading health?</pre>

  const findings: string[] = []
  if (!debug.env.NEXT_PUBLIC_SUPABASE_URL.includes(".supabase.co")) findings.push("? NEXT_PUBLIC_SUPABASE_URL does not look like a Supabase URL")
  if (debug.env.projectRef === "unknown") findings.push("? Cannot parse Supabase projectRef from NEXT_PUBLIC_SUPABASE_URL")
  if (!debug.runtime.origin.startsWith("http")) findings.push("? Could not detect origin (host/proto headers)")
  if (!debug.runtime.expectedCallback.endsWith("/auth/callback")) findings.push("? Callback path is not /auth/callback")
  if (sessionStatus === "NO_SESSION") findings.push("?? No active session (this is fine on health page)")

  return (
    <div style={{maxWidth: 860, margin: "40px auto", fontFamily: "ui-sans-serif, system-ui"}}>
      <h1>Auth Doctor</h1>
      <h3>Environment</h3>
      <pre>{JSON.stringify(debug.env, null, 2)}</pre>
      <h3>Runtime</h3>
      <pre>{JSON.stringify(debug.runtime, null, 2)}</pre>
      <h3>Checks</h3>
      <ul>
        <li>Session: <b>{sessionStatus}</b></li>
        {findings.map((f,i)=><li key={i}>{f}</li>)}
      </ul>
      {errors.length>0 && (
        <>
          <h3>Errors</h3>
          <pre>{errors.join("\n")}</pre>
        </>
      )}
      <h3>Actions</h3>
      <ol>
        <li>Open Supabase ? <b>Auth ? Providers ? Google</b> and ensure it?s <b>ON</b> for project <code>{debug.env.projectRef}</code>.</li>
        <li>Supabase ? <b>Auth ? URL Configuration</b>: Site URL = <code>{debug.runtime.origin}</code>; Add Redirect URL = <code>{debug.runtime.expectedCallback}</code>.</li>
        <li>Google Cloud ? OAuth client: Authorized redirect URIs must include:<br/>
          <code>https://{debug.env.projectRef}.supabase.co/auth/v1/callback</code> and <code>{debug.runtime.expectedCallback}</code>.</li>
        <li>Click this test link to see if provider is enabled for THIS project:<br/>
          <a href={oauthStartUrl}>{oauthStartUrl}</a></li>
      </ol>
    </div>
  )
}

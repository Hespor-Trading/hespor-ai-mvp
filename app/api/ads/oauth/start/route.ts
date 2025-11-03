import { NextResponse } from "next/server"

const AUTH_BASE = process.env.ADS_AUTH_BASE ?? "https://www.amazon.com/ap/oa"
// Minimal scopes; adjust as needed.
const SCOPES = process.env.ADS_SCOPES ??
  "advertising::campaign_management,advertising::audiences_management"

// We keep state generation simple for now. In production, persist + verify.
function makeState() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function POST() {
  const clientId = process.env.ADS_CLIENT_ID
  const redirectUri = process.env.ADS_REDIRECT_URI

  // Dry-run safe: if missing envs, don?t try to redirect off-site
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { ok: false, reason: "Missing ADS_CLIENT_ID or ADS_REDIRECT_URI" },
      { status: 400 }
    )
  }

  const state = makeState()
  const url = new URL(AUTH_BASE)
  url.searchParams.set("client_id", clientId)
  url.searchParams.set("scope", SCOPES)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("redirect_uri", redirectUri)
  url.searchParams.set("state", state)

  // Optionally add marketplace/region if you use it:
  // url.searchParams.set("marketplace_id", "ATVPDKIKX0DER")

  return NextResponse.redirect(url.toString(), { status: 302 })
}

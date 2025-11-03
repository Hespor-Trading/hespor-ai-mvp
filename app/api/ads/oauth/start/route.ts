import { NextResponse } from "next/server"

const REQUIRED_ENV_VARS = [
  "ADS_CLIENT_ID",
  "ADS_REDIRECT_URI",
  "ADS_AUTH_BASE",
  "ADS_SCOPES",
] as const

function getEnv(name: (typeof REQUIRED_ENV_VARS)[number]) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export async function POST() {
  try {
    const clientId = getEnv("ADS_CLIENT_ID")
    const redirectUri = getEnv("ADS_REDIRECT_URI")
    const authBase = getEnv("ADS_AUTH_BASE")
    const scopes = getEnv("ADS_SCOPES")

    const statePayload = {
      nonce: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    const state = Buffer.from(JSON.stringify(statePayload)).toString(
      "base64url",
    )

    const authUrl = new URL(authBase)
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("scope", scopes)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("state", state)

    return NextResponse.redirect(authUrl.toString(), { status: 302 })
  } catch (error) {
    console.error("Failed to start Amazon Ads OAuth flow", error)
    return new NextResponse("Failed to start authorization flow", {
      status: 500,
    })
  }
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 })
}

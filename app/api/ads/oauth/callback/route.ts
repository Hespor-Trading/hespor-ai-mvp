import { NextRequest, NextResponse } from "next/server"

const TOKEN_ENDPOINT = "https://api.amazon.com/auth/o2/token"

const REQUIRED_ENV_VARS = [
  "ADS_CLIENT_ID",
  "ADS_CLIENT_SECRET",
  "ADS_REDIRECT_URI",
] as const

function getEnv(name: (typeof REQUIRED_ENV_VARS)[number]) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function buildRedirect(nextUrl: URL, path: string, reason?: string) {
  const url = new URL(path, nextUrl.origin)

  if (reason) {
    url.searchParams.set("reason", reason)
  }

  return url.toString()
}

function encodeReason(message: string) {
  return Buffer.from(message).toString("base64url")
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get("code")

  if (!code) {
    const reason = encodeReason("Missing authorization code from Amazon")
    return NextResponse.redirect(
      buildRedirect(request.nextUrl, "/connect/amazon/error", reason),
      {
        status: 302,
      },
    )
  }

  try {
    const clientId = getEnv("ADS_CLIENT_ID")
    const clientSecret = getEnv("ADS_CLIENT_SECRET")
    const redirectUri = getEnv("ADS_REDIRECT_URI")

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    })

    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text()
      const reason = encodeReason(
        `Amazon token exchange failed: ${errorBody || tokenResponse.statusText}`,
      )

      return NextResponse.redirect(
        buildRedirect(request.nextUrl, "/connect/amazon/error", reason),
        { status: 302 },
      )
    }

    // Tokens would typically be stored here.
    await tokenResponse.json()

    return NextResponse.redirect(
      buildRedirect(request.nextUrl, "/connect/amazon/success"),
      { status: 302 },
    )
  } catch (error) {
    console.error("Amazon Ads OAuth callback failed", error)
    const reason = encodeReason("Unexpected error during Amazon authorization")
    return NextResponse.redirect(
      buildRedirect(request.nextUrl, "/connect/amazon/error", reason),
      { status: 302 },
    )
  }
}

export async function POST() {
  return new NextResponse("Method Not Allowed", { status: 405 })
}

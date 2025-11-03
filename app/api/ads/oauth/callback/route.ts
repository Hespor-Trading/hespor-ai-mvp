import { NextResponse } from "next/server"

// This is a placeholder callback to complete the loop.
// Later, exchange ?code for tokens and store them securely.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const state = searchParams.get("state")

  void state

  // For now, just route to success/with params for debugging.
  if (error) {
    return NextResponse.redirect(`/connect/amazon?error=${encodeURIComponent(error)}`)
  }
  if (!code) {
    return NextResponse.redirect(`/connect/amazon?error=missing_code`)
  }

  // TODO: exchange code -> tokens using ADS_TOKEN_URL. Store by user.
  return NextResponse.redirect(`/connect/amazon/success`)
}

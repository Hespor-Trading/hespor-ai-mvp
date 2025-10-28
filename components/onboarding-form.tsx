"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import type { AmazonIntegration } from "@/lib/amazon"

interface OnboardingFormProps {
  userId: string
  existingIntegration: AmazonIntegration | null
}

export function OnboardingForm({ userId, existingIntegration }: OnboardingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [adsConnected, setAdsConnected] = useState(existingIntegration?.ads_connected ?? false)
  const [spConnected, setSpConnected] = useState(existingIntegration?.sp_connected ?? false)

  const handleConnectAds = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const adsRefreshToken = formData.get("ads_refresh_token") as string

    try {
      const response = await fetch("/api/amazon/connect-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, adsRefreshToken }),
      })

      if (!response.ok) {
        throw new Error("Failed to connect Amazon Ads")
      }

      setAdsConnected(true)

      // If both are connected, redirect to dashboard
      if (spConnected) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Amazon Ads")
    } finally {
      setLoading(false)
    }
  }

  const handleConnectSP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const spRefreshToken = formData.get("sp_refresh_token") as string

    try {
      const response = await fetch("/api/amazon/connect-sp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, spRefreshToken }),
      })

      if (!response.ok) {
        throw new Error("Failed to connect Amazon SP-API")
      }

      setSpConnected(true)

      // If both are connected, redirect to dashboard
      if (adsConnected) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Amazon SP-API")
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    // For demo purposes, mark as connected and redirect
    fetch("/api/amazon/skip-onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).then(() => {
      router.push("/dashboard")
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {adsConnected ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <CardTitle>Amazon Advertising API</CardTitle>
              <CardDescription>Connect your Amazon Ads account to manage PPC campaigns</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!adsConnected ? (
            <form onSubmit={handleConnectAds} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ads_refresh_token">Refresh Token</Label>
                <Input
                  id="ads_refresh_token"
                  name="ads_refresh_token"
                  type="text"
                  placeholder="Enter your Amazon Ads refresh token"
                  required
                />
                <p className="text-xs text-muted-foreground">Get your refresh token from Amazon Advertising Console</p>
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect Amazon Ads
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">✓ Amazon Advertising API connected successfully</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {spConnected ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <CardTitle>Amazon SP-API</CardTitle>
              <CardDescription>Connect your Seller Central account to access product data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!spConnected ? (
            <form onSubmit={handleConnectSP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sp_refresh_token">Refresh Token</Label>
                <Input
                  id="sp_refresh_token"
                  name="sp_refresh_token"
                  type="text"
                  placeholder="Enter your SP-API refresh token"
                  required
                />
                <p className="text-xs text-muted-foreground">Get your refresh token from Seller Central</p>
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect SP-API
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">✓ Amazon SP-API connected successfully</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={handleSkip}>
          Skip for now (Demo Mode)
        </Button>
        {adsConnected && spConnected && (
          <Button onClick={() => router.push("/dashboard")}>Continue to Dashboard</Button>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Loader2, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthorizePage() {
  const [loading, setLoading] = useState(false)

  const handleAuthorize = async () => {
    setLoading(true)
    // Full page redirect to begin Amazon Ads OAuth
    window.location.href = "/api/amazon/oauth/ads/start"
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
            <Lock className="h-5 w-5 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">Connect to your Amazon Advertising Account</CardTitle>
          <CardDescription>
            We’ll securely request access to your Amazon Ads data. You can revoke any time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAuthorize} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authorizing…
              </>
            ) : (
              "Authorize My Account"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

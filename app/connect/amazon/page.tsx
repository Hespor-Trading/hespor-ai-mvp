import Link from "next/link"

export default function ConnectAmazonPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-14 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Connect Amazon Ads
        </h1>
        <p className="text-lg text-muted-foreground">
          We&apos;ll open Amazon to request access to your advertising data. By
          continuing, you agree to our Terms and Privacy Policy.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/terms"
            className="underline underline-offset-4 transition hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="underline underline-offset-4 transition hover:text-foreground"
          >
            Privacy Policy
          </Link>
        </div>
        <form
          action="/api/ads/oauth/start"
          method="POST"
          className="pt-4"
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-foreground px-6 py-3 text-base font-medium text-background shadow-sm transition hover:bg-foreground/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2"
          >
            Connect to Advertising Data
          </button>
        </form>
      </div>
    </main>
  )
}

import Link from "next/link"

type ErrorPageProps = {
  searchParams?: {
    reason?: string
  }
}

function decodeReason(reason?: string) {
  if (!reason) {
    return "We couldn't connect to Amazon Ads. Please try again."
  }

  try {
    return Buffer.from(reason, "base64url").toString("utf-8")
  } catch (error) {
    console.error("Failed to decode error reason", error)
    return "We couldn't connect to Amazon Ads. Please try again."
  }
}

export default function AmazonConnectErrorPage({ searchParams }: ErrorPageProps) {
  const message = decodeReason(searchParams?.reason)

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-14 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Connection error
        </h1>
        <p className="text-lg text-muted-foreground">{message}</p>
        <div className="pt-4">
          <Link
            href="/connect/amazon"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-6 py-3 text-base font-medium text-background shadow-sm transition hover:bg-foreground/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2"
          >
            Try again
          </Link>
        </div>
      </div>
    </main>
  )
}

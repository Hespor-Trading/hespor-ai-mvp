import { NextResponse } from "next/server";

export async function GET() {
  // Temporary stub (no S3 yet)
  return NextResponse.json({
    items: [
      { time: "07:30", title: "Raised bids on best sellers", detail: "We increased bids for strong keywords that bring profitable sales." },
      { time: "07:30", title: "Paused wasteful keyword", detail: "Stopped spending on 'drawer organizer large' because it wasted money without sales." },
      { time: "07:30", title: "Increased budget", detail: "Added 10% more budget to a campaign that performs well and has enough stock." },
    ],
  });
}

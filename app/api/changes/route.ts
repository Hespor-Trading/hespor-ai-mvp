import { NextResponse } from "next/server";

// TODO: later read from S3 applied/… and summarize
export async function GET() {
  const demo = [
    { time: "Today 09:20", summary: "Raised bids +10% on exact winners under breakeven ACOS." },
    { time: "Today 09:18", summary: "Paused two keywords with ACOS > breakeven +10% and added cross-negatives." },
    { time: "Yesterday 07:32", summary: "Created new exact campaign for TERM 'drawer organizer 16 inch'." },
  ];
  return NextResponse.json(demo);
}

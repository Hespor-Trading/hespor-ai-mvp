// Forward /api/ads/top2 to /api/ads/top (keeps existing dashboard call working)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export { GET } from "../top/route";

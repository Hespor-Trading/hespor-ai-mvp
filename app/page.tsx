export default function DashboardPreview() {
const palette = {
green: "#00D3A4", // Hespor brand green
greyBg: "#ECEFF1", // light grey
greyBorder: "#D7DBDF",
} as const;


return (
<div className="min-h-screen p-6" style={{ background: palette.greyBg }}>
<div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
{/* LEFT COLUMN */}
<section className="grid grid-rows-[auto_auto_1fr] gap-4">
{/* Top-left: brand connect CTA */}
<div
className="rounded-2xl border p-4 shadow-sm"
style={{ borderColor: palette.greyBorder, background: "white" }}
>
<div className="text-sm text-neutral-600 mb-2 font-semibold">
Hespor Connection
</div>
<a
href="/api/connect/start"
className="block w-full rounded-full px-5 py-3 font-semibold text-center shadow transition hover:shadow-md"
style={{
background: `linear-gradient(90deg, ${palette.green}, #34D399)`,
color: "#042925",
textDecoration: "none",
}}
>
Use Hespor Algorithm to optimize your campaigns — $49/mo • Free trial
</a>
<p className="mt-2 text-xs text-neutral-500">
Click above to connect both Amazon Ads API and SP-API. Once connected, you’ll be redirected back here and the
dashboard + chat assistant will become active.
</p>
</div>


{/* Quick stats */}
<div className="grid grid-cols-2 gap-3">
{[
{ label: "Spend (7d)", value: "$2,430" },
{ label: "Sales (7d)", value: "$7,980" },
{ label: "ACOS", value: "30%" },
{ label: "Units", value: "412" },
].map((t, i) => (
<div
key={i}
className="rounded-xl p-3 text-sm font-medium"
style={{ background: "white", border: "1px solid " + palette.greyBorder }}
>
<div className="text-neutral-500 text-xs">{t.label}</div>
<div className="text-neutral-900 text-lg">{t.value}</div>
</div>
))}
</div>


{/* Recent changes */}
<div
className="rounded-2xl p-4"
style={{ background: "white", border: "1px solid " + palette.greyBorder }}
>
<div className="mb-3 flex items-center justify-between">
<div className="text-base font-bold">Recent changes</div>
<span
className="text-xs rounded-full px-2 py-1"
style={{ background: palette.greyBg, color: "#374151" }}
>
from applied/DECOGAR
</span>
</div>
<ul className="space-y-3">
{[
{
time: "Today 09:20",
summary: "Raised bids +10% on exact winners (ACOS ≤ breakeven).",
}

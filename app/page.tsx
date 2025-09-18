export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  const palette = {
    green: "#00D3A4",   // Hespor green
    greyBg: "#ECEFF1",  // background grey
    black: "#0F172A",
    white: "#FFFFFF",
    greyBorder: "#D7DBDF",
  } as const;

  return (
    <div className="min-h-screen" style={{ background: palette.greyBg }}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 p-6">
        {/* LEFT COLUMN */}
        <section className="flex flex-col gap-6">
          {/* Top-left: CTA */}
          <div
            className="rounded-2xl border p-6 shadow-sm"
            style={{ borderColor: palette.greyBorder, background: palette.white }}
          >
            <h2 className="text-lg font-bold text-neutral-800 mb-3">
              Automate with Hespor AI
            </h2>
            {/* One-click connect (Ads API ➜ SP-API) */}
            <a
              href="/api/connect/start"
              className="block w-full rounded-full px-6 py-4 font-semibold text-center shadow-md transition hover:shadow-lg"
              style={{
                background: `linear-gradient(90deg, ${palette.green}, #34D399)`,
                color: palette.black,
                textDecoration: "none",
              }}
            >
              Use Hespor Algorithm – $49/month • Free Trial
            </a>
            <p className="mt-3 text-sm text-neutral-600">
              Connect your Amazon Ads & SP-API accounts to start optimizing instantly.
            </p>
          </div>

          {/* Recent changes (humanized) */}
          <div
            className="rounded-2xl border p-6 flex-1"
            style={{ borderColor: palette.greyBorder, background: palette.white }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-800">
                Recent Campaign Updates
              </h3>
              <span
                className="text-xs rounded-full px-3 py-1"
                style={{ background: palette.greyBg, color: palette.black }}
              >
                from applied/DECOGAR
              </span>
            </div>
            <ul className="space-y-4">
              {[
                {
                  time: "Today 09:20",
                  summary: "Raised bids +10% on exact winners (ACOS ≤ breakeven).",
                  tag: "Bid +10%",
                },
                {
                  time: "Today 09:18",
                  summary:
                    "Paused 2 poor keywords (ACOS ≥ breakeven +10%) and added cross-negatives.",
                  tag: "Paused & Negated",
                },
                {
                  time: "Yesterday 07:32",
                  summary: "Launched exact campaign for drawer organizer (16 inch).",
                  tag: "New Campaign",
                },
              ].map((c, i) => (
                <li key={i} className="border-b pb-3 last:border-0" style={{ borderColor: palette.greyBorder }}>
                  <div className="text-xs text-neutral-500 mb-1">{c.time}</div>
                  <div className="flex gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: palette.greyBg, color: palette.black }}
                    >
                      {c.tag}
                    </span>
                    <span className="text-neutral-700">{c.summary}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT COLUMN – large ChatGPT-like panel */}
        <section
          className="rounded-2xl border p-6 flex flex-col"
          style={{ borderColor: palette.greyBorder, background: palette.white }}
        >
          <h2 className="text-xl font-bold mb-4">AI Assistant</h2>

          {/* Chat window */}
          <div
            className="flex-1 rounded-xl border p-4 overflow-y-auto mb-4"
            style={{ borderColor: palette.greyBorder, background: "#F9FAFB" }}
          >
            <div className="space-y-4 text-sm">
              <div
                className="max-w-[70%] rounded-2xl px-4 py-2 border"
                style={{ background: palette.white, borderColor: palette.greyBorder }}
              >
                Hi! I’ll summarize applied changes and answer your campaign questions.
              </div>
              <div
                className="max-w-[70%] ml-auto rounded-2xl px-4 py-2 border"
                style={{ background: palette.green, color: palette.white, borderColor: palette.green }}
              >
                Show me today’s winners under breakeven ACOS.
              </div>
              <div
                className="max-w-[70%] rounded-2xl px-4 py-2 border"
                style={{ background: palette.white, borderColor: palette.greyBorder }}
              >
                Sure — 12 keywords (avg ACOS 18%). Recommended +12% bids and +10% budgets across 3 campaigns.
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message…"
              className="flex-1 rounded-full px-4 py-2 border outline-none"
              style={{ borderColor: palette.greyBorder }}
            />
            <button
              className="rounded-full px-6 py-2 font-semibold text-white"
              style={{ background: palette.green }}
              type="button"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

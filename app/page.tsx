export default function Page() {
  // Brand palette
  const palette = {
    green: "#00D3A4",
    greyBg: "#ECEFF1",
    greyBorder: "#D7DBDF",
  } as const;

  return (
    <div className="min-h-screen p-6" style={{ background: palette.greyBg }}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        {/* LEFT COLUMN */}
        <section className="grid grid-rows-[auto_auto_1fr] gap-4">
          {/* Top-left: connect CTA */}
          <div
            className="rounded-2xl border p-4 shadow-sm"
            style={{ borderColor: palette.greyBorder, background: "white" }}
          >
            <div className="text-sm text-neutral-600 mb-2 font-semibold">
              Hespor Connection
            </div>

            {/* One-click connect (Ads API → SP-API) */}
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
              Click above to connect both Amazon Ads API and SP-API. You’ll return here when finished.
            </p>
          </div>

          {/* Quick stats (placeholder) */}
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

          {/* Recent changes (placeholder) */}
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
                  tag: "Bid +10%",
                },
                {
                  time: "Today 09:18",
                  summary:
                    "Paused 2 keywords (ACOS ≥ breakeven +10%) and added cross-negatives.",
                  tag: "Pause & negate",
                },
                {
                  time: "Yesterday 07:32",
                  summary: "Launched exact campaign: drawer organizer 16 inch.",
                  tag: "New campaign",
                },
              ].map((c, i) => (
                <li
                  key={i}
                  className="border-b pb-2 last:border-b-0"
                  style={{ borderColor: palette.greyBorder }}
                >
                  <div className="text-xs text-neutral-500">{c.time}</div>
                  <div className="flex items-start gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{ background: palette.greyBg, color: "#0f172a" }}
                    >
                      {c.tag}
                    </span>
                    <span className="text-neutral-800">{c.summary}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT COLUMN: Chat area (white, ChatGPT-like) */}
        <section
          className="grid grid-rows-[auto_1fr_auto] gap-3 rounded-2xl p-4"
          style={{ background: "white", border: "1px solid " + palette.greyBorder }}
        >
          <div className="text-xl font-extrabold">Chat</div>

          <div
            className="rounded-xl p-4 overflow-auto border"
            style={{ borderColor: palette.greyBorder, background: "white" }}
          >
            <div className="space-y-3 text-sm">
              <div
                className="max-w-[80%] rounded-2xl px-3 py-2 border"
                style={{ background: "#F7F7F8", borderColor: palette.greyBorder }}
              >
                Hi! I’ll summarize applied changes and answer questions about your ads.
              </div>
              <div
                className="max-w-[80%] ml-auto rounded-2xl px-3 py-2 border"
                style={{ background: "#FFFFFF", borderColor: palette.greyBorder }}
              >
                Great. Show me today’s winners under breakeven ACOS.
              </div>
              <div
                className="max-w-[80%] rounded-2xl px-3 py-2 border"
                style={{ background: "#F7F7F8", borderColor: palette.greyBorder }}
              >
                Winners today: 12 keywords (avg ACOS 18%). Suggested +12% bid and +10% budget on 3 campaigns.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <input
              placeholder="Type a message…"
              className="rounded-full px-4 py-2 outline-none"
              style={{ border: "1px solid " + palette.greyBorder }}
            />
            <button
              className="rounded-full px-4 py-2 font-semibold text-white"
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

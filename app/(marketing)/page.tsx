// app/(marketing)/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  const GREEN = "#00D3A4";
  const GREY_BG = "#ECEFF1";
  const GREY_BORDER = "#D7DBDF";
  const BLACK = "#0F172A";
  const WHITE = "#FFFFFF";

  const card: React.CSSProperties = {
    background: WHITE,
    border: `1px solid ${GREY_BORDER}`,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: GREY_BG,
        color: BLACK,
        display: "grid",
        gridTemplateColumns: "minmax(360px, 44%) minmax(520px, 1fr)",
        gap: 24,
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* LEFT COLUMN */}
      <section style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: 16 }}>
        {/* Top: CTA */}
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Automate with Hespor AI</div>
          <a
            href="/api/connect/start"
            style={{
              display: "block",
              textAlign: "center",
              padding: "14px 18px",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${GREEN}, #34D399)`,
              color: BLACK,
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 6px 16px rgba(16,185,129,0.18)",
            }}
          >
            Use Hespor Algorithm – $49/month • Free Trial
          </a>
          <p style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
            Connect your Amazon Ads & SP-API accounts to start optimizing instantly.
          </p>
        </div>

        {/* Spacer (optional stats later) */}
        <div />

        {/* Bottom: Recent changes */}
        <div style={{ ...card, display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Recent Campaign Updates</div>
            <span
              style={{
                background: GREY_BG,
                color: BLACK,
                borderRadius: 999,
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              from applied/DECOGAR
            </span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { time: "Today 09:20", tag: "Bid +10%", summary: "Raised bids 10% on exact winners (ACOS ≤ breakeven)." },
              { time: "Today 09:18", tag: "Paused & Negated", summary: "Paused 2 high-ACOS keywords and added cross-negatives." },
              { time: "Yesterday 07:32", tag: "New Campaign", summary: "Launched exact campaign: “drawer organizer 16 inch”." },
            ].map((c, i) => (
              <li
                key={i}
                style={{
                  padding: "10px 0",
                  borderBottom: i < 2 ? `1px dashed ${GREY_BORDER}` : "none",
                }}
              >
                <div style={{ fontSize: 12, color: "#6b7280" }}>{c.time}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span
                    style={{
                      background: "#F4F6F7",
                      color: "#111827",
                      borderRadius: 999,
                      padding: "4px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {c.tag}
                  </span>
                  <span>{c.summary}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RIGHT COLUMN — Chat */}
      <section
        style={{
          ...card,
          borderRadius: 20,
          padding: 16,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>AI Assistant</div>

        {/* Chat window */}
        <div
          style={{
            background: "#F9FAFB",
            border: `1px solid ${GREY_BORDER}`,
            borderRadius: 14,
            padding: 12,
            overflow: "auto",
          }}
        >
          <div style={{ maxWidth: "70%", border: `1px solid ${GREY_BORDER}`, borderRadius: 14, padding: "8px 10px", background: WHITE, margin: "8px 0" }}>
            Hi! I’ll summarize applied changes and answer your campaign questions.
          </div>
          <div style={{ maxWidth: "70%", marginLeft: "auto", border: `1px solid ${GREEN}`, borderRadius: 14, padding: "8px 10px", background: GREEN, color: WHITE, margin: "8px 0" }}>
            Show me today’s winners under breakeven ACOS.
          </div>
          <div style={{ maxWidth: "70%", border: `1px solid ${GREY_BORDER}`, borderRadius: 14, padding: "8px 10px", background: WHITE, margin: "8px 0" }}>
            Sure — 12 keywords (avg ACOS 18%). Recommended +12% bids and +10% budgets across 3 campaigns.
          </div>
        </div>

        {/* Input (static UI, no client handlers in Server Component) */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center", marginTop: 10 }}
        >
          <input
            placeholder="Type a message…"
            style={{
              border: `1px solid ${GREY_BORDER}`,
              borderRadius: 999,
              padding: "12px 16px",
              outline: "none",
              background: WHITE,
            }}
          />
          <button
            type="button"
            style={{
              background: GREEN,
              color: "#052e2b",
              border: 0,
              borderRadius: 999,
              padding: "10px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
}

export default function Page() {
  // Brand palette
  const GREEN = "#00D3A4";      // Hespor green
  const GREY_BG = "#ECEFF1";    // light grey
  const GREY_BORDER = "#D7DBDF";
  const TEXT = "#0B0F14";

  const card = {
    background: "#fff",
    border: `1px solid ${GREY_BORDER}`,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  } as const;

  const chip = {
    background: GREY_BG,
    color: "#0f172a",
    borderRadius: 999,
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 700,
  } as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: GREY_BG,
        color: TEXT,
        display: "grid",
        gridTemplateColumns: "minmax(360px, 44%) minmax(520px, 1fr)",
        gap: 24,
        padding: 24,
      }}
    >
      {/* LEFT COLUMN */}
      <section style={{ display: "grid", gridTemplateRows: "auto auto 1fr", gap: 16 }}>
        {/* Top: CTA */}
        <div style={card}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Hespor Connection</div>
          <a
            href="/api/connect/start"
            style={{
              display: "block",
              textAlign: "center",
              padding: "14px 18px",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${GREEN}, #34D399)`,
              color: "#042925",
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 2px 12px rgba(16,185,129,0.25)",
            }}
          >
            Use Hespor Algorithm to optimize your campaigns — <b>$49/mo</b> • Free trial
          </a>
          <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
            One click connects **Amazon Ads** and **SP-API**. You’ll return here when finished.
          </p>
        </div>

        {/* Middle: quick stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {[
            { label: "Spend (7d)", value: "$2,430" },
            { label: "Sales (7d)", value: "$7,980" },
            { label: "ACOS", value: "30%" },
            { label: "Units", value: "412" },
          ].map((t, i) => (
            <div key={i} style={{ ...card, padding: 12 }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{t.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{t.value}</div>
            </div>
          ))}
        </div>

        {/* Bottom: humanized recent changes */}
        <div style={{ ...card, display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Recent changes</div>
            <span style={chip}>from applied/DECOGAR</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { time: "Today 09:20", tag: "Bid +10%", summary: "Raised bids 10% on exact winners (ACOS ≤ breakeven)." },
              { time: "Today 09:18", tag: "Pause & negate", summary: "Paused 2 high-ACOS keywords and added cross-negatives." },
              { time: "Yesterday 07:32", tag: "New campaign", summary: "Launched exact campaign: “drawer organizer 16 inch”." },
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
                  <span style={{ ...chip, background: "#f4f6f7" }}>{c.tag}</span>
                  <span>{c.summary}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RIGHT COLUMN — ChatGPT-like panel */}
      <section
        style={{
          ...card,
          borderRadius: 20,
          padding: 14,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Chat</div>

        <div
          style={{
            background: "#fff",
            border: `1px solid ${GREY_BORDER}`,
            borderRadius: 14,
            padding: 12,
            overflow: "auto",
          }}
        >
          <div style={{ maxWidth: "70%", border: `1px solid ${GREY_BORDER}`, borderRadius: 14, padding: "8px 10px", background: "#F7F7F8", margin: "8px 0" }}>
            Hi! I’ll summarize applied changes and answer questions about your ads.
          </div>
          <div style={{ maxWidth: "70%", marginLeft: "auto", border: `1px solid ${GREY_BORDER}`, borderRadius: 14, padding: "8px 10px", background: "#FFFFFF", margin: "8px 0" }}>
            Great. Show me today’s winners under breakeven ACOS.
          </div>
          <div style={{ maxWidth: "70%", border: `1px solid ${GREY_BORDER}`, borderRadius: 14, padding: "8px 10px", background: "#F7F7F8", margin: "8px 0" }}>
            Winners today: 12 keywords (avg ACOS 18%). Suggested +12% bid and +10% budget on 3 campaigns.
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center", marginTop: 10 }}
        >
          <input
            placeholder="Type a message…"
            style={{
              border: `1px solid ${GREY_BORDER}`,
              borderRadius: 999,
              padding: "12px 16px",
              outline: "none",
            }}
          />
          <button
            type="submit"
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
        </form>
      </section>
    </main>
  );
}

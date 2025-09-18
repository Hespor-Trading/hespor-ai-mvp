export default function Page() {
  // Brand colors (adjust if you want)
  const GREEN = "#00D3A4";      // Hespor green
  const GREY_BG = "#ECEFF1";    // light grey background
  const GREY_BORDER = "#D7DBDF"; // subtle borders
  const TEXT_DARK = "#0B0F14";

  return (
    <main className="wrap">
      {/* LEFT COLUMN */}
      <section className="left">
        {/* Top: CTA card */}
        <div className="card">
          <div className="card-title">Hespor Connection</div>
          <a className="cta" href="/api/connect/start">
            Use Hespor Algorithm to optimize your campaigns — <b>$49/mo</b> • Free trial
          </a>
          <p className="muted">
            Click above to connect both Amazon Ads API and SP-API. You’ll return here when finished.
          </p>
        </div>

        {/* Middle: small stats to keep left side interesting */}
        <div className="stats">
          {[
            { label: "Spend (7d)", value: "$2,430" },
            { label: "Sales (7d)", value: "$7,980" },
            { label: "ACOS", value: "30%" },
            { label: "Units", value: "412" },
          ].map((t, i) => (
            <div className="stat" key={i}>
              <div className="stat-label">{t.label}</div>
              <div className="stat-value">{t.value}</div>
            </div>
          ))}
        </div>

        {/* Bottom: Recent changes – humanized */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent changes</div>
            <span className="chip">from applied/DECOGAR</span>
          </div>
          <ul className="changes">
            {[
              { time: "Today 09:20", tag: "Bid +10%", summary: "Raised bids 10% on exact winners (ACOS ≤ breakeven)." },
              { time: "Today 09:18", tag: "Pause & negate", summary: "Paused 2 high-ACOS keywords and added cross-negatives." },
              { time: "Yesterday 07:32", tag: "New campaign", summary: "Launched exact campaign: “drawer organizer 16 inch”." },
            ].map((c, i) => (
              <li className="change" key={i}>
                <div className="time">{c.time}</div>
                <div className="line">
                  <span className="chip light">{c.tag}</span>
                  <span className="text">{c.summary}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RIGHT COLUMN — ChatGPT-like box on white (takes ~50%) */}
      <section className="right">
        <div className="chat">
          <div className="chat-header">Chat</div>

          <div className="chat-body">
            <div className="msg bot">
              Hi! I’ll summarize applied changes and answer questions about your ads.
            </div>
            <div className="msg me">
              Great. Show me today’s winners under breakeven ACOS.
            </div>
            <div className="msg bot">
              Winners today: 12 keywords (avg ACOS 18%). Suggested +12% bid and +10% budget on 3 campaigns.
            </div>
          </div>

          <form className="chat-input" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Type a message…" />
            <button type="submit">Send</button>
          </form>
        </div>
      </section>

      <style jsx>{`
        /* Layout */
        .wrap {
          min-height: 100vh;
          background: ${GREY_BG};
          color: ${TEXT_DARK};
          display: grid;
          grid-template-columns: minmax(360px, 42%) minmax(420px, 1fr); /* ~50% right */
          gap: 24px;
          padding: 24px;
        }
        .left { display: grid; grid-template-rows: auto auto 1fr; gap: 16px; }
        .right { display: grid; }

        /* Cards & common */
        .card {
          background: #fff;
          border: 1px solid ${GREY_BORDER};
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px; }
        .card-title { font-weight: 800; font-size: 16px; }
        .muted { margin-top: 8px; font-size: 12px; color: #6b7280; }

        /* CTA */
        .cta {
          display: block;
          text-align: center;
          padding: 14px 18px;
          border-radius: 999px;
          background: linear-gradient(90deg, ${GREEN}, #34D399);
          color: #042925;
          text-decoration: none;
          font-weight: 700;
          transition: box-shadow .15s ease, transform .02s ease;
        }
        .cta:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
        .cta:active { transform: translateY(1px); }

        /* Stats */
        .stats {
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat {
          background:#fff;
          border:1px solid ${GREY_BORDER};
          border-radius:14px;
          padding:12px;
        }
        .stat-label { font-size:12px; color:#6b7280; }
        .stat-value { font-size:18px; font-weight:700; margin-top:2px; }

        /* Chips */
        .chip {
          background: ${GREY_BG};
          color: #0f172a;
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
        }
        .chip.light { background: #f4f6f7; color: #111827; }

        /* Changes */
        .changes { list-style: none; padding: 0; margin: 0; }
        .change { padding: 10px 0; border-bottom: 1px dashed ${GREY_BORDER}; }
        .change:last-child { border-bottom: 0; }
        .time { font-size: 12px; color: #6b7280; }
        .line { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .text { color: #111827; }

        /* Chat */
        .chat {
          background: #fff;
          border: 1px solid ${GREY_BORDER};
          border-radius: 20px;
          padding: 14px;
          display: grid;
          grid-template-rows: auto 1fr auto;
          min-height: calc(100vh - 48px); /* keep it big */
        }
        .chat-header { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
        .chat-body {
          background: #fff;
          border: 1px solid ${GREY_BORDER};
          border-radius: 14px;
          padding: 12px;
          overflow: auto;
        }
        .msg {
          max-width: 70%;
          font-size: 14px;
          border: 1px solid ${GREY_BORDER};
          border-radius: 14px;
          padding: 8px 10px;
          margin: 8px 0;
          line-height: 1.4;
        }
        .bot { background: #F7F7F8; }
        .me  { background: #FFFFFF; margin-left: auto; }

        .chat-input {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          align-items: center;
          margin-top: 10px;
        }
        .chat-input input {
          border: 1px solid ${GREY_BORDER};
          border-radius: 999px;
          padding: 12px 16px;
          outline: none;
        }
        .chat-input button {
          background: ${GREEN};
          color: #052e2b;
          border: 0;
          border-radius: 999px;
          padding: 10px 16px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .wrap { grid-template-columns: 1fr; }
          .chat { min-height: 60vh; }
        }
      `}</style>
    </main>
  );
}

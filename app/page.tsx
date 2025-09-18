import ConnectCta from "./components/ConnectCta";
import RecentChanges from "./components/RecentChanges";

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{
        display: "grid",
        gridTemplateColumns: "420px 1fr",
        gap: 24,
        padding: 24,
        background: "#f7f7f8",
      }}
    >
      {/* LEFT COLUMN */}
      <section style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: 16 }}>
        {/* Top-left: connect button */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <ConnectCta />
        </div>

        {/* spacer / your future widgets */}
        <div />

        {/* Bottom-left: recent changes */}
        <div>
          <RecentChanges />
        </div>
      </section>

      {/* RIGHT: big chat area */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          background: "white",
          minHeight: "70vh",
          padding: 16,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800 }}>Chat</div>

        {/* Chat body (placeholder) */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            background: "#fbfbfb",
            padding: 12,
            overflow: "auto",
          }}
        >
          <div style={{ opacity: 0.65 }}>
            ChatGPT-like panel goes here. When you drop in your chat widget/component, put it in this box and it will fill
            the right side.
          </div>
        </div>

        {/* Input bar placeholder */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            placeholder="Type a message…"
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 999,
              padding: "12px 16px",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "#111827",
              color: "white",
              borderRadius: 999,
              padding: "10px 16px",
              border: "none",
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

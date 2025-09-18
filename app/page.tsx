import ConnectCta from "./components/ConnectCta";

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px", padding: "24px" }}
    >
      {/* LEFT COLUMN */}
      <section style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: "16px" }}>
        {/* Top-left header */}
        <div style={{ fontSize: 28, fontWeight: 800 }}>Hespor Dashboard (Free)</div>

        {/* Middle-left: your content area (keep empty or add anything) */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            minHeight: 300,
          }}
        >
          <div style={{ opacity: 0.7 }}>Your widgets can go here.</div>
        </div>

        {/* Bottom-left: green connect button */}
        <div
          style={{
            borderTop: "1px dashed #e5e7eb",
            paddingTop: 12,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <ConnectCta />
        </div>
      </section>

      {/* RIGHT COLUMN — Chat panel placeholder */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Chat</div>
        <div
          style={{
            flex: 1,
            background: "#fafafa",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 12,
          }}
        >
          {/* Replace this box with your real chat widget when ready */}
          <div style={{ opacity: 0.7 }}>
            ChatGPT panel placeholder. (We’ll wire your real chat here later.)
          </div>
        </div>
      </section>
    </main>
  );
}

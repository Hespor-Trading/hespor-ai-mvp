export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Hespor AI MVP
      </h1>

      <p style={{ marginBottom: 20 }}>
        MVP is live. Connect Stripe/OpenAI later. This page uses basic HTML elements
        (no shadcn) to avoid missing component imports.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Submitted! (wire this up later)");
        }}
        style={{
          display: "grid",
          gap: 12,
          border: "1px solid #eee",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <label>
          Prompt
          <textarea
            name="prompt"
            rows={4}
            placeholder="Type something…"
            style={{ width: "100%", marginTop: 6 }}
          />
        </label>

        <label>
          API Key (optional)
          <input
            name="key"
            type="password"
            placeholder="OPENAI_API_KEY"
            style={{ width: "100%", marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            width: "fit-content",
          }}
        >
          Run
        </button>
      </form>
    </main>
  );
}

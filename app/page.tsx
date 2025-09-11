"use client";

export default function Home() {
  return (
    <main style={{maxWidth: 880, margin: "60px auto", padding: 20}}>
      <h1 style={{fontSize: 36, fontWeight: 800}}>Hespor</h1>
      <p style={{marginTop: 8}}>Revive & rank your Amazon products — automated.</p>
      <button
        onClick={() => (window.location.href="/api/connect/start")}
        style={{marginTop: 20, padding: "12px 18px", border: "1px solid #111", borderRadius: 8}}
      >
        Connect now
      </button>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

type Change = { time: string; summary: string };

export default function RecentChanges() {
  const [items, setItems] = useState<Change[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/changes");
        if (res.ok) setItems(await res.json());
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Recent changes</div>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 12,
          background: "#fafafa",
        }}
      >
        {loading && <div style={{ opacity: 0.6 }}>Loading…</div>}
        {!loading && items.length === 0 && (
          <div style={{ opacity: 0.6 }}>
            No recent changes yet. When the Applier writes to <code>applied/DECOGAR/…</code>, they’ll show up here in plain
            language.
          </div>
        )}
        {!loading &&
          items.map((c, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: i < items.length - 1 ? "1px dashed #e5e7eb" : "none" }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{c.time}</div>
              <div>{c.summary}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

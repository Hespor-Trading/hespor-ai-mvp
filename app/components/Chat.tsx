"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function Chat() {
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<{role:"user"|"ai"; text:string}[]>([
    { role: "ai", text: "Hi, I’m HESPOR AI. Ask me about your performance, costs, and ideas to improve." }
  ]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseBrowser().auth.getUser();
      setUserId(user?.id ?? null);
    })();
  }, []);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [msgs]);

  async function send() {
    if (!input.trim() || !userId) return;
    const question = input.trim();
    setInput("");
    setMsgs(m => [...m, { role: "user", text: question }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message: question }),
    });
    const data = await res.json();
    setMsgs(m => [...m, { role: "ai", text: data.error ?? data.text }]);
  }

  return (
    <div className="flex h-full flex-col border-l">
      <div ref={boxRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "ai" ? "text-gray-800" : "text-emerald-700 text-right"}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Ask HESPOR AI…"
          className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button onClick={send} className="rounded-lg bg-emerald-600 text-white px-4 py-2">Send</button>
      </div>
    </div>
  );
}

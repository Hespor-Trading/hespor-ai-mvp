"use client";
import { useState } from "react";

export default function ConnectForm() {
  const [brand, setBrand] = useState("");
  const [acos, setAcos] = useState("25");
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, acos, asin }),
      });
      const data = await res.json();
      if (typeof data?.url === "string" && data.url.startsWith("http")) {
        window.location.assign(data.url); // go to Stripe
      } else {
        window.location.assign("/dashboard"); // fallback
      }
    } catch (e) {
      alert("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ...return your form using onSubmit={onSubmit} and inputs bound to setBrand/setAcos/setAsin
}

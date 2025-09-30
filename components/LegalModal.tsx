"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LegalModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* click outside to close */}
      <button
        className="absolute inset-0"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-sm font-semibold">
            Terms &amp; Conditions · Privacy Policy
          </h2>
          <button
            className="text-sm underline hover:opacity-70"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Split view; each pane scrolls independently */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <iframe
            title="Terms & Conditions"
            src="/legal/terms"
            className="h-[70vh] w-full border-r md:block"
          />
          <iframe
            title="Privacy Policy"
            src="/legal/privacy"
            className="h-[70vh] w-full"
          />
        </div>
      </div>
    </div>
  );
}

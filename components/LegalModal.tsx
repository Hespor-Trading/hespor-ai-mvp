"use client";

import * as React from "react";

type Props = {
  /** Controls visibility from parent (required) */
  open: boolean;
  /**
   * Optional setter from parent. If provided, we call setOpen(false) on close.
   * Keeping it optional so existing usages without a setter still compile.
   */
  setOpen?: (open: boolean) => void;
  /** Optional: title text for the modal header */
  title?: string;
  /** Optional: modal body content; defaults to Terms & Privacy links */
  children?: React.ReactNode;
};

export default function LegalModal({ open, setOpen, title, children }: Props) {
  if (!open) return null;

  function handleClose() {
    // Close via parent state if available; otherwise just no-op (non-blocking)
    if (setOpen) setOpen(false);
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      {/* card */}
      <div className="relative z-10 w-[90vw] max-w-lg rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-semibold">
            {title ?? "Terms & Privacy"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 text-sm leading-6 text-gray-700">
          {children ?? (
            <div className="space-y-3">
              <p>
                By continuing, you agree to our{" "}
                <a className="underline text-emerald-700" href="/legal/terms" target="_blank" rel="noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="underline text-emerald-700" href="/legal/privacy" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button
            onClick={handleClose}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:opacity-90"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

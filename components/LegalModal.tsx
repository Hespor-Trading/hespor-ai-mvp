"use client";

type Props = { open: boolean; onClose: () => void };

export default function LegalModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-5xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Legal</h2>
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50" onClick={onClose}>Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* real pages */}
          <iframe title="Terms & Conditions" src="/terms" className="h-[70vh] w-full border-r md:block" />
          <iframe title="Privacy Policy" src="/privacy" className="h-[70vh] w-full" />
        </div>
      </div>
    </div>
  );
}

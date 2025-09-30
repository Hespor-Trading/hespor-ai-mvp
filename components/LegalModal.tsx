"use client";

import * as React from "react";

/**
 * LegalModal
 * - Emerald background, black text
 * - Opens from either:
 *    a) dispatching `new CustomEvent("open-legal")`
 *    b) navigating to `#legal` (deep-link)
 */
export default function LegalModal({
  terms,
  privacy,
}: {
  terms: string;
  privacy: string;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpen = () => setOpen(true);
    const handleHash = () => {
      if (location.hash === "#legal") setOpen(true);
    };
    window.addEventListener("open-legal", handleOpen as any);
    window.addEventListener("hashchange", handleHash);
    if (location.hash === "#legal") setOpen(true);
    return () => {
      window.removeEventListener("open-legal", handleOpen as any);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    if (location.hash === "#legal") {
      history.replaceState(null, "", location.pathname + location.search);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative mx-4 w-full max-w-5xl rounded-2xl bg-emerald-600 p-4 text-black shadow-xl">
        <button
          className="absolute right-4 top-4 underline"
          onClick={close}
          aria-label="Close Terms & Privacy"
        >
          Close
        </button>

        <h2 className="mb-4 text-lg font-semibold">
          Terms &amp; Conditions + Privacy Policy
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="prose prose-invert prose-h1:mt-0 max-h-[60vh] overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: mdToHtml(terms) }} />
          </article>

          <div className="hidden w-px bg-black/20 md:block" />

          <article className="prose prose-invert prose-h1:mt-0 max-h-[60vh] overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: mdToHtml(privacy) }} />
          </article>
        </div>
      </div>
    </div>
  );
}

/** Very small markdown → html for legal docs */
function mdToHtml(src: string) {
  let html = (src ?? "").trim();
  // escape
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // headings
  html = html.replace(/^######\s?(.*)$/gim, "<h6>$1</h6>");
  html = html.replace(/^#####\s?(.*)$/gim, "<h5>$1</h5>");
  html = html.replace(/^####\s?(.*)$/gim, "<h4>$1</h4>");
  html = html.replace(/^###\s?(.*)$/gim, "<h3>$1</h3>");
  html = html.replace(/^##\s?(.*)$/gim, "<h2>$1</h2>");
  html = html.replace(/^#\s?(.*)$/gim, "<h1>$1</h1>");
  // bold / italic
  html = html.replace(/\*\*(.+?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/gim, "<em>$1</em>");
  // links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    `<a href="$2" target="_blank" rel="noreferrer">$1</a>`
  );
  // simple lists
  html = html
    .split("\n")
    .map((line) =>
      line.match(/^\s*[-*]\s+/)
        ? `<li>${line.replace(/^\s*[-*]\s+/, "")}</li>`
        : line
    )
    .join("\n");
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gim, "<ul>$1</ul>");
  // paragraphs
  html = html
    .split(/\n{2,}/)
    .map((block) =>
      block.match(/^<h\d|^<ul|^<li|^<\/li|^<\/ul/)
        ? block
        : `<p>${block.replace(/\n/g, "<br/>")}</p>`
    )
    .join("\n");

  return html;
}

import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export default function TermsPage() {
  const file = path.join(process.cwd(), "content", "legal", "terms.md");
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "# Terms & Conditions\nComing soon.";
  return (
    <div className="min-h-screen bg-emerald-600 text-black p-6">
      <article className="prose max-w-none whitespace-pre-wrap">{text}</article>
    </div>
  );
}

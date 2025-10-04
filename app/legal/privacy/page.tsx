import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export default function PrivacyPage() {
  const file = path.join(process.cwd(), "content", "legal", "privacy.md");
  const text = fs.existsSync(file)
    ? fs.readFileSync(file, "utf8")
    : "# Privacy Policy\nComing soon.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-600 p-6">
      <article className="prose max-w-3xl bg-white rounded-2xl shadow-xl p-6 mx-auto whitespace-pre-wrap">
        {text}
      </article>
    </div>
  );
}

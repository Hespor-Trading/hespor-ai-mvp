import { promises as fs } from "fs";
import path from "path";

export async function loadLegal() {
  const base = path.join(process.cwd(), "content", "legal");
  const [terms, privacy] = await Promise.all([
    fs.readFile(path.join(base, "terms.md"), "utf8"),
    fs.readFile(path.join(base, "privacy.md"), "utf8"),
  ]);
  return { terms, privacy };
}

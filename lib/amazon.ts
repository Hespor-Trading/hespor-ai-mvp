export function brandFromQuery(search: string) {
  const u = new URL("http://x" + search); // dummy host
  return u.searchParams.get("brand") || process.env.HESPOR_DEFAULT_BRAND || "DECOGAR";
}

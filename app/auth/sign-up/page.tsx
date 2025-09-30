// Server component
import { loadLegal } from "@/lib/legal";
import LegalModal from "@/components/LegalModal";
import SignUpClient from "./Client";

export default async function Page() {
  const { terms, privacy } = await loadLegal();

  return (
    <>
      {/* Your existing sign-up client component */}
      <SignUpClient />

      {/* Shared legal modal (mounted on this page) */}
      <LegalModal terms={terms} privacy={privacy} />
    </>
  );
}

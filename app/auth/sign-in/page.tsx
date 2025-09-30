// Server component
import { loadLegal } from "@/lib/legal";
import LegalModal from "@/components/LegalModal";
import SignInClient from "./Client";

export default async function Page() {
  const { terms, privacy } = await loadLegal();

  return (
    <>
      {/* Your existing sign-in client component */}
      <SignInClient />

      {/* Shared legal modal (mounted on this page too) */}
      <LegalModal terms={terms} privacy={privacy} />
    </>
  );
}

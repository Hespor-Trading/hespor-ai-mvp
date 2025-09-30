// Server component for Sign-In page
import { loadLegal } from "@/lib/legal";
import LegalModal from "@/components/LegalModal";
import SignInClient from "./Client";

export default async function Page() {
  const { terms, privacy } = await loadLegal();
  return (
    <>
      <SignInClient />
      <LegalModal terms={terms} privacy={privacy} />
    </>
  );
}

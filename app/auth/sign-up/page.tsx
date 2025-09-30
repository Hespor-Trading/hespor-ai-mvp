// Server component for Sign-Up page
import { loadLegal } from "@/lib/legal";
import LegalModal from "@/components/LegalModal";
import SignUpClient from "./Client";

export default async function Page() {
  const { terms, privacy } = await loadLegal();
  return (
    <>
      <SignUpClient />
      <LegalModal terms={terms} privacy={privacy} />
    </>
  );
}

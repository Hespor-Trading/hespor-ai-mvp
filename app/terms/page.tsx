export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">HESPOR Terms & Conditions</h1>
      <p className="mb-3">
        These Terms govern your use of HESPOR (“Service”) operated by HESPOR Trading Ltd. (“HESPOR”, “we”, “us”). 
        By creating an account, signing in, or clicking <em>Connect now</em>, you agree to these Terms.
      </p>

      <h2 className="font-semibold mt-6 mb-2">1) Accounts & Sign-In</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>You must provide accurate information and keep your credentials secure. You are responsible for all activity under your account.</li>
        <li>Duplicate accounts or sign-ups using the same email are not permitted.</li>
        <li>We may require email verification or multi-factor authentication for security.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2">2) Amazon Authorizations</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>By clicking <em>Connect now</em>, you authorize HESPOR to access your Amazon Advertising (Ads API) and Selling Partner (SP-API) data strictly to provide automation and analytics you request.</li>
        <li>You may revoke permissions at any time in your Amazon account or by contacting us. Revocation may disable parts of the Service.</li>
        <li>You agree to comply with Amazon policies and all applicable laws. We do not guarantee any particular performance or sales results.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2">3) Data Security & Privacy</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>We store credentials and tokens securely and use them only to operate the Service. Sensitive values are encrypted at rest and in transit.</li>
        <li>We never sell your data. See our Privacy Policy for details on collection, use, retention and deletion.</li>
        <li>Upon request or account closure, we will delete your personal data and revoke Amazon tokens, subject to legal retention requirements.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2">4) Acceptable Use</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>No unlawful, harmful, or abusive use. No attempts to bypass security, scrape, reverse engineer, or overload the Service.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2">5) Service Availability & Changes</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>The Service is provided “as is” and “as available”. We may modify, suspend, or discontinue features at any time.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2">6) Disclaimers & Limitation of Liability</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>To the fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
        <li>We are not liable for indirect, incidental, special or consequential damages, or loss of profits, revenues, data, or business opportunities.</li>
      </ul>

      <h2 className="font-semibold mt-6 mb-2">7) Indemnity</h2>
      <p className="mb-3">
        You agree to defend and indemnify HESPOR against claims arising from your misuse of the Service or violation of these Terms.
      </p>

      <h2 className="font-semibold mt-6 mb-2">8) Termination</h2>
      <p className="mb-3">
        We may suspend or terminate access for violations or risks to the Service. You may stop using the Service at any time.
      </p>

      <h2 className="font-semibold mt-6 mb-2">9) Governing Law</h2>
      <p className="mb-3">These Terms are governed by the laws of British Columbia, Canada.</p>

      <h2 className="font-semibold mt-6 mb-2">10) Contact</h2>
      <p className="mb-3">Questions: <a className="text-emerald-700 underline" href="mailto:info@hespor.com">info@hespor.com</a></p>

      <p className="text-sm text-gray-500 mt-6">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}

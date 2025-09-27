export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        We collect the minimum data needed to provide automation and analytics for your Amazon business.
        This includes account identifiers and performance metrics retrieved via Amazon’s SP-API and
        Amazon Ads API after you grant access. We do not sell personal data.
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">What we store</h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-1">
        <li>Account email and basic profile fields you provide at sign-up.</li>
        <li>Tokens required to access SP-API and Ads API (encrypted at rest).</li>
        <li>Operational logs and usage needed to secure the service.</li>
      </ul>
      <h2 className="text-lg font-semibold mt-6 mb-2">How we use data</h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-1">
        <li>To fetch advertising and sales data from Amazon on your behalf.</li>
        <li>To generate insights, charts, and optimization suggestions.</li>
        <li>To provide support and prevent abuse.</li>
      </ul>
      <h2 className="text-lg font-semibold mt-6 mb-2">Your choices</h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-1">
        <li>You can revoke Amazon access at any time in your Amazon account.</li>
        <li>You can request export or deletion of your data by emailing <a className="text-emerald-600" href="mailto:support@hespor.com">support@hespor.com</a>.</li>
      </ul>
      <p className="text-gray-700 mt-6">
        By using HESPOR, you agree to this policy and our{" "}
        <a className="text-emerald-600 underline" href="/terms">Terms &amp; Conditions</a>.
      </p>
    </div>
  );
}

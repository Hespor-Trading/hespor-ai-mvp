// app/support/page.tsx (SERVER)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Support() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Support</h1>
      <p className="text-gray-700 mb-4">
        For help, email <a className="text-emerald-700 underline" href="mailto:support@hespor.com">support@hespor.com</a>.
      </p>
      <h2 className="text-lg font-semibold mt-8 mb-2">Amazon SP-API status</h2>
      <p className="text-gray-700">
        If you see “MD1000 You do not have access to this application” while connecting SP-API,
        it means our app listing is still awaiting Amazon approval for public access. Once approved,
        you’ll be able to complete the SP-API connection.
      </p>
    </div>
  );
}

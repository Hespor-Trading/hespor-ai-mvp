export default function BillingPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <img src="/hespor-logo.png" className="h-7" alt="Hespor" />
        <h1 className="text-2xl font-semibold">Billing</h1>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm text-slate-700">
          Billing portal will be available after you start a subscription. For now you can view your plan in{" "}
          <a className="underline" href="/subscription">Subscription</a>.
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 mt-4">
        <div className="font-medium mb-2">Invoices</div>
        <div className="text-sm text-slate-500">No invoices yet.</div>
      </div>
    </div>
  );
}

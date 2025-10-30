import { supabaseServer } from '@/lib/supabaseServer';

export default async function Dashboard() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-sm">Signed in as {user?.email}</p>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const sb = supabaseBrowser();
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL!;

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setErr(error.message);
    router.replace('/dashboard');
  };

  const signInWithGoogle = async () => {
    setBusy(true); setErr(null);
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    });
    setBusy(false);
    if (error) setErr(error.message);
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <button onClick={signInWithGoogle} className="w-full border rounded px-4 py-2 mb-4" disabled={busy}>
        Continue with Google
      </button>
      <form onSubmit={signInWithEmail} className="space-y-3">
        <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2"
          value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} required />
        <input type="password" placeholder="Password" className="w-full border rounded px-3 py-2"
          value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} required />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button type="submit" className="w-full bg-black text-white rounded px-4 py-2" disabled={busy}>
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm">Don&apos;t have an account? <a className="underline" href="/auth/sign-up">Sign up</a></p>
      {busy && <div className="fixed inset-0 grid place-items-center bg-black/5 text-sm">Working...</div>}
    </div>
  );
}

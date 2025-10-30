'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthControls({
  size = 'sm',
  showEmail = true,
  signInHref = '/auth/sign-in',
  signUpHref = '/auth/sign-up'
}: {
  size?: 'sm' | 'md';
  showEmail?: boolean;
  signInHref?: string;
  signUpHref?: string;
}) {
  const sb = supabaseBrowser();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = sb.auth.onAuthStateChange(() =>
      sb.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
    );
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = signInHref;
  };

  const pad = size === 'md' ? 'px-4 py-2' : 'px-3 py-1.5';
  const txt = size === 'md' ? 'text-sm' : 'text-xs';

  return email ? (
    <div className="flex items-center gap-2">
      {showEmail && <span className={`${txt} text-gray-600 truncate max-w-[180px]`}>{email}</span>}
      <button onClick={signOut} className={`${txt} ${pad} bg-black text-white rounded hover:bg-gray-800`}>
        Sign out
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Link href={signInHref} className={`${txt} hover:underline`}>Sign in</Link>
      <Link href={signUpHref} className={`${txt} ${pad} bg-black text-white rounded hover:bg-gray-800`}>Get Started</Link>
    </div>
  );
}

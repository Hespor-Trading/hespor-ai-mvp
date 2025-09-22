// -------- file: /app/auth/sign-up/page.tsx --------
setError("Passwords do not match.");
return;
}
if (!agree) {
setError("Please accept the Terms to continue.");
return;
}
setLoading(true);
try {
// TODO: wire to your auth backend or NextAuth signUp equivalent
console.log("Sign up", { email });
window.location.href = "/connect";
} catch (err: any) {
setError("Sign up failed. Please try again.");
} finally {
setLoading(false);
}
}


return (
<div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
<div className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
<div className="mb-4 flex items-center gap-2">
<img src="/logo-dark.png" alt="Hespor" className="h-7" />
<span className="sr-only">HESPOR</span>
</div>
<h1 className="mb-1 text-2xl font-bold text-[#0a0a0a]">Create your HESPOR account</h1>
<p className="mb-5 text-sm text-gray-600">Start your 10 free chats/week. Upgrade anytime.</p>


<form onSubmit={onSubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700">Email</label>
<input
type="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
className="mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
placeholder="you@company.com"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Password</label>
<input
type="password"
required
value={password}
onChange={(e) => setPassword(e.target.value)}
className="mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
placeholder="Create a strong password"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700">Confirm Password</label>
<input
type="password"
required
value={confirm}
onChange={(e) => setConfirm(e.target.value)}
className="mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a]"
placeholder="Re-enter your password"
/>
</div>


<label className="flex items-center gap-2 text-sm text-gray-700">
<input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 rounded border" />
I agree to the <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
</label>


{error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}


<button
type="submit"
disabled={loading}
className={`w-full rounded-xl px-4 py-2 text-white ${loading ? "bg-gray-400" : "bg-[#0a0a0a] hover:bg-black"}`}
>
{loading ? "Creating account…" : "Sign Up"}
</button>
</form>


<p className="mt-4 text-sm text-gray-600">
Already have an account? <Link href="/auth/sign-in" className="text-[#0a0a0a] underline">Log In</Link>
</p>
</div>
</div>
);
}

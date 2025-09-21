// 1) /app/auth/sign-in/page.tsx
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"


export default function SignInPage(){
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [err,setErr]=useState("")


useEffect(()=>{ // if already logged in, go to /connect
if (typeof window!=="undefined" && localStorage.getItem("hespor_authed")==="1") {
window.location.href = "/connect"
}
},[])


function onSubmit(e:any){
e.preventDefault()
const savedEmail = localStorage.getItem("hespor_user_email") || "admin@hespor.com"
const savedPass = localStorage.getItem("hespor_user_password") || "Hespor123!"
if(email.trim().toLowerCase()===savedEmail.toLowerCase() && password===savedPass){
localStorage.setItem("hespor_authed","1")
window.location.href = "/connect"
} else {
setErr("Wrong email or password")
}
}


return (
<main className="min-h-screen grid place-items-center bg-gradient-to-b from-white to-gray-50">
<div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
<div className="flex items-center gap-3 mb-4">
<div className="h-8 w-8 rounded-xl bg-emerald-600"/>
<h1 className="text-xl font-semibold">Sign in to HESPOR</h1>
</div>
<p className="text-sm text-gray-600 mb-6">Use <b>admin@hespor.com</b> / <b>Hespor123!</b> (you can change later).</p>
<form onSubmit={onSubmit} className="space-y-4">
<div>
<label className="block text-sm text-gray-700 mb-1">Email</label>
<input type="email" required className="w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" value={email} onChange={e=>setEmail(e.target.value)} />
</div>
<div>
<label className="block text-sm text-gray-700 mb-1">Password</label>
<input type="password" required className="w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" value={password} onChange={e=>setPassword(e.target.value)} />
</div>
{err && <p className="text-sm text-red-600">{err}</p>}
<button type="submit" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3">Sign in</button>
</form>
<p className="mt-4 text-xs text-gray-500">No account? <Link href="/auth/sign-up" className="text-gray-900 font-medium">Create one</Link></p>
</div>
</main>
)
}

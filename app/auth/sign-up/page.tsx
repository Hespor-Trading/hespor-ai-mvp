"use client"
import { useState } from "react"


export default function SignUpPage(){
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [ok,setOk]=useState(false)


function onSubmit(e:any){
e.preventDefault()
localStorage.setItem("hespor_user_email", email.trim())
localStorage.setItem("hespor_user_password", password)
setOk(true)
setTimeout(()=>{ window.location.href = "/auth/sign-in" }, 800)
}


return (
<main className="min-h-screen grid place-items-center bg-gradient-to-b from-white to-gray-50">
<div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
<div className="flex items-center gap-3 mb-4">
<div className="h-8 w-8 rounded-xl bg-emerald-600"/>
<h1 className="text-xl font-semibold">Create your account</h1>
</div>
<form onSubmit={onSubmit} className="space-y-4">
<div>
<label className="block text-sm text-gray-700 mb-1">Email</label>
<input type="email" required className="w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" value={email} onChange={e=>setEmail(e.target.value)} />
</div>
<div>
<label className="block text-sm text-gray-700 mb-1">Password</label>
<input type="password" required className="w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500" value={password} onChange={e=>setPassword(e.target.value)} />
</div>
<button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3">Sign up</button>
{ok && <p className="text-sm text-emerald-700 mt-2">Saved! Now signing you in…</p>}
</form>
</div>
</main>
)
}

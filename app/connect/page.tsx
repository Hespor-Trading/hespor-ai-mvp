"use client"
import { useEffect, useState } from "react"


export default function ConnectPage(){
const [ready,setReady]=useState(false)
useEffect(()=>{
if (localStorage.getItem("hespor_authed")!=="1") {
window.location.href = "/auth/sign-in"
} else { setReady(true) }
},[])
if(!ready) return null


const SP_URL = "https://sellercentral.amazon.com/apps/authorize/consent?application_id=amzn1.sp.solution.8126aaee-840c-4c49-a27c-233f84526d6d"
const ADS_URL = "https://www.amazon.com/ap/oa?client_id=amzn1.application-oa2-client.6ac5994288a4e42959e0ceb03ccf03e6&scope=advertising::campaign_management&response_type=code&redirect_uri=https://hespor-ai-mvp.vercel.app/api/callback"


return (
<main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
<header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="h-8 w-8 rounded-xl bg-emerald-600"/>
<span className="font-semibold tracking-tight text-xl">HESPOR</span>
</div>
<button onClick={()=>{ localStorage.removeItem("hespor_authed"); window.location.href="/auth/sign-in" }} className="text-sm text-gray-500 hover:text-gray-900">Sign out</button>
</div>
</header>


<section className="mx-auto max-w-6xl px-4 pt-12 pb-6 grid lg:grid-cols-2 gap-10 items-center">
<div>
<span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-xs font-medium ring-1 ring-inset ring-emerald-200">From chaos to control</span>
<h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Connect your Amazon accounts <span className="block text-emerald-600">and unlock Hespor AI</span></h1>
<p className="mt-4 text-gray-600">Securely authorize Seller Central (SP‑API) and Amazon Ads so our AI can diagnose wasted spend and surface quick wins.</p>
<div className="mt-8 space-y-3">
<a href={SP_URL} className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition bg-emerald-600 hover:bg-emerald-700 text-white">1) Connect Amazon Seller (SP‑API)</a>
<a href={ADS_URL} className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition bg-emerald-600 hover:bg-emerald-700 text-white">2) Connect Amazon Ads</a>
<p className="text-xs text-gray-500">You’ll be redirected to Amazon. You can revoke at any time.</p>
</div>
</div>
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
<h2 className="text-lg font-semibold">What happens next</h2>
<ol className="mt-4 space-y-4 text-sm text-gray-700">
<li className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</span><div><p className="font-medium">Secure Amazon login</p><p className="text-gray-500">We redirect you to Amazon’s official OAuth page — we never see your password.</p></div></li>
<li className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">2</span><div><p className="font-medium">Instant diagnostics</p><p className="text-gray-500">Your dashboard lights up with ACoS/TACoS, wasted spend, win/loss keywords, and quick wins.</p></div></li>
<li className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">3</span><div><p className="font-medium">Approve fixes (optional)</p><p className="text-gray-500">Our AI proposes changes. You approve before anything is applied — zero risk.</p></div></li>
<li className="flex gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">4</span><div><p className="font-medium">Scale smarter</p><p className="text-gray-500">Focus budget on winners, protect inventory, and grow profitably.</p></div></li>
</ol>
</div>
</section>


<footer className="mt-8 border-t border-gray-100">
<div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
<p>© {new Date().getFullYear()} HESPOR. All rights reserved.</p>
<div className="flex items-center gap-5">
<a href="mailto:info@hespor.com" className="hover:text-gray-900">info@hespor.com</a>
<a href="https://hespor.com" className="hover:text-gray-900">hespor.com</a>
</div>
</div>
</footer>
</main>
)
}

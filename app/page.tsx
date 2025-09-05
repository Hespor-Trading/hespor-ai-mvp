'use client';
import React, { useState } from "react";
import { Search, Bot, Rocket, Gauge, ShoppingCart, BarChart2, TrendingUp, ShieldCheck, Bell, Zap, Info, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Metric = ({ label, value, hint, trend }: { label: string; value: string; hint?: string; trend?: "up"|"down"|"flat" }) => (
  <Card className="border-none shadow-sm bg-white/80">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
        {trend === "up" && <TrendingUp className="size-5" />}
        {trend === "down" && <TrendingUp className="size-5 rotate-180" />}
        {!trend && <Info className="size-5 text-muted-foreground" />}
      </div>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
    </CardContent>
  </Card>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <button className="text-sm rounded-full px-3 py-1 border hover:bg-gray-100 transition">{children}</button>
);

const fakeQuestions = [
  "What changed in my ACOS today?",
  "Why did you pause keyword ‘pink drawer organizer’?",
  "Which ASINs are close to stockout?",
  "What new keywords did you harvest this week?",
  "What did automation do in the last 24h and why?",
  "Where am I losing money right now?",
];

const fakeFeed = [
  { ts: "09:36", title: "Bid down on KW: 'drawer organizer pink'", why: "ACOS 72% (> breakeven 38%), 0 sales in last 7 days, high CPC." },
  { ts: "09:18", title: "Paused ASIN target: B0D7PZLJ7Y", why: "Inventory risk: 9 units left, ETA 12 days; preventing rank drop on OOS." },
  { ts: "08:50", title: "Launched exact campaign for 'dresser organizer set'", why: "Conversion 16% in search term report, low CPC opportunity." }
];

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [paid, setPaid] = useState(false);
  const [autoOn, setAutoOn] = useState(false);
  const [chat, setChat] = useState("Explain today's biggest wins and losses in plain English.");
  const risk = 74;

  const handleAutomationToggle = () => {
    if (!paid) {
      alert("Automation is only for paid users. Please upgrade your plan to activate.");
      return;
    }
    setAutoOn(v => !v);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-black text-white grid place-items-center font-bold">H</div>
            <div className="font-semibold">Hespor AI</div>
            <Badge variant="secondary" className="ml-2">MVP</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="gap-2" onClick={() => alert("Notifications coming soon")}> <Bell className="size-4"/> Alerts</Button>
            {!connected ? (
              <Button className="gap-2" onClick={() => setConnected(true)}>
                <ShieldCheck className="size-4"/> Connect Amazon
              </Button>
            ) : (
              <Badge className="gap-1" variant="default"><ShieldCheck className="size-3"/> Connected</Badge>
            )}
            {!paid ? (
              <Button variant="outline" className="gap-2" onClick={() => setPaid(true)}>
                <Lock className="size-4"/> Upgrade
              </Button>
            ) : (
              <Badge variant="outline" className="gap-1"><Zap className="size-3"/> Pro</Badge>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        <section className="md:col-span-5 xl:col-span-4 space-y-4">
          <Card className="border-none shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base"><Gauge className="size-4"/> Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Metric label="Profit Today" value="$482" hint="After ad spend & fees" trend="up"/>
              <Metric label="TACoS" value="12.4%" hint="Target: 12–15%" trend="up"/>
              <Metric label="ACOS (SP)" value="28.7%" hint="Target: ≤ 30%" trend="up"/>
              <Metric label="Net Margin" value="18.2%" hint="Per blended sales" trend="flat"/>
              <Metric label="Orders" value="94"/>
              <Metric label="Ad Spend" value="$386"/>
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base"><ShoppingCart className="size-4"/> Inventory Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">Likelihood of stockouts in next 14 days</div>
              <Progress value={risk} className="h-2" />
              <div className="mt-2 text-xs">High risk across 3 SKUs (Pink, Beige, Light Brown). Suggested actions below.</div>

              <div className="mt-4 grid gap-2">
                {["B0D7PZLJ7Y · Pink · 9 units · ETA 12d", "B0DWSTLM3T · Grey Airplane · 170 units · Stable", "B0BK946NM8 · Beige · 115 units · Watch"].map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-100">
                    <span>{row}</span>
                    <Badge variant={i===0?"destructive":"secondary"}>{i===0?"Risk":"OK"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base"><BarChart2 className="size-4"/> Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Turn on automation</div>
                  <div className="text-xs text-muted-foreground">Bid rules, negatives, launches, dayparting</div>
                </div>
                <Switch checked={autoOn} onCheckedChange={handleAutomationToggle}/>
              </div>
              {!paid && (
                <div className="text-xs p-2 rounded-md bg-yellow-50 border text-yellow-900">
                  <span className="inline-block align-middle mr-1">🔒</span> Automation is <b>Pro</b>. Click <b>Upgrade</b> on top-right to activate.
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" className="w-full">View Rules</Button>
                <Button variant="outline" className="w-full">Edit Breakeven ACOS</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base"><Rocket className="size-4"/> Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Pill>Launch exact from winners</Pill>
              <Pill>Lower bids on high ACOS</Pill>
              <Pill>Pause OOS keywords</Pill>
              <Pill>Harvest from SQR</Pill>
              <Pill>Protect hero SKU</Pill>
            </CardContent>
          </Card>
        </section>

        <section className="md:col-span-7 xl:col-span-8 space-y-4">
          <Card className="border-none shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base"><Bot className="size-4"/> Chat with Hespor AI</CardTitle>
                <div className="hidden md:flex items-center gap-2">
                  <Input placeholder="Search metrics or actions" className="w-64"/>
                  <Button variant="outline" size="icon"><Search className="size-4"/></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {fakeQuestions.map((q, i) => (
                  <Button key={i} variant="secondary" className="rounded-full" onClick={() => setChat(q)}>{q}</Button>
                ))}
              </div>
              <Textarea value={chat} onChange={(e)=>setChat(e.target.value)} className="min-h-[100px]"/>
              <div className="mt-3 flex items-center gap-2">
                <Button className="gap-2"><Bot className="size-4"/> Ask</Button>
                <Button variant="outline" className="gap-2"><Info className="size-4"/> Explain it like I’m new</Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="feed" className="w-full">
            <TabsList>
              <TabsTrigger value="feed">What the engine did</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>
            <TabsContent value="feed" className="mt-3">
              <div className="grid gap-3">
                {fakeFeed.map((e, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">{e.ts}</div>
                      <div className="font-medium">{e.title}</div>
                      <div className="text-sm text-muted-foreground">Why: {e.why}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="campaigns" className="mt-3">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 text-sm">
                  <div className="mb-2 font-medium">Live Campaigns (demo)</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>DEC-PINK-EXACT – ACOS 24.1% – Daily $40 – <Badge variant="secondary">On</Badge></li>
                    <li>DEC-GREY-PHRASE – ACOS 39.4% – Daily $30 – <Badge variant="destructive">Watch</Badge></li>
                    <li>DEC-BEIGE-ASIN – ACOS 18.3% – Daily $25 – <Badge>On</Badge></li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inventory" className="mt-3">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 text-sm">
                  <div className="mb-2 font-medium">Key SKUs</div>
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-muted-foreground">
                      <tr><th className="py-1">ASIN</th><th>SKU</th><th>On-hand</th><th>Days Cover</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-t"><td>B0D7PZLJ7Y</td><td>DEC-PINK</td><td>9</td><td>2</td><td><Badge variant="destructive">Risk</Badge></td></tr>
                      <tr className="border-t"><td>B0DWSTLM3T</td><td>DEC-GREY-AIR</td><td>170</td><td>42</td><td><Badge variant="secondary">OK</Badge></td></tr>
                      <tr className="border-t"><td>B0BK946NM8</td><td>DEC-BEIGE</td><td>115</td><td>21</td><td><Badge>Watch</Badge></td></tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="mx-auto max-w-7xl px-4 text-xs text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} Hespor Trading Ltd.</div>
          <div className="flex items-center gap-3">
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
            <a className="hover:underline" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SyncNowButton from "./SyncNowButton";

type SummaryRow = {
  campaign_name: string;
  clicks: number;
  impressions: number;
  cost: number;
  sales: number;
  acos: number;
};

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryRow[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        router.push("/auth/sign-in");
        return;
      }
      setUserId(session.user.id);
    };
    getSession();
  }, [supabase, router]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/ads/summary?user_id=${userId}`, { cache: "no-store" });
        const json = await res.json();
        if (json.ok) setSummary(json.rows || []);
      } catch (err) {
        console.error("Summary fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        {/* CSS spinner — no lucide-react needed */}
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
        <Button
          onClick={() => router.push("/auth/sign-in")}
          className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <SyncNowButton userId={userId} days={30} />
      </div>

      {summary.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="text-gray-600 p-6 text-center">
            No data yet. Click <b>“Sync Now”</b> to fetch your latest Amazon Ads data.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {summary.map((row, i) => (
            <Card key={i} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h2 className="font-medium text-gray-900">{row.campaign_name}</h2>
                <p className="text-sm text-gray-600">
                  {row.clicks} clicks • {row.impressions} impressions
                </p>
                <p className="text-sm mt-2">
                  Cost: ${row.cost?.toFixed(2)} | Sales: ${row.sales?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-700">ACOS: {row.acos?.toFixed(2)}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

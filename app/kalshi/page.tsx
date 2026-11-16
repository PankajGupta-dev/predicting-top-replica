import { Metadata } from "next";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { getKalshiLeaderboard } from "@/lib/services/leaderboard.service";
import type { KalshiLeaderboardEntry } from "@/types/api.types";

export const metadata: Metadata = {
  title: "Kalshi Leaderboard — Top 1,000 Kalshi Traders by Profit | predicting.top",
  description:
    "The Kalshi leaderboard: the top 1,000 Kalshi traders ranked by daily, weekly, monthly and all-time profit, tracked over time. Public, no Kalshi account needed.",
  openGraph: {
    title: "Kalshi Leaderboard — Top 1,000 Kalshi Traders by Profit | predicting.top",
    description:
      "The Kalshi leaderboard: the top 1,000 Kalshi traders ranked by daily, weekly, monthly and all-time profit, tracked over time. Public, no Kalshi account needed.",
    type: "website",
  },
};

export default async function KalshiPage() {
  let initialKalshiTraders: KalshiLeaderboardEntry[] = [];
  let lastUpdated = "";

  try {
    const kalshiRes = await getKalshiLeaderboard("all", 1000);
    initialKalshiTraders = kalshiRes.traders || [];
    lastUpdated = kalshiRes.lastUpdated || "";
  } catch (error) {
    console.error("Failed to load Kalshi leaderboard data:", error);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <LeaderboardView
            mode="kalshi"
            initialKalshiTraders={initialKalshiTraders}
            lastUpdated={lastUpdated}
          />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

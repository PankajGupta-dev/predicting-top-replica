import { Metadata } from "next";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { getLeaderboard, getDailyProfit } from "@/lib/services/leaderboard.service";
import type { LeaderboardEntry } from "@/types/api.types";

export const metadata: Metadata = {
  title: "Prediction Market Leaderboard — Top Polymarket & Kalshi Traders | predicting.top",
  description:
    "The prediction market leaderboard: live P&L rankings of the top Polymarket and Kalshi traders — daily, weekly, monthly and all-time, with wallets, profiles and a free API.",
  openGraph: {
    title: "Prediction Market Leaderboard — Top Polymarket & Kalshi Traders | predicting.top",
    description:
      "The prediction market leaderboard: live P&L rankings of the top Polymarket and Kalshi traders — daily, weekly, monthly and all-time, with wallets, profiles and a free API.",
    type: "website",
  },
};

export default async function HomePage() {
  // Fetch initial data on the server with 60s ISR revalidation
  let initialTraders: LeaderboardEntry[] = [];
  let lastUpdated = "";
  let dailyProfit: string | null = null;

  try {
    const [leaderboardRes, dailyProfitRes] = await Promise.allSettled([
      getLeaderboard("1d"),
      getDailyProfit(),
    ]);

    if (leaderboardRes.status === "fulfilled") {
      initialTraders = leaderboardRes.value.traders || [];
      lastUpdated = leaderboardRes.value.lastUpdated || "";
    }

    if (dailyProfitRes.status === "fulfilled") {
      dailyProfit = dailyProfitRes.value.daily_profit ?? null;
    }
  } catch (error) {
    console.error("Failed to load initial leaderboard data:", error);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <LeaderboardView
            mode="home"
            initialTraders={initialTraders}
            lastUpdated={lastUpdated}
            dailyProfit={dailyProfit}
          />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

import { Metadata } from "next";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { getLeaderboard, getDailyProfit } from "@/lib/services/leaderboard.service";
import type { LeaderboardEntry } from "@/types/api.types";

export const metadata: Metadata = {
  title: "Polymarket Leaderboard — Top Polymarket Traders by Profit | predicting.top",
  description:
    "The Polymarket leaderboard: the most profitable Polymarket traders ranked by daily, weekly, monthly and all-time P&L, with wallets, X accounts, positions and P&L history.",
  openGraph: {
    title: "Polymarket Leaderboard — Top Polymarket Traders by Profit | predicting.top",
    description:
      "The Polymarket leaderboard: the most profitable Polymarket traders ranked by daily, weekly, monthly and all-time P&L, with wallets, X accounts, positions and P&L history.",
    type: "website",
  },
};

export default async function PolymarketPage() {
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
    console.error("Failed to load Polymarket leaderboard data:", error);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <LeaderboardView
            mode="polymarket"
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

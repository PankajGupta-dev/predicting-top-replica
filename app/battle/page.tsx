import { Metadata } from "next";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BattleView } from "@/components/battle/BattleView";
import { getTraderHistory, getKalshiHistory } from "@/lib/services/trader.service";
import type { ProfitHistoryPoint } from "@/types/api.types";

export const metadata: Metadata = {
  title: "Battle of the Badges | predicting.top",
  description: "Polymarket vs Kalshi — compare flagged traders side by side on predicting.top.",
  openGraph: {
    title: "Battle of the Badges | predicting.top",
    description: "Polymarket vs Kalshi — compare flagged traders side by side on predicting.top.",
    type: "website",
  },
};

export default async function BattlePage() {
  const contenderA = {
    name: "25usdc",
    handle: "@25usdc",
    platform: "polymarket" as const,
    pfp: "https://polymarket-upload.s3.us-east-2.amazonaws.com/profile-image-1280198-5beeeca3-17f2-4d93-8c68-42dc5de6ab28.png",
    twitter: "https://x.com/25usdc",
    profileHref: "/account/0x75e765216a57942d738d880ffcda854d9f869080",
  };

  const contenderB = {
    name: "PredMTrader",
    handle: "@PredMTrader",
    platform: "kalshi" as const,
    pfp: "https://pbs.twimg.com/profile_images/1958361929292120064/2sqK385c_400x400.jpg",
    twitter: "https://x.com/PredMTrader",
    profileHref: "/account/PredMTrader",
  };

  let historyA: ProfitHistoryPoint[] = [];
  let historyB: ProfitHistoryPoint[] = [];

  try {
    const [histARes, histBRes] = await Promise.allSettled([
      getTraderHistory("0x75e765216a57942d738d880ffcda854d9f869080"),
      getKalshiHistory("PredMTrader"),
    ]);

    if (histARes.status === "fulfilled") historyA = histARes.value;
    if (histBRes.status === "fulfilled") historyB = histBRes.value;
  } catch (err) {
    console.error("Failed to load battle history:", err);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader showBackButton={true} backHref="/" backLabel="Leaderboard" />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <BattleView
            contenderA={contenderA}
            contenderB={contenderB}
            historyA={historyA}
            historyB={historyB}
          />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TraderProfileView } from "@/components/profile/TraderProfileView";
import {
  getTraderProfile,
  getTraderPositions,
  getTraderTrades,
  getTraderHistory,
  getKalshiHistory,
  getKalshiCategories,
} from "@/lib/services/trader.service";
import { formatUSD } from "@/lib/normalizers/formatters";
import type {
  CategoryPerformance,
  OpenPosition,
  ProfitHistoryPoint,
  Trade,
} from "@/types/api.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const trader = await getTraderProfile(decodedId);

  if (!trader) {
    return {
      title: "Trader Profile | predicting.top",
      description: "Prediction market trader profile and performance stats on predicting.top.",
    };
  }

  const pnlStr = formatUSD(trader.stats?.all?.pnl ?? 0, {
    compact: true,
    showSign: true,
  });

  const platformName = trader.platform === "kalshi" ? "Kalshi" : "Polymarket";
  const title = `${trader.name} · ${pnlStr} all-time | predicting.top`;
  const description = `${trader.name} on ${platformName} — ${pnlStr} all-time PnL. View positions, trades, and stats on predicting.top.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
  };
}

export default async function TraderProfilePage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  // 1. Fetch Primary Profile
  const trader = await getTraderProfile(decodedId);

  if (!trader) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <div>
          <NavigationHeader showBackButton={true} backHref="/" backLabel="Leaderboard" />
          <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Trader Not Found</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Could not find a tracked profile for &ldquo;{decodedId}&rdquo;.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Return to Leaderboard
            </Link>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // 2. Fetch Supplemental Data
  const isKalshi = trader.platform === "kalshi";
  const wallet = trader.wallet || (decodedId.startsWith("0x") ? decodedId : null);
  const kalshiUsername = trader.kalshi_username || trader.name || decodedId;

  let history: ProfitHistoryPoint[] = [];
  let categories: CategoryPerformance[] = [];
  let positions: OpenPosition[] = [];
  let trades: Trade[] = [];

  try {
    if (isKalshi) {
      const [histRes, catRes] = await Promise.allSettled([
        getKalshiHistory(kalshiUsername),
        getKalshiCategories(kalshiUsername),
      ]);
      if (histRes.status === "fulfilled") history = histRes.value;
      if (catRes.status === "fulfilled") categories = catRes.value;
    } else {
      const [histRes, posRes, tradesRes] = await Promise.allSettled([
        wallet ? getTraderHistory(wallet) : Promise.resolve([]),
        wallet ? getTraderPositions(wallet, 100) : Promise.resolve([]),
        wallet ? getTraderTrades(wallet, 100) : Promise.resolve([]),
      ]);
      if (histRes.status === "fulfilled") history = histRes.value;
      if (posRes.status === "fulfilled") positions = posRes.value;
      if (tradesRes.status === "fulfilled") trades = tradesRes.value;
    }
  } catch (err) {
    console.error("Error loading supplementary trader profile data:", err);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <NavigationHeader showBackButton={true} backHref="/" backLabel="Leaderboard" />
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <TraderProfileView
            trader={trader}
            history={history}
            categories={categories}
            positions={positions}
            trades={trades}
          />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { LeaderboardHeader } from "@/components/leaderboard/LeaderboardHeader";
import { ControlBar } from "@/components/leaderboard/ControlBar";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { ProgressivePagination } from "@/components/leaderboard/ProgressivePagination";
import { SeoContent } from "@/components/leaderboard/SeoContent";
import { formatUSD } from "@/lib/normalizers/formatters";
import type {
  LeaderboardEntry,
  KalshiLeaderboardEntry,
  PlatformType,
} from "@/types/api.types";

export type LeaderboardMode = "home" | "polymarket" | "kalshi";

interface LeaderboardViewProps {
  mode: LeaderboardMode;
  initialTraders?: LeaderboardEntry[];
  initialKalshiTraders?: KalshiLeaderboardEntry[];
  lastUpdated?: string;
  dailyProfit?: number | string | null;
}

export function LeaderboardView({
  mode,
  initialTraders = [],
  initialKalshiTraders = [],
  lastUpdated,
  dailyProfit,
}: LeaderboardViewProps) {
  const isKalshi = mode === "kalshi";
  const isPolymarket = mode === "polymarket";

  // Active period state
  // On home / polymarket, predicting.top defaults to '1d'; on kalshi, defaults to 'all'
  const [period, setPeriod] = useState<string>(isKalshi ? "all" : "1d");

  // In-memory cache for fetched periods: { [period]: traders[] }
  const [tradersCache, setTradersCache] = useState<Record<string, LeaderboardEntry[]>>({
    [isKalshi ? "all" : "1d"]: initialTraders,
  });

  const [kalshiCache, setKalshiCache] = useState<Record<string, KalshiLeaderboardEntry[]>>({
    all: initialKalshiTraders,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search input
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Platform filter
  const [platform, setPlatform] = useState<string>(
    isPolymarket ? "polymarket" : "all"
  );

  // Attribute filters
  const [twitterOnly, setTwitterOnly] = useState<boolean>(false);
  const [noSports, setNoSports] = useState<boolean>(!isKalshi); // Default true on home/polymarket
  const [noEsports, setNoEsports] = useState<boolean>(!isKalshi); // Default true on home/polymarket
  const [above5Dollars, setAbove5Dollars] = useState<boolean>(!isKalshi); // Default true on home/polymarket

  // Sorting
  const [sortBy, setSortBy] = useState<string>("pnl");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Progressive pagination (for Kalshi)
  const [visibleCount, setVisibleCount] = useState<number>(100);

  // Entry limit selector ("all", "10", "25", "50", "100", "200", "500", "custom")
  const [entryLimit, setEntryLimit] = useState<string>("all");
  const [customLimit, setCustomLimit] = useState<number>(100);

  // Map UI period string to API period param
  const getApiPeriod = (uiPeriod: string): string => {
    if (uiPeriod === "1m") return "30d";
    return uiPeriod;
  };

  // Handle period change and fetch data if not already cached
  const handlePeriodChange = useCallback(
    async (newPeriod: string) => {
      setPeriod(newPeriod);
      const apiPeriod = getApiPeriod(newPeriod);

      if (isKalshi) {
        if (kalshiCache[newPeriod] && kalshiCache[newPeriod].length > 0) return;
        setIsLoading(true);
        try {
          const res = await fetch(
            `/api/proxy/api/kalshi-leaderboard?period=${apiPeriod}&limit=1000`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.traders) {
              setKalshiCache((prev) => ({ ...prev, [newPeriod]: data.traders }));
            }
          }
        } catch (err) {
          console.error("Failed to load Kalshi period data:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        if (tradersCache[newPeriod] && tradersCache[newPeriod].length > 0) return;
        setIsLoading(true);
        try {
          const res = await fetch(
            `/api/proxy/api/leaderboard?period=${apiPeriod}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.traders) {
              setTradersCache((prev) => ({ ...prev, [newPeriod]: data.traders }));
            }
          }
        } catch (err) {
          console.error("Failed to load leaderboard period data:", err);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [isKalshi, kalshiCache, tradersCache]
  );

  // If initial traders were empty (e.g. from static build without network), auto-fetch on mount
  React.useEffect(() => {
    if (isKalshi) {
      if (!initialKalshiTraders || initialKalshiTraders.length === 0) {
        handlePeriodChange("all");
      }
    } else {
      if (!initialTraders || initialTraders.length === 0) {
        handlePeriodChange("1d");
      }
    }
  }, [isKalshi, initialTraders, initialKalshiTraders, handlePeriodChange]);

  // Sorting handler for table column headers
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection(field === "rank" ? "asc" : "desc");
    }
  };

  // Filter and sort standard traders (Home / Polymarket)
  const currentTraders = tradersCache[period] || initialTraders;
  const filteredTraders = useMemo(() => {
    if (isKalshi) return [];

    let list = [...currentTraders];

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.wallet && t.wallet.toLowerCase().includes(q)) ||
          (t.additional_wallets &&
            t.additional_wallets.some((w) => w.toLowerCase().includes(q))) ||
          (t.twitter && t.twitter.toLowerCase().includes(q)) ||
          (t.kalshi_username && t.kalshi_username.toLowerCase().includes(q))
      );
    }

    // Platform filter
    if (platform !== "all") {
      list = list.filter((t) => t.platform === (platform as PlatformType));
    }

    // Twitter linked filter
    if (twitterOnly) {
      list = list.filter((t) => Boolean(t.twitter && t.twitter.trim().length > 0));
    }

    // No sports filter
    if (noSports) {
      list = list.filter((t) => (t.sports_share ?? 0) < 0.5);
    }

    // No esports filter
    if (noEsports) {
      list = list.filter((t) => (t.esports_share ?? 0) < 0.5);
    }

    // $5+ threshold filter
    if (above5Dollars) {
      list = list.filter((t) => {
        const pnl = t.stats?.pnl ?? t.allTimePnl ?? 0;
        return Math.abs(pnl) >= 5;
      });
    }

    // Sorting
    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "rank") {
        comparison = (a.rank ?? 0) - (b.rank ?? 0);
      } else if (sortBy === "score") {
        const scoreA = a.smart_score?.score ?? -999;
        const scoreB = b.smart_score?.score ?? -999;
        comparison = scoreA - scoreB;
      } else if (sortBy === "sharpe") {
        const sharpeA = a.smart_score?.sharpeRatio ?? -999;
        const sharpeB = b.smart_score?.sharpeRatio ?? -999;
        comparison = sharpeA - sharpeB;
      } else if (sortBy === "win_rate") {
        const winA = a.smart_score?.winRate ?? -999;
        const winB = b.smart_score?.winRate ?? -999;
        comparison = winA - winB;
      } else if (sortBy === "roi") {
        const roiA = a.roi ?? -999;
        const roiB = b.roi ?? -999;
        comparison = roiA - roiB;
      } else {
        // Default: pnl
        const pnlA = a.stats?.pnl ?? a.allTimePnl ?? 0;
        const pnlB = b.stats?.pnl ?? b.allTimePnl ?? 0;
        comparison = pnlA - pnlB;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return list;
  }, [
    isKalshi,
    currentTraders,
    searchQuery,
    platform,
    twitterOnly,
    noSports,
    noEsports,
    above5Dollars,
    sortBy,
    sortDirection,
  ]);

  // Filter and sort Kalshi traders
  const currentKalshiTraders = kalshiCache[period] || initialKalshiTraders;
  const filteredKalshiTraders = useMemo(() => {
    if (!isKalshi) return [];

    let list = [...currentKalshiTraders];

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.kalshi_username.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          (t.x_handle && t.x_handle.toLowerCase().includes(q))
      );
    }

    // Non-sports filter
    if (noSports) {
      list = list.filter((t) => (t.sports_share ?? 0) < 0.5);
    }

    // Sorting
    list.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "rank") {
        comparison = (a.rank ?? 0) - (b.rank ?? 0);
      } else {
        const pnlA = a.pnl ?? a.pnl_all ?? 0;
        const pnlB = b.pnl ?? b.pnl_all ?? 0;
        comparison = pnlA - pnlB;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return list;
  }, [isKalshi, currentKalshiTraders, searchQuery, noSports, sortBy, sortDirection]);

  // Effective numeric limit for entries
  const effectiveLimit = useMemo(() => {
    if (entryLimit === "all") return Infinity;
    if (entryLimit === "custom") return Math.max(1, customLimit);
    const parsed = parseInt(entryLimit, 10);
    return isNaN(parsed) ? Infinity : parsed;
  }, [entryLimit, customLimit]);

  // Displayed traders for Home / Polymarket
  const displayedTraders = useMemo(() => {
    if (isKalshi) return [];
    if (effectiveLimit === Infinity) return filteredTraders;
    return filteredTraders.slice(0, effectiveLimit);
  }, [isKalshi, filteredTraders, effectiveLimit]);

  // Progressive slice for Kalshi
  const displayedKalshiTraders = useMemo(() => {
    if (!isKalshi) return [];
    const limit = entryLimit === "all" ? visibleCount : effectiveLimit;
    return filteredKalshiTraders.slice(0, limit);
  }, [isKalshi, filteredKalshiTraders, visibleCount, entryLimit, effectiveLimit]);

  // Headings
  const title = isKalshi
    ? "Kalshi Leaderboard"
    : isPolymarket
    ? "Polymarket Leaderboard"
    : "Prediction Market Leaderboard";

  const subtitle = isKalshi
    ? "The top 1,000 Kalshi traders, tracked over time"
    : isPolymarket
    ? "Top Polymarket traders, ranked by P&L in real time"
    : "Top Polymarket, Kalshi & Hyperliquid traders, ranked by P&L in real time";

  const totalCount = isKalshi ? currentKalshiTraders.length : currentTraders.length;
  const filteredCount = isKalshi
    ? filteredKalshiTraders.length
    : filteredTraders.length;
  const displayedCount = isKalshi
    ? Math.min(displayedKalshiTraders.length, filteredCount)
    : Math.min(displayedTraders.length, filteredCount);

  return (
    <div className="w-full">
      {/* Header */}
      <LeaderboardHeader
        title={title}
        subtitle={subtitle}
        lastUpdated={lastUpdated}
        dailyProfit={isKalshi ? undefined : dailyProfit}
        showAllPlatformsLink={isKalshi}
      />

      {/* Control Bar */}
      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery("")}
        filteredCount={filteredCount}
        totalCount={totalCount}
        displayedCount={displayedCount}
        entryLimit={entryLimit}
        onEntryLimitChange={setEntryLimit}
        customLimit={customLimit}
        onCustomLimitChange={setCustomLimit}
        isKalshiOnly={isKalshi}
        period={period}
        onPeriodChange={handlePeriodChange}
        platform={platform}
        onPlatformChange={setPlatform}
        twitterOnly={twitterOnly}
        onToggleTwitterOnly={() => setTwitterOnly((prev) => !prev)}
        noSports={noSports}
        onToggleNoSports={() => setNoSports((prev) => !prev)}
        noEsports={noEsports}
        onToggleNoEsports={() => setNoEsports((prev) => !prev)}
        above5Dollars={above5Dollars}
        onToggleAbove5Dollars={() => setAbove5Dollars((prev) => !prev)}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Leaderboard Table */}
      <LeaderboardTable
        isKalshiTable={isKalshi}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        isLoading={isLoading}
        isEmpty={filteredCount === 0}
      >
        {isKalshi
          ? displayedKalshiTraders.map((trader, index) => {
              const pnl = trader.pnl ?? trader.pnl_all ?? 0;
              return (
                <LeaderboardRow
                  key={`kalshi-${trader.kalshi_username}-${index}`}
                  rank={trader.rank || index + 1}
                  name={trader.kalshi_username}
                  pfp={trader.pfp}
                  platform="kalshi"
                  twitter={trader.x_handle}
                  pnl={pnl}
                  kalshiUrl={trader.kalshi_url}
                  profilePath={trader.profile_path}
                  isKalshiTable={true}
                />
              );
            })
          : displayedTraders.map((trader, index) => {
              const pnl = trader.stats?.pnl ?? trader.allTimePnl ?? 0;
              const categoryTag = trader.day_mover
                ? `${trader.day_mover.label} ${formatUSD(trader.day_mover.change, {
                    compact: true,
                    showSign: true,
                    decimals: 0,
                  })}`
                : null;

              return (
                <LeaderboardRow
                  key={`trader-${trader.name}-${index}`}
                  rank={trader.rank || index + 1}
                  name={trader.name}
                  pfp={trader.pfp}
                  wallet={trader.wallet}
                  platform={trader.platform}
                  twitter={trader.twitter}
                  joinDate={trader.join_date}
                  score={trader.smart_score?.score}
                  pnl={pnl}
                  categoryTag={categoryTag}
                  profilePath={trader.wallet || trader.name}
                  isKalshiTable={false}
                />
              );
            })}
      </LeaderboardTable>

      {/* Progressive Pagination for Kalshi */}
      {isKalshi && (
        <ProgressivePagination
          remainingCount={filteredKalshiTraders.length - displayedKalshiTraders.length}
          onShowMore={() => setVisibleCount((prev) => prev + 100)}
          isLoading={isLoading}
        />
      )}

      {/* SEO FAQs */}
      {isPolymarket && <SeoContent type="polymarket" />}
      {isKalshi && <SeoContent type="kalshi" />}
    </div>
  );
}

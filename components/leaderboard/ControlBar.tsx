import React from "react";
import {
  PolymarketIcon,
  KalshiIcon,
  HyperliquidIcon,
  OpinionIcon,
  XIcon,
} from "@/components/ui/PlatformIcons";

export interface ControlBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  filteredCount: number;
  totalCount: number;
  isKalshiOnly?: boolean;
  period: string;
  onPeriodChange: (period: string) => void;
  platform?: string;
  onPlatformChange?: (platform: string) => void;
  twitterOnly?: boolean;
  onToggleTwitterOnly?: () => void;
  noSports?: boolean;
  onToggleNoSports?: () => void;
  noEsports?: boolean;
  onToggleNoEsports?: () => void;
  above5Dollars?: boolean;
  onToggleAbove5Dollars?: () => void;
  sortBy?: string;
  onSortByChange?: (sort: string) => void;
}

export function ControlBar({
  searchQuery,
  onSearchChange,
  onSearchClear,
  filteredCount,
  totalCount,
  isKalshiOnly = false,
  period,
  onPeriodChange,
  platform = "all",
  onPlatformChange,
  twitterOnly = false,
  onToggleTwitterOnly,
  noSports = false,
  onToggleNoSports,
  noEsports = false,
  onToggleNoEsports,
  above5Dollars = false,
  onToggleAbove5Dollars,
  sortBy,
  onSortByChange,
}: ControlBarProps) {
  // Pill styles: active vs inactive
  const getPillClass = (isActive: boolean) =>
    `inline-flex items-center justify-center px-2.5 py-1 text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none rounded-[4px] ${
      isActive
        ? "bg-foreground text-background font-semibold"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
    }`;

  const getMetricClass = (isActive: boolean) =>
    `inline-flex items-center justify-center px-2 py-0.5 text-xs transition-colors cursor-pointer select-none rounded-[4px] ${
      isActive
        ? "bg-foreground text-background font-semibold"
        : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/30"
    }`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 mb-4">
      {/* Search Input Row & Trader Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isKalshiOnly ? "Search Kalshi traders..." : "Search traders..."}
            className="w-full bg-input/10 dark:bg-[#1A1A1A] border border-border/80 rounded-md px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={onSearchClear}
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-medium px-1"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-xs sm:text-sm text-muted-foreground font-mono">
          {filteredCount} of {totalCount} traders
        </div>
      </div>

      {/* Filter Row 1: Periods & Thresholds */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {isKalshiOnly ? (
          <>
            <button
              type="button"
              onClick={() => onPeriodChange("all")}
              className={getPillClass(period === "all")}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("1m")}
              className={getPillClass(period === "1m" || period === "30d")}
            >
              1M
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("7d")}
              className={getPillClass(period === "7d")}
            >
              7D
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("1d")}
              className={getPillClass(period === "1d")}
            >
              1D
            </button>
            {onToggleNoSports && (
              <button
                type="button"
                onClick={onToggleNoSports}
                className={getPillClass(noSports)}
              >
                Non-sports
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onPeriodChange("all")}
              className={getPillClass(period === "all")}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("ytd")}
              className={getPillClass(period === "ytd")}
            >
              YTD
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("1m")}
              className={getPillClass(period === "1m" || period === "30d")}
            >
              1M
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("1d")}
              className={getPillClass(period === "1d")}
            >
              1D
            </button>
            {onToggleAbove5Dollars && (
              <button
                type="button"
                onClick={onToggleAbove5Dollars}
                className={getPillClass(above5Dollars)}
              >
                $5+
              </button>
            )}
          </>
        )}
      </div>

      {/* Filter Row 2: Platforms, Attributes & Metric Sorters (Cross-Platform / Polymarket) */}
      {!isKalshiOnly && (
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 pt-1">
          {/* Left: Platforms & Attributes */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {onPlatformChange && (
              <>
                <button
                  type="button"
                  onClick={() => onPlatformChange("polymarket")}
                  className={`gap-1.5 ${getPillClass(platform === "polymarket")}`}
                >
                  <PolymarketIcon className="w-3.5 h-3.5" />
                  <span>Polymarket</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPlatformChange("kalshi")}
                  className={`gap-1.5 ${getPillClass(platform === "kalshi")}`}
                >
                  <KalshiIcon className="w-3.5 h-3.5" />
                  <span>Kalshi</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPlatformChange("hyperliquid")}
                  className={`gap-1.5 ${getPillClass(platform === "hyperliquid")}`}
                >
                  <HyperliquidIcon className="w-3.5 h-3.5" />
                  <span>Hyperliquid</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPlatformChange("all")}
                  className={getPillClass(platform === "all")}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onPlatformChange("opinion")}
                  className={`gap-1.5 ${getPillClass(platform === "opinion")}`}
                >
                  <OpinionIcon className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Separator */}
            <span className="text-border mx-0.5">|</span>

            {/* Social & Category toggles */}
            {onToggleTwitterOnly && (
              <button
                type="button"
                onClick={onToggleTwitterOnly}
                className={`gap-1 ${getPillClass(twitterOnly)}`}
              >
                <XIcon className="w-3 h-3" />
                <span>linked</span>
              </button>
            )}
            {onToggleNoSports && (
              <button
                type="button"
                onClick={onToggleNoSports}
                className={getPillClass(noSports)}
              >
                No sports
              </button>
            )}
            {onToggleNoEsports && (
              <button
                type="button"
                onClick={onToggleNoEsports}
                className={getPillClass(noEsports)}
              >
                No esports
              </button>
            )}
          </div>

          {/* Right: Metric Sorters */}
          {onSortByChange && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSortByChange(sortBy === "sharpe" ? "pnl" : "sharpe")}
                className={getMetricClass(sortBy === "sharpe")}
              >
                Sharpe
              </button>
              <button
                type="button"
                onClick={() => onSortByChange(sortBy === "win_rate" ? "pnl" : "win_rate")}
                className={getMetricClass(sortBy === "win_rate")}
              >
                Win%
              </button>
              <button
                type="button"
                onClick={() => onSortByChange(sortBy === "roi" ? "pnl" : "roi")}
                className={getMetricClass(sortBy === "roi")}
              >
                ROI
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scoring Formula Legend */}
      {!isKalshiOnly && (
        <p className="text-[11px] text-muted-foreground/70 leading-normal pt-0.5 font-normal">
          Score = consistency 25% * returns 25% * win rate 20% * max loss 15% * profit factor 15% | Sharpe = return / volatility
        </p>
      )}
    </div>
  );
}


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
  displayedCount?: number;
  entryLimit?: string;
  onEntryLimitChange?: (limit: string) => void;
  customLimit?: number;
  onCustomLimitChange?: (custom: number) => void;
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
  displayedCount,
  entryLimit = "all",
  onEntryLimitChange,
  customLimit = 100,
  onCustomLimitChange,
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
      {/* Search Input Row, Entry Limit Selector & Trader Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
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

          {/* Entry Limit Selector beside search */}
          {onEntryLimitChange && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Show:</span>
              <select
                value={entryLimit || "all"}
                onChange={(e) => onEntryLimitChange(e.target.value)}
                aria-label="Select entries to show"
                className="bg-input/10 dark:bg-[#1A1A1A] border border-border/80 rounded-md px-2 py-1.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors cursor-pointer"
              >
                <option value="10" className="bg-background text-foreground">10</option>
                <option value="25" className="bg-background text-foreground">25</option>
                <option value="50" className="bg-background text-foreground">50</option>
                <option value="100" className="bg-background text-foreground">100</option>
                <option value="200" className="bg-background text-foreground">200</option>
                <option value="500" className="bg-background text-foreground">500</option>
                <option value="all" className="bg-background text-foreground">All</option>
                <option value="custom" className="bg-background text-foreground">Custom...</option>
              </select>
              {entryLimit === "custom" && (
                <input
                  type="number"
                  min={1}
                  max={totalCount || 1000}
                  value={customLimit || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onCustomLimitChange?.(isNaN(val) ? 1 : Math.max(1, val));
                  }}
                  aria-label="Custom entry count"
                  className="w-16 bg-input/10 dark:bg-[#1A1A1A] border border-border/80 rounded-md px-2 py-1.5 text-xs sm:text-sm text-foreground text-center focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Qty"
                />
              )}
            </div>
          )}
        </div>

        <div className="text-xs sm:text-sm text-muted-foreground font-mono">
          {displayedCount !== undefined ? displayedCount : filteredCount} of {totalCount} traders
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


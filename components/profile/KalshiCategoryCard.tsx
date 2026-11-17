import React from "react";
import { formatUSD } from "@/lib/normalizers/formatters";
import { getPnlColorClass } from "@/lib/normalizers/color-tier";
import type { CategoryPerformance } from "@/types/api.types";

interface KalshiCategoryCardProps {
  categories: CategoryPerformance[];
}

export function KalshiCategoryCard({ categories }: KalshiCategoryCardProps) {
  if (!categories || categories.length === 0) return null;

  // Find max PnL for scaling the green progress bars
  const maxPnl = Math.max(...categories.map((c) => Math.abs(c.pnl)), 1);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/40 p-4 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
        <h3 className="font-semibold text-foreground">P&amp;L by Category</h3>
        <span className="text-muted-foreground/75 text-[11px] sm:text-xs">
          Kalshi · all-time · markets traded
        </span>
      </div>

      {/* Category Rows */}
      <div className="space-y-3 pt-2">
        {categories.map((item) => {
          const percentWidth = Math.max(2, Math.min(100, (Math.abs(item.pnl) / maxPnl) * 100));
          const pnlColor = getPnlColorClass(item.pnl);

          return (
            <div
              key={item.category}
              className="flex items-center justify-between gap-3 text-xs sm:text-sm"
            >
              {/* Category Name & Market Count */}
              <div className="w-40 sm:w-52 shrink-0 flex items-center justify-between pr-4">
                <span className="font-medium text-foreground truncate">
                  {item.category}
                </span>
                <span className="text-muted-foreground/75 font-mono text-xs">
                  {item.markets.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  style={{ width: `${percentWidth}%` }}
                  className={`h-full rounded-full ${
                    item.pnl >= 0 ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </div>

              {/* P&L Value */}
              <div className="w-20 sm:w-24 text-right shrink-0">
                <span className={`font-mono font-semibold text-xs sm:text-sm ${pnlColor}`}>
                  {formatUSD(item.pnl, { compact: true, showSign: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

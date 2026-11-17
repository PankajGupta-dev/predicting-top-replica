import React from "react";
import { getScoreColorClass, getScoreTier } from "@/lib/normalizers/color-tier";
import { formatPercent } from "@/lib/normalizers/formatters";
import type { SmartScore } from "@/types/api.types";

interface SmartScoreCardProps {
  smartScore?: SmartScore | null;
}

export function SmartScoreCard({ smartScore }: SmartScoreCardProps) {
  if (!smartScore || smartScore.score === undefined || smartScore.score === null) {
    return null;
  }

  const score = smartScore.score;
  const tier = smartScore.tier || getScoreTier(score) || "Average";
  const scoreColor = getScoreColorClass(score);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/40 p-4 sm:p-6 mb-6">
      {/* Title */}
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Smart Score
      </h3>

      {/* Main Score Header */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className={`text-4xl sm:text-5xl font-extrabold tabular-nums tracking-tight ${scoreColor}`}>
          {score.toFixed(1)}
        </span>
        <span className={`text-base sm:text-lg font-semibold ${scoreColor}`}>
          {tier}
        </span>
      </div>

      {/* 5 Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-3 border-t border-border/50 text-center">
        {/* Win Rate */}
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-1">
            Win Rate
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-foreground">
            {formatPercent(smartScore.winRate, { decimals: 0 })}
          </div>
        </div>

        {/* Sharpe */}
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-1">
            Sharpe
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-foreground">
            {smartScore.sharpeRatio !== undefined ? smartScore.sharpeRatio.toFixed(2) : "–"}
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-1">
            Max Drawdown
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-foreground">
            {formatPercent(smartScore.maxDrawdownPercent, { decimals: 1 })}
          </div>
        </div>

        {/* Profit Factor */}
        <div className="p-2 bg-muted/20 rounded-lg">
          <div className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-1">
            Profit Factor
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-foreground">
            {smartScore.profitFactor !== undefined ? smartScore.profitFactor.toFixed(2) : "–"}
          </div>
        </div>

        {/* R² */}
        <div className="p-2 bg-muted/20 rounded-lg col-span-2 sm:col-span-1">
          <div className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-1">
            R²
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-foreground">
            {formatPercent(smartScore.rSquared, { decimals: 0 })}
          </div>
        </div>
      </div>
    </div>
  );
}

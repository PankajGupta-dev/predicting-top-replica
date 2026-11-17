import React from "react";
import { formatUSD } from "@/lib/normalizers/formatters";
import { getPnlColorClass } from "@/lib/normalizers/color-tier";

export interface DayPerformance {
  day: number;
  pnl: number;
  dateStr: string;
}

export interface MonthData {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  label: string; // e.g. "Nov 2026"
  netPnl: number;
  wins: number;
  losses: number;
  days: DayPerformance[];
}

interface MonthlyPerformanceBarProps {
  months: MonthData[];
  selectedMonthIndex: number;
  onSelectMonthIndex: (idx: number) => void;
}

export function MonthlyPerformanceBar({
  months,
  selectedMonthIndex,
  onSelectMonthIndex,
}: MonthlyPerformanceBarProps) {
  if (!months || months.length === 0) return null;

  const currentMonth = months[selectedMonthIndex] || months[0];
  const canGoPrev = selectedMonthIndex < months.length - 1;
  const canGoNext = selectedMonthIndex > 0;

  const pnlColor = getPnlColorClass(currentMonth.netPnl);
  const formattedPnl = formatUSD(currentMonth.netPnl, { compact: false, showSign: true, decimals: 0 });

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/40 p-3 sm:p-3.5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Month Navigator */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => canGoPrev && onSelectMonthIndex(selectedMonthIndex + 1)}
            disabled={!canGoPrev}
            className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className="font-semibold text-xs sm:text-sm text-foreground select-none min-w-[70px] text-center">
            {currentMonth.label}
          </span>

          <button
            type="button"
            onClick={() => canGoNext && onSelectMonthIndex(selectedMonthIndex - 1)}
            disabled={!canGoNext}
            className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Center: Month P&L and Win/Loss Record */}
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
          <span className={`font-bold ${pnlColor}`}>
            {formattedPnl}
          </span>
          <span className="text-muted-foreground/80 font-medium">
            {currentMonth.wins}W / {currentMonth.losses}L
          </span>
        </div>

        {/* Right: Streak Tiles */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full sm:max-w-xs">
          {currentMonth.days.map((d) => {
            let tileBg = "bg-muted/40";
            if (d.pnl > 0) tileBg = "bg-emerald-500";
            else if (d.pnl < 0) tileBg = "bg-red-500";

            return (
              <div
                key={`day-${d.day}`}
                title={`Day ${d.day}: ${formatUSD(d.pnl, { showSign: true, decimals: 0 })}`}
                className={`w-1.5 sm:w-2 h-4 sm:h-5 rounded-[2px] shrink-0 transition-opacity hover:opacity-80 ${tileBg}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

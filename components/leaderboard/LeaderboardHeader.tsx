import React from "react";
import Link from "next/link";
import { formatUSD } from "@/lib/normalizers/formatters";
import { getPnlColorClass } from "@/lib/normalizers/color-tier";

interface LeaderboardHeaderProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  dailyProfit?: number | string | null;
  showAllPlatformsLink?: boolean;
}

export function LeaderboardHeader({
  title,
  subtitle,
  lastUpdated,
  dailyProfit,
  showAllPlatformsLink = false,
}: LeaderboardHeaderProps) {
  // Format the last updated timestamp nicely if provided
  const formattedDate = React.useMemo(() => {
    if (!lastUpdated) {
      const now = new Date();
      return now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      });
    }
    try {
      const d = new Date(lastUpdated);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch {
      return lastUpdated;
    }
  }, [lastUpdated]);

  const renderedProfit = React.useMemo(() => {
    if (dailyProfit === undefined || dailyProfit === null) return null;
    if (typeof dailyProfit === "number") {
      return {
        formatted: formatUSD(dailyProfit, { compact: false, showSign: true, decimals: 0 }),
        colorClass: getPnlColorClass(dailyProfit),
      };
    }
    // String formatted (e.g. "+$415,693")
    const isNeg = dailyProfit.startsWith("-");
    return {
      formatted: dailyProfit,
      colorClass: isNeg ? "text-red-500" : "text-green-500",
    };
  }, [dailyProfit]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-foreground tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground/75 mt-0.5">
            P&amp;L updated {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {renderedProfit && (
            <div className="flex items-baseline gap-1.5 text-xs sm:text-sm font-semibold">
              <span className="text-muted-foreground font-normal">Today:</span>
              <span className={renderedProfit.colorClass}>
                {renderedProfit.formatted}
              </span>
            </div>
          )}

          {showAllPlatformsLink && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md border border-border bg-card hover:bg-muted/60 text-foreground transition-colors"
            >
              All platforms
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  MonthlyPerformanceBar,
  type MonthData,
  type DayPerformance,
} from "@/components/profile/MonthlyPerformanceBar";
import { PnlHistoryChartCard } from "@/components/profile/PnlHistoryChartCard";
import { KalshiCategoryCard } from "@/components/profile/KalshiCategoryCard";
import { SmartScoreCard } from "@/components/profile/SmartScoreCard";
import { ShareCards } from "@/components/profile/ShareCards";
import { PositionsAndTrades } from "@/components/profile/PositionsAndTrades";
import type {
  TraderProfile,
  ProfitHistoryPoint,
  CategoryPerformance,
  OpenPosition,
  Trade,
} from "@/types/api.types";

interface TraderProfileViewProps {
  trader: TraderProfile;
  history: ProfitHistoryPoint[];
  categories?: CategoryPerformance[];
  positions?: OpenPosition[];
  trades?: Trade[];
}

export function TraderProfileView({
  trader,
  history,
  categories = [],
  positions = [],
  trades = [],
}: TraderProfileViewProps) {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);

  // Derive structured MonthData from history points
  const months: MonthData[] = useMemo(() => {
    if (!history || history.length === 0) {
      // Fallback if no history points exist
      const now = new Date();
      return [
        {
          year: now.getFullYear(),
          month: now.getMonth(),
          label: now.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          netPnl: trader.stats?.["30d"]?.pnl ?? 0,
          wins: 0,
          losses: 0,
          days: [],
        },
      ];
    }

    // Group points by date YYYY-MM-DD
    const dayMap = new Map<string, { timestamp: number; pnl: number; dateStr: string }>();
    for (const pt of history) {
      const d = new Date(pt.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      // Keep latest pnl for each day
      dayMap.set(key, { timestamp: pt.timestamp, pnl: pt.pnl, dateStr: key });
    }

    // Sorted list of unique days
    const sortedDays = Array.from(dayMap.values()).sort((a, b) => a.timestamp - b.timestamp);

    // Group days by month: YYYY-MM
    const monthGroups = new Map<string, DayPerformance[]>();
    for (let i = 0; i < sortedDays.length; i++) {
      const current = sortedDays[i];
      const prevPnl = i > 0 ? sortedDays[i - 1].pnl : 0;
      const dailyDelta = current.pnl - prevPnl;

      const d = new Date(current.timestamp);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const existing = monthGroups.get(monthKey) || [];
      existing.push({
        day: d.getDate(),
        pnl: dailyDelta,
        dateStr: current.dateStr,
      });
      monthGroups.set(monthKey, existing);
    }

    const monthList: MonthData[] = [];
    monthGroups.forEach((days, monthKey) => {
      const [yStr, mStr] = monthKey.split("-");
      const year = parseInt(yStr, 10);
      const month = parseInt(mStr, 10) - 1;

      const dObj = new Date(year, month, 1);
      const label = dObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      let netPnl = 0;
      let wins = 0;
      let losses = 0;

      for (const d of days) {
        netPnl += d.pnl;
        if (d.pnl > 0) wins++;
        else if (d.pnl < 0) losses++;
      }

      monthList.push({
        year,
        month,
        label,
        netPnl,
        wins,
        losses,
        days,
      });
    });

    // Sort descending (latest month first)
    monthList.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return monthList;
  }, [history, trader]);

  const allTimePnl = trader.stats?.all?.pnl ?? 0;

  return (
    <div className="w-full">
      {/* 1. Profile Header */}
      <ProfileHeader
        name={trader.name}
        pfp={trader.pfp}
        wallet={trader.wallet}
        platform={trader.platform}
        twitter={trader.twitter}
        joinDate={trader.join_date}
        views={trader.views}
        polymarketProfile={trader.polymarket_profile}
        kalshiProfile={trader.kalshi_profile}
      />

      {/* 2. Monthly Performance Bar */}
      <MonthlyPerformanceBar
        months={months}
        selectedMonthIndex={selectedMonthIdx}
        onSelectMonthIndex={setSelectedMonthIdx}
      />

      {/* 3. P&L History Chart */}
      <PnlHistoryChartCard history={history} />

      {/* 4. Kalshi-Exclusive Category Card */}
      {trader.platform === "kalshi" && categories.length > 0 && (
        <KalshiCategoryCard categories={categories} />
      )}

      {/* 5. Open Positions & Recent Trades (Polymarket profiles) */}
      <PositionsAndTrades positions={positions} trades={trades} />

      {/* 6. Shareable Cards Section */}
      <ShareCards
        name={trader.name}
        pfp={trader.pfp}
        wallet={trader.wallet}
        platform={trader.platform}
        allTimePnl={allTimePnl}
        months={months}
        history={history}
      />

      {/* 7. Smart Score Section */}
      <SmartScoreCard smartScore={trader.smart_score} />

      {/* 8. Bottom Navigation Link */}
      <div className="w-full max-w-4xl mx-auto py-8 text-center border-t border-border/50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <span>View the Prediction Market Leaderboard</span>
          <span>→</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          Track top prediction market traders on Polymarket and Kalshi
        </p>
      </div>
    </div>
  );
}

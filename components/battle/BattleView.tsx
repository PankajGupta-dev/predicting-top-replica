"use client";

import React from "react";
import { BattleMatchupCard } from "@/components/battle/BattleMatchupCard";
import { BattleChartCard } from "@/components/battle/BattleChartCard";
import type { ProfitHistoryPoint } from "@/types/api.types";

interface BattleViewProps {
  contenderA: {
    name: string;
    handle: string;
    platform: "polymarket" | "kalshi";
    pfp?: string | null;
    twitter?: string | null;
    profileHref: string;
  };
  contenderB: {
    name: string;
    handle: string;
    platform: "polymarket" | "kalshi";
    pfp?: string | null;
    twitter?: string | null;
    profileHref: string;
  };
  historyA: ProfitHistoryPoint[];
  historyB: ProfitHistoryPoint[];
}

export function BattleView({
  contenderA,
  contenderB,
  historyA,
  historyB,
}: BattleViewProps) {
  return (
    <div className="w-full">
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Battle of the Badges
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
          Polymarket vs Kalshi
        </p>
      </div>

      {/* Competitor Matchup Card */}
      <BattleMatchupCard contenderA={contenderA} contenderB={contenderB} />

      {/* Relative Performance Chart Card */}
      <BattleChartCard
        labelA={contenderA.handle}
        labelB={contenderB.handle}
        historyA={historyA}
        historyB={historyB}
      />

      {/* HiveLiveHQ Hosted Footer Branding */}
      <div className="flex flex-col items-center justify-center pt-8 pb-6 text-center">
        <a
          href="https://x.com/HiveLiveHQ"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {/* Honeycomb Hexagon SVG */}
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-500">
              <path d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2ZM12 4.3L18 7.7V16.3L12 19.7L6 16.3V7.7L12 4.3Z" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xs font-medium">Hosted by HiveLiveHQ</span>
        </a>
      </div>
    </div>
  );
}

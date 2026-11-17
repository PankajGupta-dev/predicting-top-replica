"use client";

import React, { useState, useRef } from "react";
import { formatUSD } from "@/lib/normalizers/formatters";
import { PolymarketIcon, KalshiIcon, XIcon } from "@/components/ui/PlatformIcons";
import type { MonthData } from "@/components/profile/MonthlyPerformanceBar";
import type { ProfitHistoryPoint, PlatformType } from "@/types/api.types";

interface ShareCardsProps {
  name: string;
  pfp?: string | null;
  wallet?: string | null;
  platform: PlatformType | string;
  allTimePnl: number;
  months: MonthData[];
  history: ProfitHistoryPoint[];
}

export function ShareCards({
  name,
  pfp,
  platform,
  allTimePnl,
  months,
  history,
}: ShareCardsProps) {
  const isKalshi = platform === "kalshi";
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [cardTheme, setCardTheme] = useState<"light" | "black">("light");
  const [chartTf, setChartTf] = useState<"all" | "30d" | "7d">("all");
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const activeMonth = months[selectedMonthIdx] || months[0] || {
    label: "Current Month",
    year: 2026,
    month: 10,
    netPnl: 0,
    wins: 0,
    losses: 0,
    days: [],
  };

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Share handlers
  const handleShare = async (titleText: string) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: titleText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to copy link
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedStatus("Link copied!");
      setTimeout(() => setCopiedStatus(null), 2500);
    }
  };

  const handleCopyImage = async (cardRef: React.RefObject<HTMLDivElement | null>) => {
    // Canvas copy fallback
    setCopiedStatus("Copied to clipboard!");
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  const handleDownload = (cardRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
    setCopiedStatus("Downloading image...");
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  const openXIntent = (text: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const tweetText = `${text}\n\n${url}`;
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const isLight = cardTheme === "light";
  const cardBgClass = isLight ? "bg-white text-zinc-950" : "bg-[#161616] text-white";
  const cardBorderClass = isLight ? "border-zinc-200" : "border-zinc-800";
  const gridCellMuted = isLight ? "text-zinc-400" : "text-zinc-600";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mb-8">
      {/* Toast Notification */}
      {copiedStatus && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-2 rounded-lg font-medium text-xs shadow-lg animate-fade-in">
          {copiedStatus}
        </div>
      )}

      {/* ========================================================= */}
      {/* CARD 1: Share month + all-time */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Share month + all-time
          </h2>

          <div className="flex items-center gap-2">
            {/* Month Select */}
            {months.length > 0 && (
              <select
                value={selectedMonthIdx}
                onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
                className="bg-card border border-border text-foreground text-xs rounded px-2.5 py-1 focus:outline-none"
              >
                {months.map((m, idx) => (
                  <option key={m.label} value={idx}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center border border-border rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setCardTheme("light")}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  isLight ? "bg-foreground text-background" : "bg-card text-muted-foreground"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setCardTheme("black")}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  !isLight ? "bg-foreground text-background" : "bg-card text-muted-foreground"
                }`}
              >
                Black
              </button>
            </div>
          </div>
        </div>

        {/* Visual Card 1 */}
        <div
          ref={card1Ref}
          className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm ${cardBgClass} ${cardBorderClass}`}
        >
          {/* Card 1 Top Bar */}
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-black/10">
                {pfp ? (
                  <img src={pfp} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm uppercase">{initial}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 font-bold text-base">
                <span>{name}</span>
                {isKalshi ? (
                  <KalshiIcon className="w-4 h-4" />
                ) : (
                  <PolymarketIcon className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* All-Time Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold text-xs sm:text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span>{formatUSD(allTimePnl, { compact: false, showSign: true, decimals: 0 })}</span>
              <span className="font-normal opacity-75">· All-time · P&amp;L</span>
            </div>
          </div>

          {/* Card 1 Body: Left Calendar, Right Mini Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Month Calendar Grid */}
            <div className="space-y-2">
              <div className="font-extrabold text-xs uppercase tracking-wider opacity-80">
                {activeMonth.label}
              </div>

              {/* Day Header */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] opacity-60">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1">
                {activeMonth.days.slice(0, 28).map((d) => (
                  <div
                    key={`day-${d.day}`}
                    className={`h-11 rounded border flex flex-col items-center justify-center p-0.5 text-center ${
                      isLight ? "border-zinc-100 bg-zinc-50" : "border-zinc-800/80 bg-zinc-900/60"
                    }`}
                  >
                    <span className="text-[9px] font-mono opacity-50">{d.day}</span>
                    <span
                      className={`text-[9px] font-mono font-bold leading-tight ${
                        d.pnl > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : d.pnl < 0
                          ? "text-red-600 dark:text-red-400"
                          : gridCellMuted
                      }`}
                    >
                      {d.pnl !== 0 ? formatUSD(d.pnl, { compact: true, showSign: true, decimals: 0 }) : "–"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mini Chart Preview */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border/50 h-full min-h-[180px]">
              <div className="text-xs font-semibold opacity-70 mb-2">Growth Curve</div>
              <svg viewBox="0 0 300 120" className="w-full h-24 overflow-visible">
                <path
                  d="M 0 100 Q 75 95 150 70 T 300 15"
                  fill="none"
                  stroke={allTimePnl >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth="2.5"
                />
                <circle cx="300" cy="15" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
              <div className="mt-2 text-right w-full text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Peak: {formatUSD(allTimePnl, { compact: true, showSign: true })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => handleShare(`${name}'s month & all-time record`)}
            className="px-4 py-1.5 rounded-full bg-foreground text-background font-semibold text-xs transition-colors hover:opacity-90"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => handleCopyImage(card1Ref)}
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            Copy image
          </button>
          <button
            type="button"
            onClick={() => handleDownload(card1Ref, `${name}-month-alltime.png`)}
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            Download
          </button>
          <button
            type="button"
            onClick={() =>
              openXIntent(
                `${name}'s ${activeMonth.label} on ${isKalshi ? "Kalshi" : "Polymarket"}, ${formatUSD(
                  allTimePnl,
                  { compact: true, showSign: true }
                )} all-time`
              )
            }
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <XIcon className="w-3 h-3" />
            <span>Post on X</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CARD 2: Share P&L chart */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Share P&amp;L chart
          </h2>

          <div className="flex items-center gap-2">
            {/* Timeframe Buttons */}
            <div className="flex items-center border border-border rounded overflow-hidden">
              {(["all", "30d", "7d"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setChartTf(tf)}
                  className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                    chartTf === tf
                      ? "bg-foreground text-background font-semibold"
                      : "bg-card text-muted-foreground"
                  }`}
                >
                  {tf === "all" ? "All time" : tf.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center border border-border rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setCardTheme("light")}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  isLight ? "bg-foreground text-background" : "bg-card text-muted-foreground"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setCardTheme("black")}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  !isLight ? "bg-foreground text-background" : "bg-card text-muted-foreground"
                }`}
              >
                Black
              </button>
            </div>
          </div>
        </div>

        {/* Visual Card 2 */}
        <div
          ref={card2Ref}
          className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm ${cardBgClass} ${cardBorderClass}`}
        >
          {/* Card 2 Top Bar */}
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-black/10">
                {pfp ? (
                  <img src={pfp} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm uppercase">{initial}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 font-bold text-base">
                <span>{name}</span>
                {isKalshi ? (
                  <KalshiIcon className="w-4 h-4" />
                ) : (
                  <PolymarketIcon className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Timeframe P&L Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold text-xs sm:text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span>{formatUSD(allTimePnl, { compact: false, showSign: true, decimals: 0 })}</span>
              <span className="font-normal opacity-75">· {chartTf.toUpperCase()} · P&amp;L</span>
            </div>
          </div>

          {/* Full Width Line Chart */}
          <div className="w-full h-44 relative flex items-center justify-center">
            <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
              <path
                d="M 0 130 Q 150 120 300 80 T 600 20"
                fill="none"
                stroke={allTimePnl >= 0 ? "#10b981" : "#ef4444"}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="600" cy="20" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => handleShare(`${name}'s P&L chart`)}
            className="px-4 py-1.5 rounded-full bg-foreground text-background font-semibold text-xs transition-colors hover:opacity-90"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => handleCopyImage(card2Ref)}
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            Copy image
          </button>
          <button
            type="button"
            onClick={() => handleDownload(card2Ref, `${name}-pnl-chart.png`)}
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            Download
          </button>
          <button
            type="button"
            onClick={() =>
              openXIntent(
                `${name} is up ${formatUSD(allTimePnl, { compact: true, showSign: true })} all-time on ${
                  isKalshi ? "Kalshi" : "Polymarket"
                }`
              )
            }
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <XIcon className="w-3 h-3" />
            <span>Post on X</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CARD 3: Share month */}
      {/* ========================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Share month
          </h2>

          <div className="flex items-center gap-2">
            {/* Month Select */}
            {months.length > 0 && (
              <select
                value={selectedMonthIdx}
                onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
                className="bg-card border border-border text-foreground text-xs rounded px-2.5 py-1 focus:outline-none"
              >
                {months.map((m, idx) => (
                  <option key={m.label} value={idx}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center border border-border rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setCardTheme("light")}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  isLight ? "bg-foreground text-background" : "bg-card text-muted-foreground"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setCardTheme("black")}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  !isLight ? "bg-foreground text-background" : "bg-card text-muted-foreground"
                }`}
              >
                Black
              </button>
            </div>
          </div>
        </div>

        {/* Visual Card 3 */}
        <div
          ref={card3Ref}
          className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm ${cardBgClass} ${cardBorderClass}`}
        >
          {/* Card 3 Top Bar */}
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-black/10">
                {pfp ? (
                  <img src={pfp} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm uppercase">{initial}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 font-bold text-base">
                <span>{name}</span>
                {isKalshi ? (
                  <KalshiIcon className="w-4 h-4" />
                ) : (
                  <PolymarketIcon className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Monthly Net P&L Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold text-xs sm:text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span>{formatUSD(activeMonth.netPnl, { compact: false, showSign: true, decimals: 0 })}</span>
              <span className="font-normal opacity-75">· {activeMonth.label}</span>
            </div>
          </div>

          {/* Large Month Calendar */}
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs opacity-60">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {activeMonth.days.map((d) => (
                <div
                  key={`card3-day-${d.day}`}
                  className={`h-14 sm:h-16 rounded-lg border flex flex-col items-center justify-center p-1 text-center ${
                    isLight ? "border-zinc-100 bg-zinc-50" : "border-zinc-800/80 bg-zinc-900/60"
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-50">{d.day}</span>
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold leading-tight ${
                      d.pnl > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : d.pnl < 0
                        ? "text-red-600 dark:text-red-400"
                        : gridCellMuted
                    }`}
                  >
                    {d.pnl !== 0 ? formatUSD(d.pnl, { compact: true, showSign: true, decimals: 0 }) : "–"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => handleShare(`${name}'s ${activeMonth.label} calendar`)}
            className="px-4 py-1.5 rounded-full bg-foreground text-background font-semibold text-xs transition-colors hover:opacity-90"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => handleCopyImage(card3Ref)}
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            Copy image
          </button>
          <button
            type="button"
            onClick={() => handleDownload(card3Ref, `${name}-${activeMonth.label}.png`)}
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            Download
          </button>
          <button
            type="button"
            onClick={() =>
              openXIntent(
                `${name}'s ${activeMonth.label} P&L on ${isKalshi ? "Kalshi" : "Polymarket"}`
              )
            }
            className="px-4 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <XIcon className="w-3 h-3" />
            <span>Post on X</span>
          </button>
        </div>
      </div>
    </div>
  );
}

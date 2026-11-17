"use client";

import React, { useState, useMemo, useRef } from "react";
import { formatUSD } from "@/lib/normalizers/formatters";
import type { ProfitHistoryPoint } from "@/types/api.types";

interface PnlHistoryChartCardProps {
  history: ProfitHistoryPoint[];
  title?: string;
  timeframe?: "all" | "30d" | "7d";
  onTimeframeChange?: (tf: "all" | "30d" | "7d") => void;
  showTimeframeSelector?: boolean;
}

export function PnlHistoryChartCard({
  history,
  title = "P&L History",
  timeframe = "all",
  onTimeframeChange,
  showTimeframeSelector = false,
}: PnlHistoryChartCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Filter history points based on timeframe if provided
  const points = useMemo(() => {
    if (!history || history.length === 0) return [];
    if (timeframe === "all") return history;

    const now = history[history.length - 1]?.timestamp || Date.now();
    const daysLimit = timeframe === "7d" ? 7 : 30;
    const cutoff = now - daysLimit * 24 * 60 * 60 * 1000;
    const filtered = history.filter((p) => p.timestamp >= cutoff);
    return filtered.length > 0 ? filtered : history;
  }, [history, timeframe]);

  // Compute min, max, zero baseline
  const { minPnl, maxPnl, yTicks, xTicks, pathD, isPositive } = useMemo(() => {
    if (points.length === 0) {
      return { minPnl: 0, maxPnl: 0, yTicks: [], xTicks: [], pathD: "", isPositive: true };
    }

    let min = Infinity;
    let max = -Infinity;
    for (const p of points) {
      if (p.pnl < min) min = p.pnl;
      if (p.pnl > max) max = p.pnl;
    }

    // Add padding to bounds
    const range = max - min || 1;
    const paddedMin = min - range * 0.05;
    const paddedMax = max + range * 0.05;
    const paddedRange = paddedMax - paddedMin || 1;

    // Y ticks (5 ticks from min to max)
    const ticksCount = 5;
    const ticks = [];
    for (let i = 0; i < ticksCount; i++) {
      const val = paddedMin + (paddedRange / (ticksCount - 1)) * i;
      ticks.push(val);
    }

    // X ticks (5 date points evenly distributed)
    const xMilestones: Array<{ label: string; xPercent: number }> = [];
    const step = Math.floor((points.length - 1) / 4) || 1;
    for (let i = 0; i < points.length; i += step) {
      const p = points[i];
      if (p) {
        const d = new Date(p.timestamp);
        const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        const xPercent = (i / (points.length - 1)) * 100;
        xMilestones.push({ label, xPercent });
      }
    }
    // Ensure last point is included
    const lastP = points[points.length - 1];
    if (lastP) {
      const d = new Date(lastP.timestamp);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      xMilestones[xMilestones.length - 1] = { label, xPercent: 100 };
    }

    // SVG ViewBox is 1000 x 300
    const w = 1000;
    const h = 300;
    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * w;
      const y = h - ((p.pnl - paddedMin) / paddedRange) * h;
      return { x, y };
    });

    let dStr = "";
    if (coords.length > 0) {
      dStr = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 1; i < coords.length; i++) {
        dStr += ` L ${coords[i].x} ${coords[i].y}`;
      }
    }

    const endPnl = points[points.length - 1]?.pnl ?? 0;
    return {
      minPnl: paddedMin,
      maxPnl: paddedMax,
      yTicks: ticks.reverse(), // Top to bottom
      xTicks: xMilestones,
      pathD: dStr,
      isPositive: endPnl >= 0,
    };
  }, [points]);

  // Handle mouse move over chart
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || points.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clientX / rect.width));
    const idx = Math.round(fraction * (points.length - 1));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  // Zero line Y percent
  const zeroYPercent = useMemo(() => {
    if (minPnl >= 0) return null;
    if (maxPnl <= 0) return null;
    return ((maxPnl - 0) / (maxPnl - minPnl)) * 100;
  }, [minPnl, maxPnl]);

  const lineColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/40 p-4 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <span>{title}</span>
          <span
            title="Historical cumulative profit and loss across all closed markets"
            className="cursor-help"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-muted-foreground/70"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
        </div>

        {showTimeframeSelector && onTimeframeChange && (
          <div className="flex items-center gap-1">
            {(["all", "30d", "7d"] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => onTimeframeChange(tf)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                  timeframe === tf
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {tf === "all" ? "All time" : tf.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-56 sm:h-64 select-none cursor-crosshair"
      >
        {/* Y-Axis Labels Left Overlay */}
        <div className="absolute left-2 top-0 bottom-6 flex flex-col justify-between pointer-events-none text-[11px] font-mono text-muted-foreground/80 z-10">
          {yTicks.map((val, i) => (
            <span key={`ytick-${i}`}>{formatUSD(val, { compact: true, showSign: true })}</span>
          ))}
        </div>

        {/* Zero baseline */}
        {zeroYPercent !== null && (
          <div
            style={{ top: `${zeroYPercent}%` }}
            className="absolute left-0 right-0 border-b border-dashed border-border/70 pointer-events-none"
          />
        )}

        {/* SVG Line */}
        <svg
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          className="w-full h-full pb-6 overflow-visible"
        >
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Active Hover Point Circle on SVG */}
          {hoverIndex !== null && points[hoverIndex] && (
            <circle
              cx={(hoverIndex / (points.length - 1)) * 1000}
              cy={300 - ((points[hoverIndex].pnl - minPnl) / (maxPnl - minPnl)) * 300}
              r="4"
              fill={lineColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Hover Crosshair Vertical Line */}
        {hoverIndex !== null && (
          <div
            style={{ left: `${(hoverIndex / (points.length - 1)) * 100}%` }}
            className="absolute top-0 bottom-6 w-px bg-foreground/30 pointer-events-none"
          />
        )}

        {/* Hover Tooltip */}
        {activePoint && (
          <div
            style={{
              left: `${Math.min(85, Math.max(15, (hoverIndex! / (points.length - 1)) * 100))}%`,
              top: "10%",
            }}
            className="absolute -translate-x-1/2 bg-popover/90 backdrop-blur-sm border border-border rounded-md px-2.5 py-1.5 shadow-sm text-xs font-mono pointer-events-none z-20"
          >
            <div className="text-[10px] text-muted-foreground">
              {new Date(activePoint.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div
              className={`font-semibold ${
                activePoint.pnl >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {formatUSD(activePoint.pnl, { compact: false, showSign: true })}
            </div>
          </div>
        )}

        {/* X-Axis Date Milestones */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-between pointer-events-none text-[10px] sm:text-[11px] font-mono text-muted-foreground/70">
          {xTicks.map((tick, i) => (
            <span key={`xtick-${i}`}>{tick.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

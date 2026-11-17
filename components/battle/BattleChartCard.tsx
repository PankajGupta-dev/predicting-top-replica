"use client";

import React, { useState, useMemo, useRef } from "react";
import { formatUSD } from "@/lib/normalizers/formatters";
import type { ProfitHistoryPoint } from "@/types/api.types";

interface BattleChartCardProps {
  labelA: string;
  labelB: string;
  historyA: ProfitHistoryPoint[];
  historyB: ProfitHistoryPoint[];
}

export function BattleChartCard({
  labelA,
  labelB,
  historyA,
  historyB,
}: BattleChartCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Normalize both history curves relative to common baseline
  const { normalizedPoints, yTicks, xTicks, pathA, pathB, minVal, maxVal, zeroYPercent } =
    useMemo(() => {
      if (!historyA.length && !historyB.length) {
        return {
          normalizedPoints: [],
          yTicks: [],
          xTicks: [],
          pathA: "",
          pathB: "",
          minVal: 0,
          maxVal: 0,
          zeroYPercent: null,
        };
      }

      // Find earliest and latest overlapping timestamp
      const allTimestamps = [
        ...historyA.map((p) => p.timestamp),
        ...historyB.map((p) => p.timestamp),
      ].sort((a, b) => a - b);

      const startTs = allTimestamps[0];
      const endTs = allTimestamps[allTimestamps.length - 1];

      // Interpolate 60 evenly spaced points
      const pointCount = 60;
      const step = (endTs - startTs) / (pointCount - 1) || 1;

      // Find baseline values (first available value)
      const baseA = historyA[0]?.pnl ?? 0;
      const baseB = historyB[0]?.pnl ?? 0;

      const getNearestPnl = (hist: ProfitHistoryPoint[], ts: number, base: number) => {
        if (!hist.length) return 0;
        let closest = hist[0];
        let minDiff = Math.abs(hist[0].timestamp - ts);
        for (let i = 1; i < hist.length; i++) {
          const diff = Math.abs(hist[i].timestamp - ts);
          if (diff < minDiff) {
            minDiff = diff;
            closest = hist[i];
          }
        }
        return closest.pnl - base;
      };

      const points = [];
      let min = 0;
      let max = 0;

      for (let i = 0; i < pointCount; i++) {
        const ts = startTs + i * step;
        const valA = getNearestPnl(historyA, ts, baseA);
        const valB = getNearestPnl(historyB, ts, baseB);

        if (valA < min) min = valA;
        if (valA > max) max = valA;
        if (valB < min) min = valB;
        if (valB > max) max = valB;

        points.push({ timestamp: ts, valA, valB });
      }

      const range = max - min || 1;
      const paddedMin = min - range * 0.08;
      const paddedMax = max + range * 0.08;
      const paddedRange = paddedMax - paddedMin || 1;

      // 4 Y ticks
      const ticks = [];
      for (let i = 0; i < 4; i++) {
        ticks.push(paddedMin + (paddedRange / 3) * i);
      }

      // 6 X ticks
      const xMilestones: Array<{ label: string; xPercent: number }> = [];
      const xStep = Math.floor((pointCount - 1) / 5) || 1;
      for (let i = 0; i < pointCount; i += xStep) {
        const pt = points[i];
        if (pt) {
          const d = new Date(pt.timestamp);
          const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const xPercent = (i / (pointCount - 1)) * 100;
          xMilestones.push({ label, xPercent });
        }
      }

      // Generate SVG path strings (viewBox: 1000 x 300)
      const w = 1000;
      const h = 300;

      const coordsA = points.map((p, idx) => ({
        x: (idx / (pointCount - 1)) * w,
        y: h - ((p.valA - paddedMin) / paddedRange) * h,
      }));

      const coordsB = points.map((p, idx) => ({
        x: (idx / (pointCount - 1)) * w,
        y: h - ((p.valB - paddedMin) / paddedRange) * h,
      }));

      const toPath = (coords: Array<{ x: number; y: number }>) => {
        if (!coords.length) return "";
        let d = `M ${coords[0].x} ${coords[0].y}`;
        for (let i = 1; i < coords.length; i++) {
          d += ` L ${coords[i].x} ${coords[i].y}`;
        }
        return d;
      };

      const zeroY =
        paddedMin < 0 && paddedMax > 0
          ? ((paddedMax - 0) / paddedRange) * 100
          : null;

      return {
        normalizedPoints: points,
        yTicks: ticks.reverse(),
        xTicks: xMilestones,
        pathA: toPath(coordsA),
        pathB: toPath(coordsB),
        minVal: paddedMin,
        maxVal: paddedMax,
        zeroYPercent: zeroY,
      };
    }, [historyA, historyB]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || normalizedPoints.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clientX / rect.width));
    const idx = Math.round(fraction * (normalizedPoints.length - 1));
    setHoverIndex(idx);
  };

  const activePoint = hoverIndex !== null ? normalizedPoints[hoverIndex] : null;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-8 mb-6 shadow-sm">
      {/* Header & Legend */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">
          Relative Performance
        </h2>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />
            <span className="text-foreground">{labelA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />
            <span className="text-foreground">{labelB}</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        className="relative w-full h-64 sm:h-72 select-none cursor-crosshair"
      >
        {/* Y-Axis Scale Labels Left Overlay */}
        <div className="absolute left-1 top-0 bottom-6 flex flex-col justify-between pointer-events-none text-[10px] sm:text-[11px] font-mono text-muted-foreground/80 z-10">
          {yTicks.map((val, i) => (
            <span key={`y-${i}`}>{formatUSD(val, { compact: true, showSign: true })}</span>
          ))}
        </div>

        {/* Zero baseline */}
        {zeroYPercent !== null && (
          <div
            style={{ top: `${zeroYPercent}%` }}
            className="absolute left-0 right-0 border-b border-dashed border-border/70 pointer-events-none"
          />
        )}

        {/* Dual Line SVG */}
        <svg
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          className="w-full h-full pb-6 overflow-visible"
        >
          {/* Blue Line (Contender A - Polymarket) */}
          {pathA && (
            <path
              d={pathA}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Green Line (Contender B - Kalshi) */}
          {pathB && (
            <path
              d={pathB}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Active Points on SVG */}
          {hoverIndex !== null && activePoint && (
            <>
              <circle
                cx={(hoverIndex / (normalizedPoints.length - 1)) * 1000}
                cy={300 - ((activePoint.valA - minVal) / (maxVal - minVal)) * 300}
                r="4.5"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={(hoverIndex / (normalizedPoints.length - 1)) * 1000}
                cy={300 - ((activePoint.valB - minVal) / (maxVal - minVal)) * 300}
                r="4.5"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </>
          )}
        </svg>

        {/* Vertical Crosshair Line */}
        {hoverIndex !== null && (
          <div
            style={{ left: `${(hoverIndex / (normalizedPoints.length - 1)) * 100}%` }}
            className="absolute top-0 bottom-6 w-px bg-foreground/30 pointer-events-none"
          />
        )}

        {/* Hover Floating Tooltip */}
        {activePoint && (
          <div
            style={{
              left: `${Math.min(85, Math.max(15, (hoverIndex! / (normalizedPoints.length - 1)) * 100))}%`,
              top: "12%",
            }}
            className="absolute -translate-x-1/2 bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg text-xs font-mono pointer-events-none z-20 space-y-1"
          >
            <div className="text-[10px] text-muted-foreground pb-1 border-b border-border/40">
              {new Date(activePoint.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center justify-between gap-4 text-blue-400 font-semibold">
              <span>{labelA}:</span>
              <span>{formatUSD(activePoint.valA, { compact: true, showSign: true })}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-400 font-semibold">
              <span>{labelB}:</span>
              <span>{formatUSD(activePoint.valB, { compact: true, showSign: true })}</span>
            </div>
          </div>
        )}

        {/* X-Axis Date Milestones */}
        <div className="absolute left-0 right-0 bottom-0 flex justify-between pointer-events-none text-[10px] sm:text-[11px] font-mono text-muted-foreground/70">
          {xTicks.map((tick, i) => (
            <span key={`x-${i}`}>{tick.label}</span>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="text-center text-[11px] text-muted-foreground/75 mt-3 select-none">
        P/L change since comparison start date
      </div>
    </div>
  );
}

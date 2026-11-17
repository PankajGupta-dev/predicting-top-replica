"use client";

import React, { useState } from "react";
import { formatUSD, formatPercent } from "@/lib/normalizers/formatters";
import { getPnlColorClass } from "@/lib/normalizers/color-tier";
import type { OpenPosition, Trade } from "@/types/api.types";

interface PositionsAndTradesProps {
  positions: OpenPosition[];
  trades: Trade[];
}

export function PositionsAndTrades({ positions, trades }: PositionsAndTradesProps) {
  const [activeTab, setActiveTab] = useState<"positions" | "trades">("positions");

  const hasPositions = positions && positions.length > 0;
  const hasTrades = trades && trades.length > 0;

  if (!hasPositions && !hasTrades) return null;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/40 p-4 sm:p-6 mb-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-4">
        {hasPositions && (
          <button
            type="button"
            onClick={() => setActiveTab("positions")}
            className={`text-sm font-semibold transition-colors pb-1 border-b-2 -mb-[13px] ${
              activeTab === "positions"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Open Positions ({positions.length})
          </button>
        )}
        {hasTrades && (
          <button
            type="button"
            onClick={() => setActiveTab("trades")}
            className={`text-sm font-semibold transition-colors pb-1 border-b-2 -mb-[13px] ${
              activeTab === "trades"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Recent Trades ({trades.length})
          </button>
        )}
      </div>

      {/* POSITIONS TABLE */}
      {activeTab === "positions" && hasPositions && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground font-medium pb-2">
                <th className="py-2 pr-3 font-semibold">Market</th>
                <th className="py-2 px-2 text-center font-semibold">Outcome</th>
                <th className="py-2 px-2 text-right font-semibold">Size</th>
                <th className="py-2 px-2 text-right font-semibold">Avg / Cur Price</th>
                <th className="py-2 px-2 text-right font-semibold">Value</th>
                <th className="py-2 pl-3 text-right font-semibold">P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => {
                const isYes = pos.outcome?.toLowerCase() === "yes";
                const pnlColor = getPnlColorClass(pos.cash_pnl);

                return (
                  <tr
                    key={pos.id}
                    className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                  >
                    {/* Market title & icon */}
                    <td className="py-2.5 pr-3 max-w-[220px] sm:max-w-xs">
                      <div className="flex items-center gap-2">
                        {pos.icon && (
                          <img
                            src={pos.icon}
                            alt=""
                            className="w-5 h-5 rounded-full shrink-0 object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        )}
                        <a
                          href={pos.polymarket_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-medium text-foreground hover:underline"
                          title={pos.market}
                        >
                          {pos.market}
                        </a>
                      </div>
                    </td>

                    {/* Outcome badge */}
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          isYes
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-red-500/15 text-red-500"
                        }`}
                      >
                        {pos.outcome}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">
                      {pos.size_formatted || pos.size.toLocaleString()}
                    </td>

                    {/* Avg / Current Price */}
                    <td className="py-2.5 px-2 text-right font-mono text-xs">
                      <div>{pos.avg_price_formatted || `$${pos.avg_price.toFixed(3)}`}</div>
                      <div className="text-[10px] text-muted-foreground/80">
                        cur ${pos.current_price.toFixed(3)}
                      </div>
                    </td>

                    {/* Current Value */}
                    <td className="py-2.5 px-2 text-right font-mono font-medium">
                      {pos.current_value_formatted || formatUSD(pos.current_value)}
                    </td>

                    {/* Cash & Percent P&L */}
                    <td className="py-2.5 pl-3 text-right tabular-nums">
                      <div className={`font-mono font-bold ${pnlColor}`}>
                        {pos.cash_pnl_formatted || formatUSD(pos.cash_pnl, { showSign: true })}
                      </div>
                      <div className={`text-[10px] ${pnlColor}`}>
                        {pos.pnl_formatted || formatPercent(pos.percent_pnl, { showSign: true })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TRADES TABLE */}
      {activeTab === "trades" && hasTrades && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground font-medium pb-2">
                <th className="py-2 pr-3 font-semibold">Time</th>
                <th className="py-2 pr-3 font-semibold">Market</th>
                <th className="py-2 px-2 text-center font-semibold">Action</th>
                <th className="py-2 px-2 text-center font-semibold">Outcome</th>
                <th className="py-2 px-2 text-right font-semibold">Price</th>
                <th className="py-2 px-2 text-right font-semibold">Shares</th>
                <th className="py-2 pl-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => {
                const isBuy = t.type?.toLowerCase() === "buy";
                const isYes = t.outcome?.toLowerCase() === "yes";

                return (
                  <tr
                    key={t.id || t.transaction_hash}
                    className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                  >
                    {/* Time */}
                    <td className="py-2.5 pr-3 text-muted-foreground text-xs whitespace-nowrap">
                      {t.time}
                    </td>

                    {/* Market Title */}
                    <td className="py-2.5 pr-3 max-w-[200px] sm:max-w-xs">
                      <div className="flex items-center gap-2">
                        {t.icon && (
                          <img
                            src={t.icon}
                            alt=""
                            className="w-5 h-5 rounded-full shrink-0 object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        )}
                        <a
                          href={t.polymarket_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-medium text-foreground hover:underline"
                          title={t.market}
                        >
                          {t.market}
                        </a>
                      </div>
                    </td>

                    {/* Action: Buy or Sell */}
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isBuy
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-red-500/15 text-red-500"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>

                    {/* Outcome */}
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isYes
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {t.outcome}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-2.5 px-2 text-right font-mono text-xs">
                      ${t.price.toFixed(3)}
                    </td>

                    {/* Shares */}
                    <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">
                      {t.shares_amount.toLocaleString()}
                    </td>

                    {/* Total USD */}
                    <td className="py-2.5 pl-3 text-right font-mono font-medium">
                      {t.total_formatted || formatUSD(t.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

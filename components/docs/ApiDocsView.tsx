"use client";

import React, { useState } from "react";

interface EndpointItem {
  method: "GET";
  path: string;
  description: string;
  params?: string;
  tryUrl: string;
  fields?: string;
}

const endpoints: EndpointItem[] = [
  {
    method: "GET",
    path: "/api/leaderboard",
    description: "Full cross-platform leaderboard (Polymarket, Kalshi, Myriad), ranked by P&L for the period.",
    params: "period=1d|7d|30d|90d|ytd|all",
    tryUrl: "/api/leaderboard?period=7d",
    fields: "rank, name, platform, wallet, kalshi_username, pfp, stats, allTimePnl, smart_score, twitter, roi, sports_share, day_mover",
  },
  {
    method: "GET",
    path: "/api/embed/leaderboard",
    description: "Compact leaderboard for embedding on your site, with profile links.",
    params: "period=1d|7d|30d|all",
    tryUrl: "/api/embed/leaderboard?period=all",
    fields: "rank, name, pnl, pfp, profile_url, platform, smart_score, win_rate, sharpe_ratio",
  },
  {
    method: "GET",
    path: "/api/kalshi-leaderboard",
    description: "Kalshi-only leaderboard of the top 1,000 Kalshi traders, tracked over time.",
    params: "period=1d|7d|30d|all, limit=1-2000 (default 1000)",
    tryUrl: "/api/kalshi-leaderboard?period=all&limit=10",
    fields: "rank, kalshi_username, name, pfp, profile_path, kalshi_url, pnl, pnl_all, tracked, sports_share, x_handle, last_synced_at",
  },
  {
    method: "GET",
    path: "/api/trader/{wallet-or-kalshi-username}",
    description: "One trader's profile: P&L by period, wallets, linked accounts and smart score.",
    tryUrl: "/api/trader/0x5a218c7ad04135830a45c41aaed7294df7809318",
    fields: "name, wallet, additional_wallets, wallet_count, twitter, pfp, platform, stats, allTimePnl, join_date, smart_score",
  },
  {
    method: "GET",
    path: "/api/trader/{wallet}/positions",
    description: "Live open Polymarket positions for a tracked trader, largest first.",
    params: "limit=1-500, offset, sizeThreshold",
    tryUrl: "/api/trader/0x5a218c7ad04135830a45c41aaed7294df7809318/positions",
    fields: "id, market, outcome, size, avg_price, current_price, cash_pnl, percent_pnl, polymarket_url, icon",
  },
  {
    method: "GET",
    path: "/api/trader/{wallet}/trades",
    description: "Recent Polymarket trades for a tracked trader.",
    params: "limit=1-500, offset",
    tryUrl: "/api/trader/0x5a218c7ad04135830a45c41aaed7294df7809318/trades",
    fields: "id, time, market, type, outcome, price, shares_amount, total_formatted, polymarket_url",
  },
  {
    method: "GET",
    path: "/api/kalshi/{username}/history",
    description: "All-time P&L history for a Kalshi trader, from our snapshots.",
    tryUrl: "/api/kalshi/ProbabilityDuck/history",
    fields: "history: [{ timestamp, pnl, date }], dataPoints, firstDate, lastDate",
  },
  {
    method: "GET",
    path: "/api/kalshi/{username}/categories",
    description: "A Kalshi trader's all-time P&L and markets traded by category.",
    tryUrl: "/api/kalshi/ProbabilityDuck/categories",
    fields: "categories: [{ category, pnl, markets }]",
  },
  {
    method: "GET",
    path: "/api/p/overview",
    description: "Open Polymarket positions across top traders, with each trader's score.",
    tryUrl: "/api/p/overview",
    fields: "positions: [{ trader, score, market, outcome, size, value, pnl }]",
  },
  {
    method: "GET",
    path: "/api/m/insights",
    description: "Markets top traders are trading most, with buy/sell and yes/no flow.",
    params: "period=1h|6h|24h|3d|1w, limit=1-200",
    tryUrl: "/api/m/insights?period=24h",
    fields: "insights: [{ market, volume, buy_ratio, yes_ratio, top_traders }]",
  },
  {
    method: "GET",
    path: "/api/daily-profit",
    description: "Combined profit of all tracked traders today.",
    tryUrl: "/api/daily-profit",
    fields: "daily_profit, raw, traders_count",
  },
  {
    method: "GET",
    path: "/api/kalshi-avatar/{username}",
    description: "A Kalshi trader's profile picture (128px WebP).",
    tryUrl: "/api/kalshi-avatar/ProbabilityDuck",
    fields: "Image/WebP binary stream",
  },
  {
    method: "GET",
    path: "/api/og/calendar/{wallet-or-kalshi-username}",
    description: "Shareable month card (1080x1350): daily P&L tiles, win/loss record and monthly profit.",
    params: "month=YYYY-MM (default: current month)",
    tryUrl: "/api/og/calendar/ProbabilityDuck",
    fields: "Image/PNG binary stream",
  },
  {
    method: "GET",
    path: "/api/og/trader/{wallet-or-kalshi-username}",
    description: "Shareable 1200x630 P&L card image for a trader.",
    tryUrl: "/api/og/trader/0x5a218c7ad04135830a45c41aaed7294df7809318",
    fields: "Image/PNG binary stream",
  },
];

const jsSnippet = `// Top 10 Kalshi traders this month
const res = await fetch("https://predicting.top/api/kalshi-leaderboard?period=30d&limit=10");
const { traders } = await res.json();

traders.forEach(t => console.log(t.rank, t.name, t.pnl));`;

export function ApiDocsView() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground">
          Public API
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Free, read-only JSON for prediction market traders on Polymarket and Kalshi. No API key needed, and it works from the browser (CORS enabled). Leaderboards update every few minutes.
        </p>
        <p className="text-xs text-muted-foreground font-mono pt-1">
          Base URL: <span className="text-foreground font-semibold">https://predicting.top</span> · Please credit predicting.top and link back when you display the data.
        </p>
      </div>

      {/* Quickstart Example Card */}
      <div className="space-y-2">
        <h2 className="text-xs sm:text-sm font-semibold text-foreground">
          Example
        </h2>
        <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 text-xs text-muted-foreground bg-muted/20">
            <span className="font-medium">JavaScript</span>
            <button
              type="button"
              onClick={() => copyToClipboard(jsSnippet, "snippet")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
            >
              {copiedKey === "snippet" ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
            <code>{jsSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-semibold text-foreground pt-2">
          Endpoints
        </h2>

        <div className="space-y-3">
          {endpoints.map((ep, idx) => {
            const copyText = `https://predicting.top${ep.tryUrl}`;
            const key = `ep-${idx}`;

            return (
              <div
                key={ep.path}
                className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-2.5 transition-colors hover:border-border"
              >
                {/* Method & Path Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
                    <span className="font-bold text-emerald-500">{ep.method}</span>
                    <span className="font-semibold text-foreground">{ep.path}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(copyText, key)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded border border-border/60 bg-muted/20 cursor-pointer"
                  >
                    {copiedKey === key ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-normal">
                  {ep.description}
                </p>

                {/* Parameters */}
                {ep.params && (
                  <div className="text-xs font-mono text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Params: </span>
                    <span>{ep.params}</span>
                  </div>
                )}

                {/* Try URL */}
                <div className="text-xs font-mono">
                  <span className="font-semibold text-foreground/80">Try: </span>
                  <a
                    href={`https://predicting.top${ep.tryUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {ep.tryUrl}
                  </a>
                </div>

                {/* Returned Fields */}
                {ep.fields && (
                  <div className="text-xs font-mono text-muted-foreground/80 pt-0.5">
                    <span className="font-semibold text-foreground/80">Fields: </span>
                    <span>{ep.fields}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

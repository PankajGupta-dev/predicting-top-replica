# Data Availability Matrix: Predicting.top

This document maps every application feature on predicting.top to its backing API endpoint, identifies available and missing fields, and outlines strict fallback strategies in accordance with project data integrity rules.

---

## 1. Feature Availability Matrix

| Feature | Route | Upstream Endpoint | Available Fields | Missing Fields | Fallback Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cross-Platform Leaderboard** | `/` | `GET /api/leaderboard?period={period}` | `rank`, `name`, `wallet`, `twitter`, `pfp`, `platform`, `stats.pnl`, `allTimePnl`, `smart_score`, `sports_share`, `esports_share`, `roi`, `join_date` | None | Fully backed by original API. |
| **Period Filtering** (`1D`, `7D`, `30D`, `90D`, `YTD`, `ALL`) | `/`, `/polymarket` | `GET /api/leaderboard?period={period}` | Period query parameter directly supported upstream | None | Re-fetch with parameter or slice client memory dataset. |
| **Platform Filtering** (Polymarket, Kalshi, Hyperliquid, Opinion) | `/` | `GET /api/leaderboard` | `platform` (`"polymarket"`, `"kalshi"`, `"hyperliquid"`, `"opinion"`) | None | In-memory client filter (`trader.platform === filter`). |
| **Attribute Filtering** (`𝕏 linked`, `No sports`, `No esports`, `$5+`) | `/`, `/polymarket` | `GET /api/leaderboard` | `twitter` (null check), `sports_share` (< 0.5), `esports_share` (< 0.5), `stats.pnl` (> $5) | None | In-memory client filter. |
| **Metric Sorting** (`Sharpe`, `Win%`, `ROI`) | `/`, `/polymarket` | `GET /api/leaderboard` | `smart_score.sharpeRatio`, `smart_score.winRate`, `roi` | Traders with `smart_score: null` | Unscored traders sort to the bottom with dash `–` indicator. |
| **Daily Profit Badge** (`Today: +$XXX`) | `/`, `/polymarket` | `GET /api/daily-profit` | `daily_profit`, `raw`, `traders_count` | None | Fully backed by original API. |
| **Kalshi Leaderboard** | `/kalshi` | `GET /api/kalshi-leaderboard?period={period}&limit={limit}` | `rank`, `kalshi_username`, `name`, `pfp`, `profile_path`, `pnl`, `sports_share`, `last_synced_at` | `smart_score`, `joined_date` | Kalshi table design intentionally omits these columns. |
| **Kalshi Progressive Load** ("Show more") | `/kalshi` | `GET /api/kalshi-leaderboard` | Upstream returns top 1,000 records; `limit` parameter supported | None | Fetch top 1,000 on load; render initial 100 and slice 100 more per click. |
| **Trader Profile Header** | `/account/:id` | `GET /api/trader/{id}` | `name`, `wallet`, `twitter`, `pfp`, `platform`, `usdc_balance`, `portfolio_value`, `views`, `join_date`, `smart_score`, `stats` | `usdc_balance` is null for Kalshi users | Conditionally hide balance block for Kalshi profiles. |
| **Monthly Performance Summary** | `/account/:id` | `GET /api/trader/{id}` | `stats.1d.pnl`, `stats.7d.pnl`, `stats.30d.pnl`, `stats.all.pnl` | Historical daily win/loss records for arbitrary past years | Display current month stats from profile; date chevrons query month OG card. |
| **Kalshi P&L History Chart** | `/account/:id` (Kalshi) | `GET /api/kalshi/{username}/history` | `history` array with 2,000+ points (`timestamp`, `pnl`, `date`) | None for Kalshi | Direct SVG line chart rendering. |
| **Polymarket P&L History Chart** | `/account/:id` (Poly) | `GET /api/trader/{wallet}/trades` + `/api/og/calendar` | Trade timestamps and P&L; 30d/all-time stats from `/api/trader` | Polymarket lacks dedicated `/api/polymarket/{wallet}/history` | Derive cumulative equity curve from trades and period milestones. |
| **Kalshi Category Breakdown** | `/account/:id` (Kalshi) | `GET /api/kalshi/{username}/categories` | Array of `{ category, pnl, markets }` | None | Horizontal bar distribution component. |
| **Polymarket Open Positions** | `/account/:id` (Poly) | `GET /api/trader/{wallet}/positions` | `id`, `market`, `outcome`, `size`, `avg_price`, `current_price`, `cash_pnl`, `percent_pnl` | Not available for Kalshi (returns 400) | Conditionally render positions table only on Polymarket profiles. |
| **Polymarket Trade History** | `/account/:id` (Poly) | `GET /api/trader/{wallet}/trades` | `id`, `time`, `market`, `type`, `amount`, `pnl`, `transaction_hash`, `outcome`, `price` | Not available for Kalshi (returns 400) | Conditionally render trades table only on Polymarket profiles. |
| **Battle of the Badges** | `/battle` | `GET /api/kalshi/PredMTrader/history` + Contender data | Historical curve for Kalshi trader; featured profile metrics | Dynamic arbitrary trader comparator selector is absent upstream | Faithfully recreate featured `@25usdc` vs `@PredMTrader` matchup. |
| **Shareable Social Cards** | `/account/:id` | `GET /api/og/calendar/{id}`, `GET /api/og/trader/{id}` | High-res PNG image rendered by upstream server | None | Embed upstream OG image or render equivalent client Canvas card. |
| **API Documentation & Quickstart** | `/api-docs` | Static documentation + Live sample requests | JavaScript code samples, endpoint specifications, try links | None | Fully supported. |

---

## 2. Features Feasible Entirely via Original API (100% Native)

1. **Combined Leaderboard**: Fully supported by `/api/leaderboard`.
2. **Polymarket Leaderboard**: Fully supported by `/api/leaderboard?period=all`.
3. **Kalshi Top 1,000 Leaderboard**: Fully supported by `/api/kalshi-leaderboard`.
4. **Daily Profit Counter**: Fully supported by `/api/daily-profit`.
5. **Kalshi Trader Profiles**: Fully supported by `/api/trader/{user}`, `/api/kalshi/{user}/categories`, `/api/kalshi/{user}/history`.
6. **Polymarket Open Positions**: Fully supported by `/api/trader/{wallet}/positions`.
7. **Polymarket Trade Executions**: Fully supported by `/api/trader/{wallet}/trades`.
8. **Market Level Insights**: Fully supported by `/api/m/insights`.
9. **Developer API Documentation**: Fully supported.

---

## 3. Features Requiring Normalized / Derived Handling

1. **Polymarket Trader Equity Curve**:
   - Upstream provides `/api/kalshi/{username}/history` for Kalshi traders, but does not provide an equivalent `/api/polymarket/{wallet}/history` endpoint.
   - For Polymarket traders, predicting.top displays the cumulative equity curve derived from `/api/trader/{wallet}/trades` and period stats (`stats.1d`, `stats.7d`, `stats.30d`, `stats.all`), augmented by the pre-rendered social card from `/api/og/calendar/{wallet}`.
   - **Rule**: Do not invent fake random points. If trade history is insufficient to compute an intra-day curve, display the verified period milestone points (`1D`, `7D`, `30D`, `All-Time`).

2. **Kalshi Leaderboard Profile Linking**:
   - On `/api/kalshi-leaderboard`, certain traders have `profile_path: null` (e.g. `final.lamb3899`), and querying `/api/trader/final.lamb3899` returns HTTP 404.
   - **Rule**: On rows where `profile_path` is null or profile does not exist, clicking the row should open their official external profile (`kalshi_url`) rather than a broken internal `/account` link.

3. **Rate-Limit Throttling**:
   - The upstream API enforces 60-120 req/min. The replica architecture must cache all responses on the server side via Next.js ISR tags so that hundreds of visitors to the replica will never exhaust the upstream rate limit.


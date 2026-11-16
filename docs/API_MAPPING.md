# API Mapping & Data Schema: Predicting.top

This document specifies the complete public and internal API endpoints used by predicting.top, based on direct live probing and documentation analysis.

---

## 1. Global API Characteristics

- **Base URL**: `https://predicting.top`
- **Protocol**: HTTPS / REST
- **Authentication**: None required (open public read-only access)
- **CORS Headers**:
  - `access-control-allow-origin: *`
  - `access-control-allow-methods: GET, HEAD, OPTIONS`
  - `access-control-allow-headers: Content-Type`
  - `access-control-max-age: 86400`
- **Rate Limits**:
  - Standard Leaderboard / Data Endpoints: `120 requests / minute`
  - Trader Specific Endpoints: `60 requests / minute`
  - Kalshi History / Daily Profit: `100 requests / minute`
  - Exposed via headers: `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`

---

## 2. Endpoint Catalog

### 2.1 Daily Profit Aggregate
- **Endpoint**: `GET /api/daily-profit`
- **Description**: Returns the combined net profit of all tracked prediction market traders for the current 24-hour day.
- **Parameters**: None.
- **Rate Limit**: 100 req/min.
- **Response Schema**:
```json
{
  "daily_profit": "+$427,896",
  "raw": 427896,
  "traders_count": 797
}
```
- **UI Usage**: Displayed at top right of Home and Polymarket Leaderboard headers (`Today: +$XXX,XXX`).

---

### 2.2 Cross-Platform Leaderboard
- **Endpoint**: `GET /api/leaderboard`
- **Description**: Returns cross-platform trader rankings (Polymarket, Kalshi, Hyperliquid, Myriad, Opinion) ranked by P&L for a given time window.
- **Query Parameters**:
  - `period` (optional): `1d` | `7d` | `30d` | `90d` | `ytd` | `all` (default: `all`)
- **Rate Limit**: 120 req/min.
- **Response Schema**:
```typescript
interface LeaderboardResponse {
  traders: TraderSummary[];
  lastUpdated: string; // ISO 8601 timestamp
}

interface TraderSummary {
  rank: number;
  name: string;
  wallet: string | null;
  additional_wallets: string[];
  wallet_count: number;
  twitter: string | null;
  pfp: string | null;
  polynoob_story: string;
  polymarket_profile: string | null;
  platform: "polymarket" | "kalshi" | "hyperliquid" | "myriad" | "opinion";
  kalshi_profile: string | null;
  kalshi_username: string | null;
  myriad_profile: string | null;
  myriad_username: string | null;
  opinion_wallet: string | null;
  opinion_profile: string | null;
  stats: {
    pnl: number;
    volume: number;
    trades_count: number;
    win_rate?: number;
    sharpe_ratio?: number;
    max_drawdown?: number;
    profit_factor?: number;
  };
  allTimePnl: number;
  join_date: string;
  smart_score: number | null;
  affiliated: boolean;
  sports_share: number;
  esports_share: number;
}
```
- **UI Usage**: Powers `/` (Home Leaderboard) and `/polymarket`.

---

### 2.3 Kalshi Dedicated Leaderboard
- **Endpoint**: `GET /api/kalshi-leaderboard`
- **Description**: Returns top 1,000 Kalshi traders tracked over time.
- **Query Parameters**:
  - `period` (optional): `1d` | `7d` | `30d` | `all` (default: `all`)
  - `limit` (optional): Integer `1` to `2000` (default: `1000`)
- **Rate Limit**: 120 req/min.
- **Response Schema**:
```typescript
interface KalshiLeaderboardResponse {
  period: string;
  total: number;
  tracked: number;
  lastUpdated: string;
  traders: KalshiTraderSummary[];
}

interface KalshiTraderSummary {
  rank: number;
  kalshi_username: string;
  name: string;
  pfp: string;
  profile_path: string | null;
  kalshi_url: string;
  pnl: number;
  pnl_all: number;
  tracked: boolean;
  sports_share: number;
  x_handle: string | null;
  last_synced_at: string;
}
```
- **UI Usage**: Powers `/kalshi` table and "Show more" progressive loading.

---

### 2.4 Single Trader Profile
- **Endpoint**: `GET /api/trader/{wallet-or-kalshi-username}`
- **Description**: Returns detailed identity, portfolio, balances, and multi-period stats for an individual trader.
- **Path Parameter**: EVM address (e.g. `0x5a218...`) or Kalshi handle (e.g. `ProbabilityDuck`).
- **Rate Limit**: 60 req/min.
- **Response Schema**:
```typescript
interface TraderProfileResponse {
  trader: {
    name: string;
    wallet: string | null;
    additional_wallets: string[];
    wallet_count: number;
    twitter: string | null;
    pfp: string | null;
    polynoob_story: string;
    polymarket_profile: string | null;
    platform: string;
    kalshi_profile: string | null;
    kalshi_username: string | null;
    myriad_profile: string | null;
    myriad_username: string | null;
    opinion_wallet: string | null;
    opinion_profile: string | null;
    usdc_balance: number | null;
    portfolio_value: number | null;
    stats: {
      pnl_1d: number;
      pnl_7d: number;
      pnl_30d: number;
      pnl_all: number;
      volume_all: number;
      trades_all: number;
      win_rate: number;
      sharpe_ratio: number;
      profit_factor: number;
      daily_streak?: number[];
    };
    views: number;
    largest_win: number | null;
    join_date: string;
    smart_score: number | null;
  };
}
```
- **UI Usage**: Powers the top identity banner and stat boxes on `/account/:id`.

---

### 2.5 Trader Open Positions (Polymarket)
- **Endpoint**: `GET /api/trader/{wallet}/positions`
- **Description**: Returns live open prediction market positions for a tracked trader, ordered by position value descending.
- **Query Parameters**:
  - `limit` (optional): Integer `1` to `500` (default: `100`)
  - `offset` (optional): Pagination offset
  - `sizeThreshold` (optional): Minimum dollar size filter
- **Rate Limit**: 120 req/min.
- **Response Schema**:
```typescript
interface TraderPositionsResponse {
  positions: Array<{
    id: string;
    market: string;
    outcome: string; // "Yes" | "No"
    outcome_short: string; // "Y" | "N"
    size: number;
    size_formatted: string;
    avg_price: number;
    avg_price_formatted: string;
    current_price: number;
    cash_pnl: number;
    percent_pnl: number;
    pnl_formatted: string;
    cash_pnl_formatted: string;
    initial_value: number;
    current_value: number;
    current_value_formatted: string;
    redeemable: boolean;
    slug: string;
    event_slug: string;
    polymarket_url: string;
    icon: string;
    end_date: string;
  }>;
}
```

---

### 2.6 Trader Trade History (Polymarket)
- **Endpoint**: `GET /api/trader/{wallet}/trades`
- **Description**: Returns historical trade execution records for a tracked trader.
- **Query Parameters**: `limit` (1–500), `offset`.
- **Response Schema**:
```typescript
interface TraderTradesResponse {
  trades: Array<{
    id: string;
    time: string; // e.g. "3m ago"
    market: string;
    type: "buy" | "sell";
    amount: number;
    pnl: number;
    transaction_hash: string;
    outcome: string;
    price: number;
    shares_amount: number;
    total_formatted: string;
    polymarket_url: string;
    icon: string;
  }>;
}
```

---

### 2.7 Kalshi Trader P&L History Snapshots
- **Endpoint**: `GET /api/kalshi/{username}/history`
- **Description**: Time-series history of cumulative P&L for a Kalshi trader.
- **Rate Limit**: 100 req/min.
- **Response Schema**:
```typescript
interface KalshiHistoryResponse {
  history: Array<{
    timestamp: number; // Unix epoch ms
    pnl: number;
    date: string; // ISO 8601
  }>;
  dataPoints: number;
  firstDate: string;
  lastDate: string;
}
```
- **UI Usage**: Powers the P&L chart on Kalshi trader profiles and `/battle`.

---

### 2.8 Kalshi Category Breakdown
- **Endpoint**: `GET /api/kalshi/{username}/categories`
- **Description**: Aggregated all-time P&L and market participation grouped by Kalshi category.
- **Response Schema**:
```typescript
interface KalshiCategoriesResponse {
  categories: Array<{
    category: string; // "Mentions" | "Elections" | "Politics" | "Sports" | etc.
    pnl: number;
    markets: number;
  }>;
}
```
- **UI Usage**: Powers the "P&L by Category" horizontal bar chart on Kalshi profile pages.

---

### 2.9 Market Level Insights & Flow
- **Endpoint**: `GET /api/m/insights`
- **Description**: Prediction markets top traders are trading most, with net inflow and directional volumes.
- **Query Parameters**:
  - `period`: `1h` | `6h` | `24h` | `3d` | `1w` (default: `24h`)
  - `limit`: `1` to `200` (default: `50`)
- **Response Schema**:
```typescript
interface MarketInsightsResponse {
  markets: Array<{
    market: string;
    totalVolume: number;
    buyVolume: number;
    sellVolume: number;
    yesVolume: number;
    noVolume: number;
    netInflow: number;
    tradeCount: number;
    uniqueTraders: number;
    icon: string;
    polymarket_url: string;
    eventSlug: string;
    topTraders: string[];
    endDate: string;
    yesPrice: number;
    noPrice: number;
  }>;
}
```

---

### 2.10 Image & OpenGraph Generation Endpoints
- `GET /api/kalshi-avatar/{username}`: Direct proxy for Kalshi WebP avatar image.
- `GET /api/og/calendar/{wallet-or-kalshi-username}?month=YYYY-MM`: Generates 1080x1350 shareable monthly performance card PNG.
- `GET /api/og/trader/{wallet-or-kalshi-username}`: Generates 1200x630 social card PNG.


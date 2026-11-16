# Data Dictionary & Type Definitions: Predicting.top

This document defines the canonical TypeScript interfaces, data models, field descriptions, nullability constraints, and domain types derived from verified live API responses of predicting.top.

---

## 1. Domain Enums & Primitive Types

```typescript
export type PlatformType = 
  | "polymarket" 
  | "kalshi" 
  | "hyperliquid" 
  | "myriad" 
  | "opinion";

export type PeriodType = 
  | "1d" 
  | "7d" 
  | "30d" 
  | "90d" 
  | "ytd" 
  | "all";

export type SmartScoreTier = 
  | "Elite" 
  | "Good" 
  | "Average" 
  | "Poor";

export type TradeType = 
  | "buy" 
  | "sell";

export type MarketOutcome = 
  | "Yes" 
  | "No";
```

---

## 2. API Response Interfaces

### 2.1 Daily Profit Aggregate
```typescript
/**
 * Combined profit across all tracked traders today.
 * Endpoint: GET /api/daily-profit
 */
export interface DailyProfit {
  /** Formatted dollar string with sign, e.g. "+$434,523" */
  daily_profit: string;
  /** Raw integer dollar profit amount, e.g. 434523 */
  raw: number;
  /** Total count of active traders contributing to the figure, e.g. 797 */
  traders_count: number;
}
```

---

### 2.2 Leaderboard Entry & Response
```typescript
/**
 * Statistical scores calculating consistency, return, accuracy, and risk.
 */
export interface SmartScore {
  tier: SmartScoreTier;
  /** Algorithmic score between 0.0 and 100.0, e.g. 58.5 */
  score: number;
  /** Win rate ratio between 0.0 and 1.0, e.g. 0.648 (64.8%) */
  winRate: number;
  /** Annualized or sample Sharpe Ratio, e.g. 0.95 */
  sharpeRatio: number;
  /** Maximum drawdown ratio, e.g. 1.0 */
  maxDrawdownPercent: number;
  /** Gross profits / Gross losses, e.g. 1.91 */
  profitFactor: number;
  /** Goodness of fit regression metric, e.g. 0.6476 */
  rSquared: number;
}

/**
 * Single trader entry returned in the cross-platform leaderboard.
 * Endpoint: GET /api/leaderboard?period={period}
 */
export interface LeaderboardEntry {
  /** Numeric rank for the active period (1-based index) */
  rank: number;
  /** Trader display name or handle */
  name: string;
  /** Primary EVM wallet address (present for Polymarket, null for pure Kalshi) */
  wallet: string | null;
  /** List of linked secondary EVM wallet addresses */
  additional_wallets: string[];
  /** Total count of associated wallet addresses */
  wallet_count: number;
  /** Full URL to trader's X (Twitter) profile, or empty string */
  twitter: string;
  /** URL to avatar picture */
  pfp: string;
  /** Bio or background story text */
  polynoob_story: string;
  /** Canonical URL to Polymarket profile, e.g. "https://polymarket.com/profile/0x..." */
  polymarket_profile: string | null;
  /** Exchange or protocol origin */
  platform: PlatformType;
  /** Kalshi profile URL or empty string */
  kalshi_profile: string;
  /** Kalshi username handle (e.g. "ProbabilityDuck"), or null */
  kalshi_username: string | null;
  /** Myriad market profile URL or empty string */
  myriad_profile: string;
  /** Myriad username handle (typically null) */
  myriad_username: string | null;
  /** Opinion wallet address or null */
  opinion_wallet: string | null;
  /** Opinion profile URL or empty string */
  opinion_profile: string;
  /** Hyperliquid explorer URL */
  hyperliquid_profile: string;
  /** Net P&L in USD for the query period, e.g. 14928426.80 */
  allTimePnl: number;
  /** Date the trader joined the platform, format YYYY-MM-DD or null */
  join_date: string | null;
  /** Multi-factor smart score evaluation, or null if insufficient history */
  smart_score: SmartScore | null;
  /** Return on Investment percentage float (e.g. 0.0179 = 1.79%) */
  roi: number;
  /** Whether the trader has a verified affiliate status */
  affiliated: boolean;
  /** Ratio of trading volume in sports prediction markets (0.0 to 1.0) */
  sports_share: number;
  /** Ratio of trading volume in esports prediction markets (0.0 to 1.0) */
  esports_share: number;
  /** Period trading volume and counts */
  stats: {
    pnl: number;
    buys: number;
    sells: number;
  };
}

export interface LeaderboardResponse {
  traders: LeaderboardEntry[];
  lastUpdated: string;
}
```

---

### 2.3 Kalshi Dedicated Leaderboard
```typescript
/**
 * Single trader entry returned in the Kalshi-specific top 1,000 leaderboard.
 * Endpoint: GET /api/kalshi-leaderboard
 */
export interface KalshiLeaderboardEntry {
  /** Numeric rank (1-1000) */
  rank: number;
  /** Kalshi username handle, e.g. "final.lamb3899" */
  kalshi_username: string;
  /** Display name on Kalshi */
  name: string;
  /** Local avatar proxy path or external URL, e.g. "/api/kalshi-avatar/final.lamb3899" */
  pfp: string;
  /** Internal predicting.top profile link (e.g. "/account/dogname") or null */
  profile_path: string | null;
  /** Official Kalshi profile URL, e.g. "https://kalshi.com/ideas/profiles/..." */
  kalshi_url: string;
  /** Period profit/loss in USD float */
  pnl: number;
  /** All-time profit/loss in USD float */
  pnl_all: number;
  /** Tracking status flag (always true for listed traders) */
  tracked: boolean;
  /** Sports betting volume ratio (0.0 to 1.0) */
  sports_share: number;
  /** Associated Twitter handle, or null */
  x_handle: string | null;
  /** Timestamp when this trader's stats were last scraped from Kalshi */
  last_synced_at: string;
}

export interface KalshiLeaderboardResponse {
  period: string;
  total: number;
  tracked: number;
  lastUpdated: string;
  traders: KalshiLeaderboardEntry[];
}
```

---

### 2.4 Trader Profile & Period Statistics
```typescript
export interface PeriodPnlStats {
  pnl: number;
  buys: number;
  sells: number;
}

export interface TraderStatistics {
  "1d": PeriodPnlStats;
  "7d": PeriodPnlStats;
  "30d": PeriodPnlStats;
  "all": PeriodPnlStats;
}

/**
 * Detailed profile entity for an individual trader.
 * Endpoint: GET /api/trader/{wallet-or-kalshi-username}
 */
export interface TraderProfile {
  name: string;
  wallet: string | null;
  additional_wallets: string[];
  wallet_count: number;
  twitter: string;
  pfp: string;
  polynoob_story: string;
  polymarket_profile: string | null;
  platform: PlatformType;
  kalshi_profile: string;
  kalshi_username: string | null;
  myriad_profile: string;
  myriad_username: string | null;
  opinion_wallet: string | null;
  opinion_profile: string;
  /** USDC liquid cash balance (Polymarket EVM traders only, null for Kalshi) */
  usdc_balance: number | null;
  /** Total portfolio asset valuation in USD */
  portfolio_value: number | null;
  /** Multi-period P&L breakdown ("1d", "7d", "30d", "all") */
  stats: TraderStatistics;
  /** Profile page view counter on predicting.top */
  views: number;
  /** Dollar size of largest single winning trade */
  largest_win: string | null;
  /** ISO 8601 registration timestamp */
  join_date: string;
  /** Verified Smart Score metrics */
  smart_score: SmartScore | null;
}

export interface TraderProfileResponse {
  trader: TraderProfile;
}
```

---

### 2.5 Open Position & Trades (Polymarket)
```typescript
/**
 * Active open market position for a Polymarket wallet.
 * Endpoint: GET /api/trader/{wallet}/positions
 */
export interface OpenPosition {
  id: string;
  market: string;
  outcome: MarketOutcome;
  outcome_short: "Y" | "N";
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
}

export interface PositionsResponse {
  positions: OpenPosition[];
}

/**
 * Executed market transaction record.
 * Endpoint: GET /api/trader/{wallet}/trades
 */
export interface Trade {
  id: string;
  time: string; // e.g. "2m ago", "1h ago"
  market: string;
  type: TradeType;
  type_short: "B" | "S";
  amount: number;
  pnl: number;
  transaction_hash: string;
  outcome: MarketOutcome;
  outcome_short: "Y" | "N";
  price: number;
  shares_amount: number;
  total_formatted: string;
  slug: string;
  event_slug: string;
  polymarket_url: string;
  icon: string;
}

export interface TradesResponse {
  trades: Trade[];
}
```

---

### 2.6 Historical Performance & Category Breakdown
```typescript
/**
 * Single historical equity curve snapshot.
 * Endpoint: GET /api/kalshi/{username}/history
 */
export interface ProfitHistoryPoint {
  timestamp: number; // Unix epoch milliseconds
  pnl: number; // Cumulative P&L at snapshot
  date: string; // ISO 8601 timestamp
}

export interface KalshiHistoryResponse {
  history: ProfitHistoryPoint[];
  dataPoints: number;
  firstDate: string;
  lastDate: string;
}

/**
 * Aggregated P&L and volume by Kalshi market category.
 * Endpoint: GET /api/kalshi/{username}/categories
 */
export interface CategoryPerformance {
  category: string; // "Mentions" | "Elections" | "Politics" | "Sports" | etc.
  pnl: number;
  markets: number;
}

export interface KalshiCategoriesResponse {
  categories: CategoryPerformance[];
}
```

---

### 2.7 Market Insights
```typescript
export interface MarketInsight {
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
  topTraders: Array<{ name: string; wallet: string }>;
  endDate: string;
  yesPrice: number | null;
  noPrice: number | null;
}

export interface MarketInsightsResponse {
  markets: MarketInsight[];
}
```

---

### 2.8 Error Response
```typescript
/**
 * Standard error shape returned by upstream on 400, 404, or 429.
 */
export interface APIError {
  message: string;
  statusCode?: number;
}
```


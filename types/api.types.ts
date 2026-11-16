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

export interface SmartScore {
  tier: SmartScoreTier;
  score: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdownPercent: number;
  profitFactor: number;
  rSquared: number;
}

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

export interface LeaderboardEntry {
  rank: number;
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
  hyperliquid_profile: string;
  allTimePnl: number;
  join_date: string | null;
  smart_score: SmartScore | null;
  roi: number;
  affiliated: boolean;
  sports_share: number;
  esports_share: number;
  day_mover?: {
    label: string;
    change: number;
  } | null;
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

export interface KalshiLeaderboardEntry {
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

export interface KalshiLeaderboardResponse {
  period: string;
  total: number;
  tracked: number;
  lastUpdated: string;
  traders: KalshiLeaderboardEntry[];
}

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
  usdc_balance: number | null;
  portfolio_value: number | null;
  stats: TraderStatistics;
  views: number;
  largest_win: string | null;
  join_date: string;
  smart_score: SmartScore | null;
}

export interface TraderProfileResponse {
  trader: TraderProfile;
}

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

export interface Trade {
  id: string;
  time: string;
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

export interface ProfitHistoryPoint {
  timestamp: number;
  pnl: number;
  date: string;
}

export interface KalshiHistoryResponse {
  history: ProfitHistoryPoint[];
  dataPoints: number;
  firstDate: string;
  lastDate: string;
}

export interface CategoryPerformance {
  category: string;
  pnl: number;
  markets: number;
}

export interface KalshiCategoriesResponse {
  categories: CategoryPerformance[];
}

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

export interface DailyProfit {
  daily_profit: string;
  raw: number;
  traders_count: number;
}

export interface APIError {
  message: string;
  statusCode?: number;
}


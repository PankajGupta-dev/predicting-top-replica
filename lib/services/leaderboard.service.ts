import { fetchAPI } from "@/lib/api/client";
import type {
  DailyProfit,
  KalshiLeaderboardResponse,
  LeaderboardResponse,
  PeriodType,
} from "@/types/api.types";

/**
 * Service for fetching cross-platform and Kalshi leaderboards.
 */
export async function getLeaderboard(period: PeriodType | string = "all"): Promise<LeaderboardResponse> {
  return fetchAPI<LeaderboardResponse>("/api/leaderboard", {
    params: { period },
    revalidate: 60, // 1 minute ISR cache
    tags: ["leaderboard", `leaderboard-${period}`],
  });
}

export async function getKalshiLeaderboard(
  period: PeriodType | string = "all",
  limit: number = 1000
): Promise<KalshiLeaderboardResponse> {
  return fetchAPI<KalshiLeaderboardResponse>("/api/kalshi-leaderboard", {
    params: { period, limit },
    revalidate: 60,
    tags: ["kalshi-leaderboard", `kalshi-${period}`],
  });
}

export async function getDailyProfit(): Promise<DailyProfit> {
  return fetchAPI<DailyProfit>("/api/daily-profit", {
    revalidate: 60,
    tags: ["daily-profit"],
  });
}


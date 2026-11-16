import { fetchAPI } from "@/lib/api/client";
import type { MarketInsight, MarketInsightsResponse } from "@/types/api.types";

/**
 * Service for fetching market-level trade insights and flow.
 */
export async function getMarketInsights(
  period: string = "24h",
  limit: number = 50
): Promise<MarketInsight[]> {
  const res = await fetchAPI<MarketInsightsResponse>("/api/m/insights", {
    params: { period, limit },
    revalidate: 60,
    tags: ["insights", `insights-${period}`],
  });
  return res.markets || [];
}


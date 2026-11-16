import { fetchAPI, PredictingAPIError } from "@/lib/api/client";
import type {
  CategoryPerformance,
  KalshiCategoriesResponse,
  KalshiHistoryResponse,
  OpenPosition,
  PositionsResponse,
  ProfitHistoryPoint,
  Trade,
  TraderProfile,
  TraderProfileResponse,
  TradesResponse,
} from "@/types/api.types";

/**
 * Service for fetching single trader profiles, positions, trades, and history.
 */

export async function getTraderProfile(id: string): Promise<TraderProfile | null> {
  try {
    const res = await fetchAPI<TraderProfileResponse>(`/api/trader/${encodeURIComponent(id)}`, {
      revalidate: 300, // 5 minute cache
      tags: ["trader", `trader-${id}`],
    });
    return res.trader;
  } catch (err) {
    if (err instanceof PredictingAPIError && err.statusCode === 404) {
      return null;
    }
    throw err;
  }
}

export async function getTraderPositions(wallet: string, limit: number = 100): Promise<OpenPosition[]> {
  try {
    const res = await fetchAPI<PositionsResponse>(`/api/trader/${encodeURIComponent(wallet)}/positions`, {
      params: { limit },
      revalidate: 60,
      tags: [`positions-${wallet}`],
    });
    return res.positions || [];
  } catch (err) {
    if (err instanceof PredictingAPIError && (err.statusCode === 400 || err.statusCode === 404)) {
      return [];
    }
    throw err;
  }
}

export async function getTraderTrades(wallet: string, limit: number = 100): Promise<Trade[]> {
  try {
    const res = await fetchAPI<TradesResponse>(`/api/trader/${encodeURIComponent(wallet)}/trades`, {
      params: { limit },
      revalidate: 60,
      tags: [`trades-${wallet}`],
    });
    return res.trades || [];
  } catch (err) {
    if (err instanceof PredictingAPIError && (err.statusCode === 400 || err.statusCode === 404)) {
      return [];
    }
    throw err;
  }
}

export async function getKalshiHistory(username: string): Promise<ProfitHistoryPoint[]> {
  try {
    const res = await fetchAPI<KalshiHistoryResponse>(`/api/kalshi/${encodeURIComponent(username)}/history`, {
      revalidate: 300,
      tags: [`kalshi-history-${username}`],
    });
    return res.history || [];
  } catch (err) {
    if (err instanceof PredictingAPIError && (err.statusCode === 404 || err.statusCode === 400)) {
      return [];
    }
    throw err;
  }
}

export async function getKalshiCategories(username: string): Promise<CategoryPerformance[]> {
  try {
    const res = await fetchAPI<KalshiCategoriesResponse>(`/api/kalshi/${encodeURIComponent(username)}/categories`, {
      revalidate: 300,
      tags: [`kalshi-categories-${username}`],
    });
    return res.categories || [];
  } catch (err) {
    if (err instanceof PredictingAPIError && (err.statusCode === 404 || err.statusCode === 400)) {
      return [];
    }
    throw err;
  }
}


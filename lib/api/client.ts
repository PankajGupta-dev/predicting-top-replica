import type { APIError } from "@/types/api.types";

const BASE_URL = process.env.UPSTREAM_API_BASE_URL || "https://predicting.top";

export interface RequestOptions extends Omit<RequestInit, "next"> {
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number | false;
  tags?: string[];
  timeoutMs?: number;
}

export interface RateLimitState {
  limit: number | null;
  remaining: number | null;
  resetAt: string | null;
}

export const rateLimitState: RateLimitState = {
  limit: null,
  remaining: null,
  resetAt: null,
};

export class PredictingAPIError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "PredictingAPIError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

export async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, revalidate = 60, tags, timeoutMs = 25000, headers, ...customInit } = options;

  let url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fetchInit: RequestInit = {
    ...customInit,
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ...headers,
    },
    signal: controller.signal,
  };

  if (revalidate !== undefined || tags !== undefined) {
    // Next.js custom fetch options
    (fetchInit as Record<string, unknown>).next = {
      revalidate,
      tags,
    };
  }

  try {
    const response = await fetch(url, fetchInit);

    // Update rate limit state from headers
    const limitHeader = response.headers.get("x-ratelimit-limit");
    const remainingHeader = response.headers.get("x-ratelimit-remaining");
    const resetHeader = response.headers.get("x-ratelimit-reset");

    if (limitHeader) rateLimitState.limit = parseInt(limitHeader, 10);
    if (remainingHeader) rateLimitState.remaining = parseInt(remainingHeader, 10);
    if (resetHeader) rateLimitState.resetAt = resetHeader;

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      let errorData: unknown = null;
      try {
        const jsonError = (await response.json()) as APIError;
        if (jsonError && jsonError.message) {
          errorMsg = jsonError.message;
        }
        errorData = jsonError;
      } catch {
        // Not a JSON error response
      }

      throw new PredictingAPIError(errorMsg, response.status, errorData);
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error: unknown) {
    if (error instanceof PredictingAPIError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new PredictingAPIError(`Request timed out after ${timeoutMs}ms for ${endpoint}`, 408);
    }
    throw new PredictingAPIError(
      error instanceof Error ? error.message : "Network error during API fetch",
      500,
      error
    );
  } finally {
    clearTimeout(timeoutId);
  }
}


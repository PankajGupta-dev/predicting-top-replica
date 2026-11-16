import type { SmartScoreTier } from "@/types/api.types";

/**
 * Returns Tailwind text color classes matching predicting.top Smart Score tiering.
 * - Score >= 70: Green (#22c55e)
 * - Score >= 40: Orange/Amber (#f97316)
 * - Score < 40: Red (#ef4444)
 * - Null / Unranked: Muted gray (–)
 */
export function getScoreColorClass(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) {
    return "text-muted-foreground";
  }
  if (score >= 70) {
    return "text-green-500 font-semibold";
  }
  if (score >= 40) {
    return "text-amber-500 font-semibold";
  }
  return "text-red-500 font-semibold";
}

export function getScoreTier(score: number | null | undefined): SmartScoreTier | null {
  if (score === null || score === undefined || isNaN(score)) {
    return null;
  }
  if (score >= 70) return "Elite";
  if (score >= 55) return "Good";
  if (score >= 40) return "Average";
  return "Poor";
}

/**
 * Returns Tailwind text color classes for profit/loss amounts.
 */
export function getPnlColorClass(pnl: number | null | undefined): string {
  if (pnl === null || pnl === undefined || isNaN(pnl)) {
    return "text-muted-foreground";
  }
  if (pnl > 0) {
    return "text-green-500";
  }
  if (pnl < 0) {
    return "text-red-500";
  }
  return "text-muted-foreground";
}


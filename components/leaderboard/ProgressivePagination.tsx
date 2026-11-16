import React from "react";

export interface ProgressivePaginationProps {
  remainingCount: number;
  onShowMore: () => void;
  isLoading?: boolean;
}

export function ProgressivePagination({
  remainingCount,
  onShowMore,
  isLoading = false,
}: ProgressivePaginationProps) {
  if (remainingCount <= 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 flex justify-center">
      <button
        type="button"
        onClick={onShowMore}
        disabled={isLoading}
        className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-medium text-foreground hover:text-foreground/80 border border-border/80 hover:border-border rounded-md bg-card/50 hover:bg-muted/40 transition-colors disabled:opacity-50 select-none cursor-pointer"
      >
        {isLoading ? "Loading..." : `Show more (${remainingCount.toLocaleString()} left)`}
      </button>
    </div>
  );
}


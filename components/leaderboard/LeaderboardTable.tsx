import React from "react";

export interface LeaderboardTableProps {
  children?: React.ReactNode;
  isKalshiTable?: boolean;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function LeaderboardTable({
  children,
  isKalshiTable = false,
  sortBy = "pnl",
  sortDirection = "desc",
  onSort,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No traders found matching your criteria",
}: LeaderboardTableProps) {
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return null;
    return (
      <span className="ml-1 inline-block text-[10px]">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-10 border-b border-border text-xs sm:text-sm font-medium text-foreground select-none">
              {/* Rank Header */}
              <th
                onClick={() => onSort?.("rank")}
                className="w-12 sm:w-14 pl-3 pr-2 text-left cursor-pointer hover:text-primary transition-colors font-semibold"
              >
                # {renderSortIndicator("rank")}
              </th>

              {/* Avatar Header (Empty) */}
              <th className="w-10 sm:w-12 px-1 text-center font-normal" />

              {/* Trader Header */}
              <th className="px-2 py-2 text-left font-semibold">
                Trader
              </th>

              {/* Joined Header (Home/Polymarket only, hidden on mobile) */}
              {!isKalshiTable && (
                <th className="hidden md:table-cell w-16 px-2 text-left font-semibold">
                  Joined
                </th>
              )}

              {/* Score Header (Home/Polymarket only) */}
              {!isKalshiTable && (
                <th
                  onClick={() => onSort?.("score")}
                  className="w-20 px-2 text-center cursor-pointer hover:text-primary transition-colors font-semibold"
                >
                  Score {renderSortIndicator("score")}
                </th>
              )}

              {/* P&L Header */}
              <th
                onClick={() => onSort?.("pnl")}
                className="w-36 sm:w-56 pr-3 pl-2 text-right cursor-pointer hover:text-primary transition-colors font-semibold"
              >
                P&amp;L {renderSortIndicator("pnl")}
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 12 }).map((_, i) => (
                <tr
                  key={`skeleton-${i}`}
                  className={`border-b border-border/30 animate-pulse ${
                    isKalshiTable ? "h-[49px]" : "h-[57px]"
                  }`}
                >
                  <td className="pl-3 pr-2">
                    <div className="h-3 w-4 bg-muted/60 rounded" />
                  </td>
                  <td className="px-1 text-center">
                    <div className="w-8 h-8 rounded-full bg-muted/60 mx-auto" />
                  </td>
                  <td className="px-2">
                    <div className="h-4 w-32 bg-muted/60 rounded mb-1" />
                  </td>
                  {!isKalshiTable && (
                    <td className="hidden md:table-cell px-2">
                      <div className="h-3 w-10 bg-muted/60 rounded" />
                    </td>
                  )}
                  {!isKalshiTable && (
                    <td className="px-2 text-center">
                      <div className="h-4 w-8 bg-muted/60 rounded mx-auto" />
                    </td>
                  )}
                  <td className="pr-3 pl-2 text-right">
                    <div className="h-4 w-20 bg-muted/60 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : isEmpty ? (
              // Empty State Row
              <tr>
                <td
                  colSpan={isKalshiTable ? 4 : 6}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


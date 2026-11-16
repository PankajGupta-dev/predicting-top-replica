import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatUSD, formatDaysJoined } from "@/lib/normalizers/formatters";
import { getScoreColorClass, getPnlColorClass } from "@/lib/normalizers/color-tier";
import { PolymarketIcon, KalshiIcon, XIcon } from "@/components/ui/PlatformIcons";
import type { PlatformType } from "@/types/api.types";

export interface LeaderboardRowProps {
  rank: number;
  name: string;
  pfp?: string | null;
  wallet?: string | null;
  platform?: PlatformType | string;
  twitter?: string | null;
  joinDate?: string | null;
  score?: number | null;
  pnl: number;
  categoryTag?: string | null;
  kalshiUrl?: string | null;
  profilePath?: string | null;
  isKalshiTable?: boolean;
}

export function LeaderboardRow({
  rank,
  name,
  pfp,
  wallet,
  platform,
  twitter,
  joinDate,
  score,
  pnl,
  categoryTag,
  kalshiUrl,
  profilePath,
  isKalshiTable = false,
}: LeaderboardRowProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  // Navigate to internal profile or external Kalshi URL
  const handleRowClick = () => {
    if (isKalshiTable && !profilePath && kalshiUrl) {
      window.open(kalshiUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // Default internal profile route: wallet address preferred, or name / kalshi username
    const identifier = wallet || name;
    if (identifier) {
      router.push(`/account/${encodeURIComponent(identifier)}`);
    }
  };

  const handleTwitterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (twitter) {
      const cleanHandle = twitter.replace(/^@/, "");
      window.open(`https://twitter.com/${cleanHandle}`, "_blank", "noopener,noreferrer");
    }
  };

  const formattedPnl = formatUSD(pnl, { compact: false, showSign: true });
  const pnlColorClass = getPnlColorClass(pnl);
  const scoreColorClass = getScoreColorClass(score);
  const daysJoined = formatDaysJoined(joinDate);

  // Clean initials for avatar fallback
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <tr
      onClick={handleRowClick}
      className={`group border-b border-border/40 hover:bg-muted/40 transition-colors cursor-pointer select-none ${
        isKalshiTable ? "h-[49px]" : "h-[57px]"
      }`}
    >
      {/* Rank Column */}
      <td className="w-12 sm:w-14 pl-3 pr-2 text-left font-mono text-xs sm:text-sm text-muted-foreground group-hover:text-foreground">
        {rank}
      </td>

      {/* Avatar Column */}
      <td className="w-10 sm:w-12 px-1 text-center">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted/60 flex items-center justify-center shrink-0 border border-border/50">
          {pfp && !imgError ? (
            // Using standard img element for dynamic avatar URLs from diverse external CDNs
            // with reliable onError fallback
            <img
              src={pfp}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              {initial}
            </span>
          )}
        </div>
      </td>

      {/* Trader Name, Badges & Links */}
      <td className="px-2 py-1 text-left min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-medium text-xs sm:text-sm text-foreground truncate group-hover:underline">
            {name}
          </span>

          {/* Twitter Icon link */}
          {twitter && (
            <button
              type="button"
              onClick={handleTwitterClick}
              title={`@${twitter.replace(/^@/, "")} on X`}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors shrink-0"
            >
              <XIcon className="w-3 h-3" />
            </button>
          )}

          {/* Platform Icon Badge (on Combined/Cross-platform view) */}
          {!isKalshiTable && platform && (
            <span className="shrink-0" title={platform}>
              {platform === "polymarket" && <PolymarketIcon className="w-3.5 h-3.5" />}
              {platform === "kalshi" && <KalshiIcon className="w-3.5 h-3.5" />}
            </span>
          )}
        </div>
      </td>

      {/* Joined Column (Combined/Polymarket only, hidden on mobile) */}
      {!isKalshiTable && (
        <td className="hidden md:table-cell w-16 px-2 text-left text-xs sm:text-sm text-muted-foreground font-mono">
          {daysJoined}
        </td>
      )}

      {/* Score Column (Combined/Polymarket only) */}
      {!isKalshiTable && (
        <td className="w-20 px-2 text-center text-xs sm:text-sm tabular-nums">
          <span className={scoreColorClass}>
            {score !== null && score !== undefined && !isNaN(score) ? score.toFixed(1) : "–"}
          </span>
        </td>
      )}

      {/* P&L Column */}
      <td className="w-36 sm:w-56 pr-3 pl-2 text-right tabular-nums">
        <div className="flex flex-col items-end">
          <span className={`text-xs sm:text-sm font-semibold ${pnlColorClass}`}>
            {formattedPnl}
          </span>
          {categoryTag && (
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/80 font-normal">
              {categoryTag}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}


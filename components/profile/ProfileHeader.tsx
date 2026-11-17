import React, { useState } from "react";
import Link from "next/link";
import { PolymarketIcon, KalshiIcon, XIcon } from "@/components/ui/PlatformIcons";
import { truncateAddress } from "@/lib/normalizers/formatters";
import type { PlatformType } from "@/types/api.types";

interface ProfileHeaderProps {
  name: string;
  pfp?: string | null;
  wallet?: string | null;
  platform: PlatformType | string;
  twitter?: string | null;
  joinDate?: string | null;
  views?: number | null;
  polymarketProfile?: string | null;
  kalshiProfile?: string | null;
}

export function ProfileHeader({
  name,
  pfp,
  wallet,
  platform,
  twitter,
  joinDate,
  views,
  polymarketProfile,
  kalshiProfile,
}: ProfileHeaderProps) {
  const [imgError, setImgError] = useState(false);
  const isKalshi = platform === "kalshi";

  // Format joined date: e.g. "Joined Jan 2025"
  const formattedJoined = React.useMemo(() => {
    if (!joinDate) return null;
    try {
      const d = new Date(joinDate);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return null;
    }
  }, [joinDate]);

  // Initial for fallback
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Target platform URL
  const platformUrl = isKalshi
    ? kalshiProfile || `https://kalshi.com/ideas/profiles/${name}`
    : polymarketProfile || (wallet ? `https://polymarket.com/profile/${wallet}` : null);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 mb-6">
      {/* Main Profile Info Row */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Large Avatar (64px) */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-muted/60 flex items-center justify-center shrink-0 border border-border">
          {pfp && !imgError ? (
            <img
              src={pfp}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-muted-foreground uppercase">
              {initial}
            </span>
          )}
        </div>

        {/* Name, Badges & Links */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight leading-none">
              {name}
            </h1>

            {/* External Platform Profile Icon */}
            {platformUrl && (
              <a
                href={platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`View on ${isKalshi ? "Kalshi" : "Polymarket"}`}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {isKalshi ? (
                  <KalshiIcon className="w-4 h-4" />
                ) : (
                  <PolymarketIcon className="w-4 h-4" />
                )}
              </a>
            )}

            {/* External Twitter Link */}
            {twitter && (
              <a
                href={`https://x.com/${twitter.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`@${twitter.replace(/^@/, "")} on X`}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Badges & Joined Metadata */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-muted-foreground">
            {isKalshi ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                Kalshi
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-blue-600/20 text-blue-400 border border-blue-500/30">
                Polymarket
              </span>
            )}

            {formattedJoined && (
              <span>Joined {formattedJoined}</span>
            )}

            {views !== undefined && views !== null && views > 0 && (
              <>
                <span>·</span>
                <span>{views.toLocaleString()} views</span>
              </>
            )}
          </div>

          {/* Truncated Address */}
          {wallet && (
            <div className="mt-1 font-mono text-xs text-muted-foreground/80">
              <span title={wallet}>{truncateAddress(wallet, 6, 4)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

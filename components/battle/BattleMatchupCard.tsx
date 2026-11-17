import React, { useState } from "react";
import Link from "next/link";
import { XIcon } from "@/components/ui/PlatformIcons";

interface ContenderProps {
  name: string;
  handle: string;
  platform: "polymarket" | "kalshi";
  pfp?: string | null;
  twitter?: string | null;
  profileHref: string;
}

interface BattleMatchupCardProps {
  contenderA: ContenderProps;
  contenderB: ContenderProps;
}

export function BattleMatchupCard({ contenderA, contenderB }: BattleMatchupCardProps) {
  const [imgErrA, setImgErrA] = useState(false);
  const [imgErrB, setImgErrB] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-8 mb-6 shadow-sm">
      <div className="flex items-center justify-around gap-4 text-center">
        {/* CONTENDER A (Polymarket) */}
        <div className="flex flex-col items-center space-y-2">
          {/* Avatar with blue ring */}
          <Link
            href={contenderA.profileHref}
            className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-blue-500 hover:border-blue-400 transition-colors bg-blue-950/40 flex items-center justify-center shrink-0"
          >
            {contenderA.pfp && !imgErrA ? (
              <img
                src={contenderA.pfp}
                alt={contenderA.name}
                onError={() => setImgErrA(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-2xl font-black text-blue-400 uppercase">
                {contenderA.name.slice(0, 2)}
              </span>
            )}
          </Link>

          <div className="space-y-0.5">
            <Link
              href={contenderA.profileHref}
              className="font-bold text-sm sm:text-base text-foreground hover:underline block"
            >
              {contenderA.handle}
            </Link>
            <div className="text-xs font-semibold text-blue-400">
              Polymarket
            </div>
            {contenderA.twitter && (
              <a
                href={`https://x.com/${contenderA.twitter.replace(/^@/, "").replace("https://x.com/", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`@${contenderA.name} on X`}
                className="inline-block text-muted-foreground hover:text-foreground pt-1 transition-colors"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* VS DIVIDER */}
        <div className="text-2xl sm:text-3xl font-black text-muted-foreground/50 select-none px-2">
          VS
        </div>

        {/* CONTENDER B (Kalshi) */}
        <div className="flex flex-col items-center space-y-2">
          {/* Avatar with green ring */}
          <Link
            href={contenderB.profileHref}
            className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-emerald-500 hover:border-emerald-400 transition-colors bg-emerald-950/40 flex items-center justify-center shrink-0"
          >
            {contenderB.pfp && !imgErrB ? (
              <img
                src={contenderB.pfp}
                alt={contenderB.name}
                onError={() => setImgErrB(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-2xl font-black text-emerald-400 uppercase">
                {contenderB.name.slice(0, 2)}
              </span>
            )}
          </Link>

          <div className="space-y-0.5">
            <Link
              href={contenderB.profileHref}
              className="font-bold text-sm sm:text-base text-foreground hover:underline block"
            >
              {contenderB.handle}
            </Link>
            <div className="text-xs font-semibold text-emerald-400">
              Kalshi
            </div>
            {contenderB.twitter && (
              <a
                href={`https://x.com/${contenderB.twitter.replace(/^@/, "").replace("https://x.com/", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`@${contenderB.name} on X`}
                className="inline-block text-muted-foreground hover:text-foreground pt-1 transition-colors"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

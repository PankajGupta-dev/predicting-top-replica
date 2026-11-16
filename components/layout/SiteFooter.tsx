import Link from "next/link";
import React from "react";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`w-full max-w-4xl mx-auto py-8 px-4 border-t border-border/40 mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground ${className}`}
    >
      <a
        href="https://x.com/predicting_top"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <span className="font-semibold">𝕏</span>
        <span>Our X</span>
      </a>

      <span className="text-border">|</span>

      <Link href="/submit" className="hover:text-foreground transition-colors">
        Get listed
      </Link>

      <span className="text-border">|</span>

      <Link href="/polymarket" className="hover:text-foreground transition-colors">
        Polymarket leaderboard
      </Link>

      <span className="text-border">|</span>

      <Link href="/kalshi" className="hover:text-foreground transition-colors">
        Kalshi leaderboard
      </Link>

      <span className="text-border">|</span>

      <Link href="/terms" className="hover:text-foreground transition-colors">
        Terms
      </Link>
    </footer>
  );
}


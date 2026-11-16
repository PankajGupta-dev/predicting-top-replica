import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import React from "react";

interface NavigationHeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  rightElement?: React.ReactNode;
  showNavLinks?: boolean;
  className?: string;
}

export function NavigationHeader({
  showBackButton = false,
  backHref = "/",
  backLabel = "Leaderboard",
  rightElement,
  showNavLinks = false,
  className = "",
}: NavigationHeaderProps) {
  return (
    <header className={`w-full max-w-4xl mx-auto flex items-center justify-between py-4 px-4 sm:px-0 ${className}`}>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        )}

        {showNavLinks && (
          <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <span>·</span>
            <Link href="/polymarket" className="hover:text-foreground transition-colors">
              Polymarket Leaderboard
            </Link>
            <span>·</span>
            <Link href="/kalshi" className="hover:text-foreground transition-colors">
              Kalshi Leaderboard
            </Link>
            <span>·</span>
            <Link href="/battle" className="hover:text-foreground transition-colors">
              Polymarket vs Kalshi
            </Link>
            <span>·</span>
            <Link href="/api-docs" className="hover:text-foreground transition-colors">
              API
            </Link>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        {rightElement}
        <ThemeToggle />
      </div>
    </header>
  );
}


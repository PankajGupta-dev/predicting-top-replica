import React from "react";
import Link from "next/link";

interface SeoContentProps {
  type: "polymarket" | "kalshi";
}

export function SeoContent({ type }: SeoContentProps) {
  if (type === "polymarket") {
    return (
      <section className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t border-border/50 text-foreground space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          About the Polymarket Leaderboard
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This Polymarket leaderboard ranks the most profitable Polymarket traders by profit and loss over the last day, week, month and all time. Each trader&apos;s wallets are combined into one profile with their X account, open positions, recent trades and a P&amp;L history chart.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              What is the Polymarket leaderboard?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              A ranking of Polymarket traders by profit and loss (P&amp;L). predicting.top tracks known Polymarket traders and updates their daily, weekly, monthly and all-time P&amp;L throughout the day.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              How is Polymarket P&amp;L calculated?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              From Polymarket&apos;s public profit and loss data for each wallet. When a trader uses several wallets, their P&amp;L is added together into one profile.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              How is this different from the leaderboard on polymarket.com?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Polymarket&apos;s own leaderboard lists wallets. predicting.top links wallets to the trader behind them, combines a trader&apos;s wallets, shows their P&amp;L history over time, lets you hide sports traders, and ranks Kalshi traders alongside them.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              How do I get my Polymarket account on the leaderboard?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Submit your wallet and X account on the{" "}
              <Link href="/submit" className="text-primary underline hover:opacity-80">
                Get Listed
              </Link>{" "}
              page. Every submission is checked before it is added.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              Is there a Polymarket leaderboard API?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Yes. The predicting.top API is free, needs no key, and returns the leaderboard, trader profiles, positions and trade histories. See the{" "}
              <Link href="/api-docs" className="text-primary underline hover:opacity-80">
                API documentation
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t border-border/50 text-foreground space-y-6">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        About the Kalshi Leaderboard
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        This Kalshi leaderboard ranks the top 1,000 Kalshi traders by profit over the last day, week, month and all time. P&amp;L is snapshotted every two hours, so you can see how each trader&apos;s profit changes over time, by category as well as in total.
      </p>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            What is the Kalshi leaderboard?
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            A ranking of Kalshi traders by profit. predicting.top tracks the top 1,000 Kalshi traders from their public Kalshi profiles and ranks them by daily, weekly, monthly and all-time profit.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground">
            Do I need a Kalshi account to see it?
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            No. Kalshi&apos;s own leaderboard lives inside Kalshi and traders have to opt in to appear on it. This page is public and needs no account.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground">
            How are daily, weekly and monthly Kalshi profits measured?
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            predicting.top records every tracked trader&apos;s Kalshi P&amp;L every two hours. Daily, weekly and monthly profit is the change between those snapshots, so it fills in over the first days a trader is tracked.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground">
            Can I see a Kalshi trader&apos;s P&amp;L history?
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Yes. Each trader&apos;s profile shows their Kalshi P&amp;L over time and their profit by category, such as politics, economics or sports.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground">
            How do I get my Kalshi account on the leaderboard?
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Make your Kalshi profile public and submit your Kalshi username on the{" "}
            <Link href="/submit" className="text-primary underline hover:opacity-80">
              Get Listed
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </section>
  );
}


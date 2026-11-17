"use client";

import React, { useState } from "react";

export function SubmitForm() {
  const [twitter, setTwitter] = useState("");
  const [platform, setPlatform] = useState("Polymarket");
  const [identifier, setIdentifier] = useState("");
  const [pnl, setPnl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twitter.trim()) {
      setError("Please provide your X / Twitter handle.");
      return;
    }
    if (!identifier.trim()) {
      setError("Please provide your wallet address or account username.");
      return;
    }
    if (!pnl.trim()) {
      setError("Please provide your estimated PnL.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Title & Description */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground">
          Predicting Top Leaderboard — Entry Submission
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Submit your details to be added to the Predicting Top Leaderboard. We will verify your information before adding you.
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-foreground">Submission Received!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Thank you! Your information has been received and our team will verify your account.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setTwitter("");
              setIdentifier("");
              setPnl("");
            }}
            className="text-xs text-primary underline pt-2"
          >
            Submit another account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* 1. X / Twitter Handle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              X / Twitter Handle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="@yourhandle"
              required
              className="w-full bg-input/10 dark:bg-[#1A1A1A] border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* 2. Platform */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-input/10 dark:bg-[#1A1A1A] border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Polymarket">Polymarket</option>
              <option value="Kalshi">Kalshi</option>
              <option value="Hyperliquid">Hyperliquid</option>
              <option value="Opinion">Opinion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* 3. Wallet / Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Polymarket Wallet Address / Kalshi Account Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="0x... or your Kalshi username"
              required
              className="w-full bg-input/10 dark:bg-[#1A1A1A] border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* 4. PnL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              PnL (Profit &amp; Loss) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              placeholder="$125,000"
              required
              className="w-full bg-input/10 dark:bg-[#1A1A1A] border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* 5. Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-foreground text-background font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

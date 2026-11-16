import React from "react";

export function PolymarketIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="4" fill="#2563EB" />
      <path
        d="M6 12L12 6L18 12L12 18L6 12Z"
        fill="white"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KalshiIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="12" fill="#059669" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        Kalshi
      </text>
    </svg>
  );
}

export function HyperliquidIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="4" fill="#0D9488" />
      <circle cx="8.5" cy="12" r="2.5" fill="#5EEAD4" />
      <circle cx="15.5" cy="12" r="2.5" fill="#5EEAD4" />
    </svg>
  );
}

export function OpinionIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="12" fill="#1F2937" stroke="#374151" strokeWidth="1" />
      <circle cx="12" cy="12" r="5" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
      <path d="M12 9V15M9 12H15" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function XIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}


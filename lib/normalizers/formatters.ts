/**
 * Format currency amounts in USD.
 * Example: 14928426.8 -> "+$14,928,426.80"
 * Example: -88828 -> "-$88,828.00"
 */
export function formatUSD(
  amount: number | null | undefined,
  options: {
    compact?: boolean;
    showSign?: boolean;
    decimals?: number;
  } = {}
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "–";
  }

  const { compact = false, showSign = true, decimals } = options;
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formattedValue: string;

  if (compact) {
    if (absAmount >= 1_000_000) {
      formattedValue = (absAmount / 1_000_000).toFixed(decimals ?? 2) + "M";
    } else if (absAmount >= 1_000) {
      formattedValue = (absAmount / 1_000).toFixed(decimals ?? 1) + "K";
    } else {
      formattedValue = absAmount.toFixed(decimals ?? 0);
    }
  } else {
    const defaultDecimals = absAmount >= 1000 ? 0 : 2;
    const finalDecimals = decimals ?? defaultDecimals;
    formattedValue = absAmount.toLocaleString("en-US", {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals,
    });
  }

  const sign = isNegative ? "-" : showSign && amount > 0 ? "+" : "";
  return `${sign}$${formattedValue}`;
}

/**
 * Format ratios as percentages.
 * Example: 0.648 -> "64.8%"
 */
export function formatPercent(
  ratio: number | null | undefined,
  options: { decimals?: number; showSign?: boolean } = {}
): string {
  if (ratio === null || ratio === undefined || isNaN(ratio)) {
    return "–";
  }

  const { decimals = 1, showSign = false } = options;
  const percentage = ratio * 100;
  const sign = showSign && percentage > 0 ? "+" : "";
  return `${sign}${percentage.toFixed(decimals)}%`;
}

/**
 * Truncate EVM wallet addresses to 0x1234...5678 format.
 */
export function truncateAddress(
  address: string | null | undefined,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return "–";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format joined dates into relative days string (e.g. "319d") or Mon Year.
 */
export function formatDaysJoined(joinDate: string | null | undefined): string {
  if (!joinDate) return "–";

  // If already in "319d" format
  if (/^\d+d$/.test(joinDate.trim())) {
    return joinDate.trim();
  }

  const date = new Date(joinDate);
  if (isNaN(date.getTime())) {
    return "–";
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays}d`;
}

/**
 * Format relative timestamps (e.g. "2m ago", "1h ago").
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  if (dateString.includes("ago")) return dateString;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}


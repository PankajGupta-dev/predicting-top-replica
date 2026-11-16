# Component Inventory & Hierarchy: Predicting.top

This document specifies the modular component architecture required to recreate predicting.top with 100% fidelity using Next.js App Router, React, and TypeScript.

---

## 1. Component Hierarchy Tree

```
App
├── Layout
│   ├── NavigationHeader
│   │   ├── BackButton (Profile / Docs / Submissions)
│   │   └── ThemeToggle
│   └── SiteFooter
│       └── ExternalLinkList
│
├── LeaderboardView (Home / Polymarket / Kalshi)
│   ├── LeaderboardHeader
│   │   ├── TitleBlock (H1 + Subtitle + Timestamp)
│   │   └── DailyProfitBadge
│   ├── ControlBar
│   │   ├── SearchInput (with ClearButton)
│   │   ├── TraderCounter
│   │   ├── PeriodSelectorPills
│   │   ├── PlatformFilterGroup
│   │   ├── AttributeFilterGroup (𝕏 linked, No sports, No esports)
│   │   └── MetricSortGroup (Sharpe, Win%, ROI)
│   ├── ScoringLegend
│   └── LeaderboardTable
│       ├── TableHeaderRow
│       ├── TableBody
│       │   └── LeaderboardRow
│       │       ├── RankBadge (#)
│       │       ├── TraderAvatar
│       │       ├── TraderIdentity (Name + TwitterBadge + PlatformBadge)
│       │       ├── JoinedBadge (Hidden on Mobile)
│       │       ├── ScoreBadge (Color-coded)
│       │       └── PnlValueCell (Amount + CategorySubtext)
│       └── ProgressivePaginationButton ("Show more")
│
├── TraderProfileView (/account/:id)
│   ├── ProfileHeader
│   │   ├── LargeAvatar
│   │   ├── ProfileTitle (Name + PlatformLink + TwitterLink)
│   │   ├── MetadataRow (Joined Date + View Count)
│   │   └── TruncatedIdentifier (Wallet / Username)
│   ├── MonthlyPerformanceBar
│   │   ├── MonthNavigator (< Month Year >)
│   │   ├── MonthPnlSummary (P&L + Win/Loss Record)
│   │   └── StreakTileBar
│   ├── PnlHistoryChartCard
│   │   ├── ChartHeader (Title + InfoTooltip)
│   │   └── InteractiveLineChart (SVG / Canvas + Tooltip)
│   ├── KalshiCategoryCard (Kalshi profiles only)
│   │   ├── CategoryHeader
│   │   └── CategoryDistributionBars
│   └── ShareCardDeck
│       ├── ShareCardMonthAllTime
│       ├── ShareCardPnlChart
│       ├── ShareCardMonthCalendar
│       └── ShareCardActions (ThemeToggle + Share + CopyImage + Download + PostOnX)
│
├── BattleView (/battle)
│   ├── BattleHeader
│   ├── CompetitorMatchupCard
│   │   ├── CompetitorIdentity (Contender A)
│   │   ├── VsDivider
│   │   └── CompetitorIdentity (Contender B)
│   └── RelativePerformanceChartCard
│       ├── ChartHeader + Legend
│       └── DualLineChart
│
└── ApiDocsView (/api-docs)
    ├── ApiDocsHeader
    ├── QuickstartCard (CodeBlock with CopyButton)
    └── EndpointList
        └── EndpointCard (MethodBadge + Path + Description + Params + TryLink)
```

---

## 2. Component Specifications & Interfaces

### 2.1 `NavigationHeader`
- **Location**: Top of all pages.
- **Props**:
```typescript
interface NavigationHeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string; // e.g. "Leaderboard" or "Back"
}
```
- **Styling**: `w-full max-w-4xl mx-auto flex items-center justify-between py-4 px-4`.

### 2.2 `ThemeToggle`
- **Props**: None.
- **State**: Consumes `theme` from ThemeContext or `next-themes` (`"dark"` | `"light"`).
- **Renders**: Ghost button with Lucide `Moon` (when dark) or `Sun` (when light).
- **Styling**: `p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors`.

### 2.3 `SearchInput`
- **Props**:
```typescript
interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}
```
- **Features**: Shows `Clear` text button inside or immediately next to the input when `value.length > 0`.
- **Styling**: `bg-input/20 border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-full sm:w-64`.

### 2.4 `PeriodSelectorPills`
- **Props**:
```typescript
interface PeriodSelectorPillsProps {
  periods: string[]; // e.g. ["ALL", "YTD", "1M", "1D", "$5+"]
  activePeriod: string;
  onSelect: (period: string) => void;
}
```
- **Styling**: Active pill uses `bg-primary text-primary-foreground font-semibold`; inactive pill uses `text-muted-foreground hover:text-foreground bg-transparent`.

### 2.5 `ScoreBadge`
- **Props**:
```typescript
interface ScoreBadgeProps {
  score: number | null | undefined;
}
```
- **Logic**:
  - `score >= 70`: `text-green-500 font-semibold`
  - `score >= 40`: `text-amber-500 font-semibold`
  - `score < 40`: `text-red-500 font-semibold`
  - `null | undefined`: `text-muted-foreground font-normal` (renders `–`)
- **Styling**: `tabular-nums text-center text-sm sm:text-base`.

### 2.6 `PnlValueCell`
- **Props**:
```typescript
interface PnlValueCellProps {
  pnl: number;
  categoryTag?: string; // e.g. "Sports +$55K"
}
```
- **Formatting**:
  - Currency formatted with sign: `pnl >= 0 ? `+$${formatUSD(pnl)}` : `-$${formatUSD(Math.abs(pnl))}`.
  - Positive: `text-green-500`.
  - Negative: `text-red-500`.
  - Category Subtext: `text-[11px] text-muted-foreground block text-right`.

### 2.7 `InteractiveLineChart`
- **Props**:
```typescript
interface InteractiveLineChartProps {
  data: Array<{ timestamp: number; pnl: number; date: string }>;
  color?: string; // default green-500
  height?: number; // default 260px
}
```
- **Features**: Responsive SVG or HTML5 Canvas line chart with bezier curves, zero-line dashed axis, dynamic grid lines, and interactive crosshair hover tooltip.

### 2.8 `CategoryDistributionBars`
- **Props**:
```typescript
interface CategoryDistributionBarsProps {
  categories: Array<{
    category: string;
    pnl: number;
    markets: number;
  }>;
}
```
- **Layout**: List of category rows showing category name, market count, proportional green fill bar (`width: (pnl / maxPnl) * 100%`), and formatted dollar P&L.


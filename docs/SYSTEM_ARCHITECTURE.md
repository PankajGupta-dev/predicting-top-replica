# System Architecture: Predicting.top Replica

This document defines the production system architecture, directory topology, caching strategy, API service abstraction, and component relationships for the Predicting.top full-stack replica using **Next.js 15 (App Router)**, **React 19**, and **TypeScript**.

---

## 1. Architectural Principles

1. **Reference Fidelity**: Treat predicting.top as the immutable source of truth. Match visual geometry, typography, colors, responsive reflows, and data presentations without modernization or redesign.
2. **Server-First Data Fetching with Edge ISR**: Leverage Next.js Server Components and Incremental Static Regeneration (ISR) to cache upstream responses, eliminating client latency and insulating against upstream rate limits.
3. **Strict Separation of Concerns**: Keep the typed API client, service transformations, and presentation components completely decoupled.
4. **Resilient Error Boundaries**: Handle loading skeletons, 404 missing traders, and 429 rate limits gracefully without application crashes.
5. **No Unnecessary Infrastructure**: The upstream predicting.top API is open, public, and CORS-enabled. The replica does not require an external database for core functionality; an edge cache layer suffices.

---

## 2. Directory Structure

```
e:/Replica/
├── app/
│   ├── layout.tsx                    # Root HTML, dark class, Poppins font, ThemeProvider
│   ├── page.tsx                      # Home Combined Leaderboard (Server Component)
│   ├── polymarket/
│   │   └── page.tsx                  # Polymarket Leaderboard View
│   ├── kalshi/
│   │   └── page.tsx                  # Kalshi Top 1,000 Leaderboard View
│   ├── battle/
│   │   └── page.tsx                  # Battle of the Badges Matchup View
│   ├── api-docs/
│   │   └── page.tsx                  # Public API Documentation & Playground
│   ├── account/
│   │   └── [id]/
│   │       ├── page.tsx              # Unified Trader Profile (Polymarket & Kalshi)
│   │       └── not-found.tsx         # 404 Trader Not Found State
│   ├── submit/
│   │   └── page.tsx                  # Get Listed submission form
│   ├── terms/
│   │   └── page.tsx                  # Terms of service
│   ├── api/
│   │   └── proxy/
│   │       └── [...path]/
│   │           └── route.ts          # Server-side API proxy with rate-limit shielding & ISR
│   ├── globals.css                   # Tailwind directives & CSS custom property tokens
│   ├── not-found.tsx                 # Global 404 Page
│   └── error.tsx                     # Global Error Boundary
│
├── components/
│   ├── layout/
│   │   ├── NavigationHeader.tsx      # Top bar, back button, theme toggle
│   │   ├── ThemeToggle.tsx           # Moon / Sun toggle
│   │   └── SiteFooter.tsx            # Footer navigation & social links
│   ├── leaderboard/
│   │   ├── LeaderboardView.tsx       # Interactive client container for leaderboard
│   │   ├── LeaderboardHeader.tsx     # Title block, timestamp, daily profit badge
│   │   ├── ControlBar.tsx            # Search, counter, period pills, platform filters
│   │   ├── SearchInput.tsx           # Input with reactive "Clear" button
│   │   ├── PeriodSelector.tsx        # Pill buttons (ALL, YTD, 1M, 1D, etc.)
│   │   ├── PlatformFilter.tsx        # Polymarket, Kalshi, All toggles
│   │   ├── MetricSort.tsx            # Sharpe, Win%, ROI sorting
│   │   ├── ScoringLegend.tsx         # Score formula explanatory text
│   │   ├── LeaderboardTable.tsx      # Core ranking table
│   │   ├── LeaderboardRow.tsx        # Individual row with responsive cell hiding
│   │   └── ProgressiveButton.tsx     # Kalshi "Show more" pagination button
│   ├── profile/
│   │   ├── ProfileHeader.tsx         # Large avatar, verified links, wallet badge
│   │   ├── MonthlyPerformanceBar.tsx # < Month Year >, P&L, 10W/5L, streak tiles
│   │   ├── PnlHistoryChart.tsx       # Cumulative equity curve line chart
│   │   ├── CategoryBreakdown.tsx     # Kalshi horizontal category bars
│   │   ├── PositionsTable.tsx        # Open Polymarket active positions
│   │   ├── TradesTable.tsx           # Recent Polymarket executed trades
│   │   └── ShareCardDeck.tsx         # Month+AllTime, PnL Chart, Month Calendar cards
│   ├── battle/
│   │   ├── CompetitorMatchup.tsx     # Contender cards (Polymarket vs Kalshi)
│   │   └── RelativePerformanceChart.tsx # Dual line comparison chart
│   ├── docs/
│   │   ├── QuickstartCard.tsx        # Interactive code snippet with CopyButton
│   │   └── EndpointCard.tsx          # Card describing each GET route
│   └── ui/                           # Primitive components (Button, Input, Tooltip, Badge)
│
├── lib/
│   ├── api/
│   │   ├── client.ts                 # Base HTTP client with headers, timeout, retry
│   │   ├── endpoints.ts              # Strongly typed endpoint definitions
│   │   └── rate-limiter.ts           # Upstream request throttling & token bucket
│   ├── services/
│   │   ├── leaderboard.service.ts    # Fetching & caching leaderboard datasets
│   │   ├── trader.service.ts         # Profile, positions, trades, history fetching
│   │   └── metrics.service.ts        # Daily profit & market insights fetching
│   ├── normalizers/
│   │   ├── trader.normalizer.ts      # Unifies Polymarket vs Kalshi data schemas
│   │   ├── formatters.ts             # USD currency, percentages, date relative strings
│   │   └── color-tier.ts             # Smart score color mapping logic
│   └── hooks/
│       ├── useLeaderboardFilter.ts   # In-memory search, filtering, and sorting state
│       └── useTheme.ts               # Theme management hook
│
├── types/
│   ├── api.types.ts                  # Raw upstream response interfaces
│   └── domain.types.ts               # Normalized application data types
│
├── docs/                             # Full audit and specification documentation
├── public/                           # Static assets, fallback SVGs, platform logos
├── next.config.ts                    # Image optimization domains, caching headers
├── tailwind.config.ts                # Custom colors matching :root / .dark tokens
└── tsconfig.json                     # Strict TypeScript configuration
```

---

## 3. Data Flow & Service Architecture

```
[ Client Browser ]
        │
        │ HTTP (HTML / React SSR / Hydration)
        ▼
[ Next.js App Router (Server Components) ]
        │
        ├── Cached in Next.js Data Cache (revalidate: 60s)
        │
        ▼
[ API Service Layer (lib/services/*) ]
        │
        ▼
[ Data Normalization Layer (lib/normalizers/*) ]
        │
        ├── Type Checking & Nullable Sanitization
        │
        ▼
[ Typed API Client (lib/api/client.ts) ]
        │
        ├── Request Deduplication (React cache())
        ├── Rate-Limit Throttler (60-120 req/min token bucket)
        │
        ▼
[ Upstream Public API: https://predicting.top/api/* ]
```

---

## 4. Caching & Rate-Limit Strategy

### 4.1 Incremental Static Regeneration (ISR)
Upstream API limits are strictly respected by enforcing server-side caching:
- **Leaderboards (`/api/leaderboard`, `/api/kalshi-leaderboard`)**:
  - `revalidate: 60` (1 minute cache).
  - Subsequent client navigations hit Next.js memory cache instantly with 0ms roundtrip to upstream.
- **Trader Profiles (`/api/trader/{id}`)**:
  - `revalidate: 300` (5 minute cache).
- **Daily Profit (`/api/daily-profit`)**:
  - `revalidate: 60` (1 minute cache).
- **Positions & Trades (`/api/trader/{wallet}/positions`)**:
  - `revalidate: 60` (1 minute cache).

### 4.2 Request Deduplication
When multiple components on a server-rendered route request the same dataset (e.g. `leaderboard.service.ts`), `React.cache()` deduplicates the request so that only a single upstream fetch occurs per render pass.

### 4.3 Throttling & Exponential Backoff
The API client tracks the `x-ratelimit-remaining` header from predicting.top. When remaining requests fall below 5, requests are delayed or served from local cache. On HTTP 429, the client implements exponential backoff adhering to `Retry-After`.

---

## 5. Error Handling & Boundary Architecture

- **404 Trader Not Found**:
  - Handled via `notFound()` in `app/account/[id]/page.tsx`.
  - Renders a styled `not-found.tsx` component matching predicting.top dark aesthetics with a `< Back to Leaderboard` button.
- **Upstream Service Downtime / Network Failure**:
  - `error.tsx` displays a friendly retry boundary while retaining cached stale data where possible (`stale-while-revalidate`).
- **Missing or Nullable Fields**:
  - All presentation cells use default safe fallbacks (e.g., `trader.wallet ?? "–"`, `smart_score?.score ?? "–"`).

---

## 6. Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
UPSTREAM_API_BASE_URL="https://predicting.top"
LEADERBOARD_CACHE_REVALIDATE=60
PROFILE_CACHE_REVALIDATE=300
ENABLE_UPSTREAM_PROXIES=true
```

---

## 7. Database Requirements Evaluation

- **Is a Persistent Database Required for Baseline Replica?**: **No.**
- **Reasoning**: The upstream predicting.top platform functions as an open, free, unauthenticated data provider with complete historical and real-time endpoints. Directing requests through our Next.js edge caching proxy ensures 100% data freshness and reference parity with zero database hosting overhead or sync drift.
- **Future Extension**: If user accounts, custom watchlists, or local bookmarking are introduced in later milestones, a lightweight Prisma + SQLite / Postgres integration can be attached seamlessly to the service layer without modifying presentation components.


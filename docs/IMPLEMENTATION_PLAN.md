# Implementation Plan: Predicting.top Replica

This document establishes the step-by-step phased engineering roadmap for constructing the high-fidelity Predicting.top replica.

Each phase is independently verifiable and satisfies the non-negotiable rules outlined in `AGENTS.md`.

---

## Phase Overview

```
Phase 1: Project Setup & Design Token Foundation
   │
   ▼
Phase 2: Types, API Client & Data Service Layer
   │
   ▼
Phase 3: Shell, Header & Theme Switcher
   │
   ▼
Phase 4: Leaderboard Pages (/, /polymarket, /kalshi)
   │
   ▼
Phase 5: Unified Trader Profile (/account/:id)
   │
   ▼
Phase 6: Battle, Docs & Auxiliary Pages (/battle, /api-docs, /submit, /terms)
   │
   ▼
Phase 7: End-to-End Testing & Visual Regression Verification
```

---

## Detailed Phases

### Phase 1: Project Initialization & Design Token Foundation
- **Goal**: Establish the Next.js 15 App Router codebase with strict TypeScript and Tailwind CSS matching the verified design tokens.
- **Tasks**:
  1. Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
  2. Configure `globals.css` with exact `:root` and `.dark` CSS custom properties (`--background: hsl(0, 0%, 7%)`, `--foreground: hsl(0, 0%, 93%)`, etc.).
  3. Configure `Poppins` and `Menlo` typography in `layout.tsx`.
  4. Setup `next.config.ts` with external image domains (`polymarket-upload.s3...`, `pbs.twimg.com`).
- **Verification**: Blank page renders with default dark background `#121212`, correct fonts, and zero console warnings.

---

### Phase 2: Typed API Client & Data Services
- **Goal**: Build the data layer that interfaces with `https://predicting.top/api/*` with caching and rate-limit protection.
- **Tasks**:
  1. Create `types/api.types.ts` containing the verified TypeScript interfaces from `docs/DATA_DICTIONARY.md`.
  2. Implement `lib/api/client.ts` with timeout handling, exponential retry, and rate-limit tracking.
  3. Implement `lib/services/leaderboard.service.ts` for `/api/leaderboard`, `/api/kalshi-leaderboard`, and `/api/daily-profit` with 60s ISR caching.
  4. Implement `lib/services/trader.service.ts` for trader profiles, open positions, trades, and category distributions with 300s caching.
  5. Build normalizers in `lib/normalizers/` for currency formatting, relative timestamps, and Smart Score color tiering.
- **Verification**: Unit test script successfully fetches and parses live data without errors.

---

### Phase 3: Layout Shell & Navigation
- **Goal**: Recreate the universal navigation header, back buttons, and theme toggle.
- **Tasks**:
  1. Implement `NavigationHeader` with responsive padding, back navigation link, and `ThemeToggle`.
  2. Implement `ThemeToggle` supporting dark/light mode toggle with persistence in `localStorage`.
  3. Implement `SiteFooter` with verified external links (`𝕏 Our X`, `Get listed`, `Terms`).
- **Verification**: Visual comparison against header screenshots at 1440px and 390px viewports; theme switch instantaneously inverts palette.

---

### Phase 4: Leaderboard Views (`/`, `/polymarket`, `/kalshi`)
- **Goal**: Build the full interactive leaderboards with filtering, search, sorting, and progressive loading.
- **Tasks**:
  1. Build `LeaderboardHeader` with dynamic `Today: +$XXX,XXX` profit badge.
  2. Build `ControlBar` containing:
     - Search input with real-time text matching and reactive "Clear" button.
     - Dynamic trader counter (`XXX of YYY traders`).
     - Period selector pills (`ALL`, `YTD`, `1M`, `1D`, `$5+`).
     - Platform filter buttons (Polymarket, Kalshi, All, etc.).
     - Attribute pills (`𝕏 linked`, `No sports`, `No esports`).
     - Metric sort pills (`Sharpe`, `Win%`, `ROI`).
  3. Build `LeaderboardTable` matching exact row geometry (`57px`), column alignments, and badges.
  4. Implement responsive column hiding (hiding `Joined` column on mobile, truncating names).
  5. Implement `/kalshi` with `49px` row heights and progressive pagination ("Show more [XXX left]").
- **Verification**: Test all interactions against `docs/INTERACTION_MATRIX.md`; verify search, sorting, and period switching work without full page reloads.

---

### Phase 5: Unified Trader Profile (`/account/:id`)
- **Goal**: Recreate the complete profile page for Polymarket wallets and Kalshi handles.
- **Tasks**:
  1. Build `ProfileHeader` with 64px avatar, platform badge, Twitter link, and copyable wallet address.
  2. Build `MonthlyPerformanceBar` with `< Month Year >` selector, monthly net P&L, win/loss record (`10W / 5L`), and streak tiles.
  3. Build `PnlHistoryChart` with responsive SVG line curves, zero-line dashed axis, and hover crosshair tooltip.
  4. Build `CategoryBreakdown` horizontal bars for Kalshi profiles.
  5. Build `PositionsTable` and `TradesTable` for Polymarket profiles.
  6. Build `ShareCardDeck` rendering "Month + All-Time", "P&L Chart", and "Monthly Calendar" cards with theme toggles (`Light` / `Black`) and clipboard copy.
  7. Handle missing trader profiles with styled `not-found.tsx`.
- **Verification**: Inspect profiles `0x5a218...` and `ProbabilityDuck` against reference screenshots.

---

### Phase 6: Battle, Docs & Auxiliary Views
- **Goal**: Implement `/battle`, `/api-docs`, `/submit`, and `/terms`.
- **Tasks**:
  1. Implement `/battle` displaying the featured head-to-head competitor cards and dual-line performance chart.
  2. Implement `/api-docs` displaying the quickstart fetch block with copy button, and all 14 endpoint cards.
  3. Implement `/submit` account listing form.
  4. Implement `/terms` legal terms of service.
- **Verification**: Routes render identically to reference screenshots across all viewports.

---

### Phase 7: Verification & Visual Regression Testing
- **Goal**: Comprehensive testing and pixel-accurate validation.
- **Tasks**:
  1. Run type checking (`tsc --noEmit`) and ESLint.
  2. Execute Playwright tests against all routes at:
     - Desktop: 1440 x 900
     - Laptop: 1366 x 768
     - Mobile: 390 x 844
  3. Verify console error freedom and zero dead links.
- **Verification**: All Playwright test runs pass and visually match reference screenshots.


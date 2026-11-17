# End-to-End Engineering Workflow Write-Up

**Project**: Predicting.top Full-Stack Replica  
**Author**: Antigravity Engineering Agent  
**Repository**: [https://github.com/PankajGupta-dev/predicting-top-replica](https://github.com/PankajGupta-dev/predicting-top-replica)  

---

## 1. Project Overview & Philosophy

The Predicting.top Replica is a full-stack, pixel-accurate engineering reproduction of [predicting.top](https://predicting.top/), the prediction market leaderboard for Polymarket and Kalshi traders.

The project was executed following a phased, verified approach guided by strict non-negotiable rules:
- **Reference Fidelity**: Treat the original website as the source of truth. No artistic redesigns or modernizations.
- **Data Integrity**: Powered by official public Predicting.top APIs. Zero mock data or fabricated metrics.
- **Architectural Separation**: Clean boundaries between UI presentation, domain services, typed API clients, and proxies.
- **Continuous Quality**: TypeScript strict mode (`0 errors`), multi-viewport automated testing, and zero console warnings.

---

## 2. Engineering Phases & Lifecycle

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ENGINEERING LIFECYCLE                           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
 1. Reverse-Engineering Audit & Discovery (Task 0 & Task 1)
    ├── Page inventory, design tokens, typography, dimensions
    ├── Safe probing of 14 public API endpoints & schema dictionary
    └── Creation of Data Availability Matrix & System Architecture
                                   │
 2. Foundation & Architecture (Phase 1 & Phase 2)
    ├── Next.js 15 App Router setup, React 19, Tailwind CSS 3
    ├── Dual-theme design tokens (Dark #121212, Light #f0f0f0)
    └── Typed API client with exponential backoff & proxy layer
                                   │
 3. Layout Shell & Navigation (Phase 3)
    ├── Universal NavigationHeader with responsive padding & back links
    ├── ThemeToggle with instant localStorage persistence
    └── SiteFooter with external social, submission, and legal links
                                   │
 4. Feature Development (Phases 4, 5, 6)
    ├── Cross-Platform, Polymarket, and Kalshi Leaderboards
    ├── Progressive pagination (Kalshi) & multi-period filter pills
    ├── Unified Trader Profile (/account/:id) with custom SVG P&L curves
    ├── Head-to-Head Battle of the Badges (/battle)
    └── Public API Docs (/api-docs), Submit (/submit), Terms (/terms)
                                   │
 5. Verification & Visual Parity (Phase 7)
    ├── Automated Chrome DevTools Protocol (CDP) test runner
    ├── Viewport verification at 1440px, 1366px, and 390px
    └── Zero console errors and 100% test pass rate
                                   │
 6. DevOps & Cloud Deployment
    ├── Standardizing package.json scripts and .gitignore
    ├── Resolving cross-platform compiler dependencies (SWC)
    └── Pushing to GitHub & deploying to Vercel global edge network
```

---

## 3. Detailed Phase Walkthrough

### Phase 0 & 1: Reverse-Engineering & API Discovery
- **Audit**: Inspected the live site DOM via browser DevTools, capturing layout containers (`max-w-4xl`), row heights (`57px` for Polymarket, `49px` for Kalshi), typography (`Poppins` and `Menlo`), and color palettes.
- **API Probing**: Executed safe HTTP GET requests across all documented endpoints:
  - `/api/leaderboard`, `/api/kalshi-leaderboard`, `/api/daily-profit`
  - `/api/trader/{id}`, `/positions`, `/trades`, `/categories`, `/history`
- **Deliverables**: Generated [`docs/REFERENCE_AUDIT.md`](file:///e:/Replica/docs/REFERENCE_AUDIT.md), [`docs/SYSTEM_ARCHITECTURE.md`](file:///e:/Replica/docs/SYSTEM_ARCHITECTURE.md), [`docs/DATA_DICTIONARY.md`](file:///e:/Replica/docs/DATA_DICTIONARY.md), and [`docs/DATA_AVAILABILITY_MATRIX.md`](file:///e:/Replica/docs/DATA_AVAILABILITY_MATRIX.md).

### Phase 2 & 3: Architectural Foundation & Shell
- **API Proxy Layer**: Implemented [`app/api/proxy/[...path]/route.ts`](file:///e:/Replica/app/api/proxy/[...path]/route.ts) to forward browser requests to upstream endpoints server-side, eliminating CORS issues and providing a centralized caching tier.
- **Formatters & Adapters**: Implemented currency formatters, date relative formatters, Smart Score color tiering, and wallet address truncation in [`lib/normalizers/formatters.ts`](file:///e:/Replica/lib/normalizers/formatters.ts).
- **Universal Shell**: Built universal layout components with seamless dark/light theme switching stored in `localStorage`.

### Phase 4: Leaderboards (`/`, `/polymarket`, `/kalshi`)
- Built [`ControlBar.tsx`](file:///e:/Replica/components/leaderboard/ControlBar.tsx) with search, reactive clear, period pills (`1D`, `1M`, `YTD`, `ALL`, `$5+`, `Non-sports`), platform toggles, and metric sorters.
- Built [`LeaderboardTable.tsx`](file:///e:/Replica/components/leaderboard/LeaderboardTable.tsx) and [`LeaderboardRow.tsx`](file:///e:/Replica/components/leaderboard/LeaderboardRow.tsx) with exact 57px and 49px row geometry, circular avatars, and category badges.
- Implemented Kalshi progressive pagination loading 100 rows per batch up to 1,000.

### Phase 5: Unified Trader Profile (`/account/:id`)
- Built dynamic profile system supporting both EVM wallets (Polymarket) and usernames (Kalshi).
- **Monthly Performance Bar**: `< Month Year >` navigator with daily streak micro-tiles and monthly net P&L.
- **P&L History Chart**: Custom interactive SVG Bézier line chart with zero baseline, Y-axis currency scale, and hover crosshair tooltip.
- **Kalshi Category Breakdown**: Horizontal distribution progress bars showing market participation and P&L.
- **Positions & Trades**: Tabbed data tables for open positions and recent trade history.
- **Share Deck**: 3-card share preview with Light/Black theme toggle and 1-click clipboard actions.

### Phase 6: Battle, Docs & Auxiliary Views
- `/battle`: Head-to-head matchup card (`@25usdc` vs `@PredMTrader`) and dual comparison curve chart.
- `/api-docs`: 1-click copyable JavaScript fetch snippet and 14 interactive endpoint cards.
- `/submit`: Trader listing submission form with validation and success card.
- `/terms`: 8-section legal agreement.
- `/_not-found`: Custom 404 recovery card.

### Phase 7: Verification & Automated E2E Testing
- Created Python CDP runner [`scratch/run_full_e2e_suite.py`](file:///e:/Replica/scratch/run_full_e2e_suite.py) testing 29 critical assertions across 1440px Desktop, 1366px Laptop, and 390px Mobile viewports.
- Verified 100% test pass rate with 0 fatal console errors.
- Generated [`docs/FINAL_VERIFICATION_REPORT.md`](file:///e:/Replica/docs/FINAL_VERIFICATION_REPORT.md).

### DevOps & Cloud Deployment
- Standardized `package.json` scripts (`next build`, `next start`, `next dev`).
- Repaired `@next/swc-win32-x64-msvc` dependency issue to enable cross-platform Linux/Windows compilation.
- Pushed clean Git repository to [https://github.com/PankajGupta-dev/predicting-top-replica](https://github.com/PankajGupta-dev/predicting-top-replica).
- Deployed full-stack application to Vercel Serverless & Edge infrastructure.

---

## 4. Key Takeaways & Best Practices

1. **Strict Zero-Mock Enforcement**: Building against real upstream APIs from Day 1 prevents downstream integration shocks and guarantees authentic financial data.
2. **Atomic Component Decomposition**: Separating data normalizers (`lib/normalizers/`), services (`lib/services/`), and UI presentation ensures components remain testable and decoupled.
3. **Cross-Platform Hygiene**: Never add platform-specific native binaries into direct project dependencies. Always rely on framework-managed optional dependencies for Linux/macOS/Windows portability.
4. **Resilient Hydration**: Always design client components to gracefully hydrate even if initial SSR data is empty, eliminating blank-screen crashes.

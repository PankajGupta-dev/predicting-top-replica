# Evaluation Plan & Verification Framework (Evals)

**Project**: Predicting.top Replica  
**System Target**: Next.js App Router, React 19, TypeScript, Tailwind CSS  
**Source of Truth**: [https://predicting.top/](https://predicting.top/)

---

## 1. Objective & Philosophy

The objective of this Evals framework is to provide rigorous, automated, and continuous verification of the replica across five critical vectors:
1. **Design & Visual Fidelity**: Sub-pixel alignment, color token accuracy, typography, and responsive geometry.
2. **Data & Calculation Integrity**: Zero mock data, authentic upstream schema validation, and correct metric transformations.
3. **Interactive State & Logic**: All user controls, filter combinations, sorting mechanisms, and state persistence.
4. **Performance & Web Vitals**: Lighthouse scores, Core Web Vitals, and payload optimization.
5. **Edge & Failure Resilience**: Upstream API failure handling, rate limit mitigation, empty states, and 404 recovery.

---

## 2. Evaluation Dimensions & Acceptance Criteria

```
                        ┌────────────────────────────────────────┐
                        │      PREDICTING.TOP EVALS ENGINE       │
                        └───────────────────┬────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌───────────────┐   ┌───────────────┐               ┌───────────────┐   ┌───────────────┐
│ 1. Visual &   │   │ 2. Data & API │               │ 3. Logic &    │   │ 4. Performance│
│ Layout Parity │   │ Integrity     │               │ Interactions  │   │ & Resilience  │
└───────────────┘   └───────────────┘               └───────────────┘   └───────────────┘
```

### Dimension 1: Visual & Layout Parity
- **Viewport Matrix**:
  - Desktop: `1440 x 900`
  - Laptop: `1366 x 768`
  - Mobile: `390 x 844`
- **Row Height Geometry**:
  - Home / Polymarket rows: strictly `57px` (`h-[57px]`).
  - Kalshi rows: strictly `49px` (`h-[49px]`).
- **Color Palette & Design Tokens**:
  - Background: Dark `#121212` (`hsl(0, 0%, 7%)`), Light `#f0f0f0`.
  - Foreground: Dark `#ededed`, Light `#121212`.
  - Accent / Positive P&L: Emerald Green `#10b981` / `#22c55e`.
  - Negative P&L: Rose Red `#ef4444`.
- **Typography**:
  - Primary: `Poppins`, sans-serif.
  - Numbers, metrics & addresses: Monospace (`Menlo`, `Courier New`).
- **Visual Regression Tolerance**:
  - Image diff pixel discrepancy threshold: `< 0.5%`.

### Dimension 2: Data & Calculation Integrity
- **Non-Negotiable Zero-Mock Rule**: Under no circumstances may mock or fabricated financial figures, rankings, or usernames be returned.
- **Contract Schema Validation**:
  - Leaderboard endpoint (`/api/leaderboard`): validate `rank`, `name`, `wallet`, `stats.pnl`, `smart_score.score`.
  - Kalshi leaderboard (`/api/kalshi-leaderboard`): validate `kalshi_username`, `pnl`, `sports_share`.
  - Trader profile (`/api/trader/:id`): validate profile header, view count, join date.
  - Category breakdown (`/api/kalshi/:username/categories`): validate `category`, `pnl`, `markets_count`.
- **Currency & Metric Formatting**:
  - USD currency values: formatted with commas and sign (`+$12,450`, `-$3,200`).
  - Score color tiering: Green (`>= 70`), Yellow (`40 - 69`), Red (`< 40`).
  - Truncated wallet addresses: `0x1234...abcd` format.

### Dimension 3: Interactive State & Logic
- **Search & Clear**: Real-time substring filter on trader names, handles, and wallet addresses; instant reactive `Clear` button restoration.
- **Period Filter Pills**: Switching between `ALL`, `YTD`, `1M`, `1D`, `$5+`, and `Non-sports` updates dataset without full page reloads.
- **Entry Limit Selector**: Dropdown options (`10`, `25`, `50`, `100`, `200`, `All`, `Custom`) strictly slice displayed rows and synchronize counter text (`X of Y traders`).
- **State Persistence**: Theme mode and entry limits persist across page reloads via `localStorage`.
- **Progressive Pagination**: Kalshi leaderboard appends 100 rows per "Show more" click up to 1,000 total.
- **Interactive Data Visualizations**:
  - SVG P&L history line chart renders responsive Bézier curves with zero baseline, Y-axis currency scale, and hover crosshair tooltip.
  - Head-to-head battle chart renders dual comparison curves.

### Dimension 4: Performance & Web Vitals
- **Core Web Vitals Thresholds**:
  - **LCP (Largest Contentful Paint)**: `< 1.8s`
  - **FID / INP (Interaction to Next Paint)**: `< 100ms`
  - **CLS (Cumulative Layout Shift)**: `< 0.05`
- **Bundle Size Budget**:
  - First Load JS shared by all routes: `< 110 kB`.
  - Individual page JS footprint: `< 10 kB`.
- **Cache Strategy**:
  - Leaderboards: 60-second Incremental Static Regeneration (ISR).
  - Trader profiles: 300-second ISR.

### Dimension 5: Resilience & Error Handling
- **Graceful API Degradation**: When upstream API is slow or temporarily down, server uses stale-while-revalidate cached data.
- **Empty States**: If search or filter yields 0 matches, display clean message: `"No traders found matching your criteria"`.
- **404 Recovery**: Unrecognized trader IDs render friendly "Trader Not Found" screen with a direct link back to the leaderboard.

---

## 3. Automated Test Suite Architecture

The automated evaluation runner (`scratch/run_full_e2e_suite.py`) operates via Chrome DevTools Protocol (CDP):

```python
# Core Evaluation Suite Structure
class LeaderboardEvaluationSuite:
    def test_navigation_and_headers(self): ...
    def test_timestamp_and_profit_badge(self): ...
    def test_search_and_reactive_clear(self): ...
    def test_entry_limit_slicing(self): ...
    def test_period_filter_transition(self): ...
    def test_kalshi_progressive_pagination(self): ...
    def test_profile_chart_and_positions(self): ...
    def test_battle_dual_chart(self): ...
    def test_theme_toggle_and_persistence(self): ...
    def test_404_error_boundary(self): ...
    def test_zero_fatal_console_errors(self): ...
```

### Results Summary
- **Total Assertions**: 29
- **Passed**: 29 (100%)
- **Fatal Console Errors**: 0
- **Regression Status**: Zero regressions detected.

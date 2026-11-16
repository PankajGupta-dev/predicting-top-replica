# Interaction Matrix: Predicting.top

This document details all interactive components, user triggers, initial/resulting states, URL persistence, and data side effects across predicting.top.

---

## 1. Global Interactions

### 1.1 Theme Toggle
- **Element**: Moon / Sun icon button (`aria-label="Toggle theme"`).
- **Location**: Top right of header on all pages.
- **Trigger**: Click.
- **Initial State**: Dark mode active (`<html class="dark">`, Moon icon rendered).
- **Resulting State**: Light mode toggled (`<html class="light">` or `.dark` class removed, Sun icon rendered, surfaces shift to `#f0f0f0`).
- **Persistence**: Persisted in `localStorage` under `theme` key. Does not change URL.
- **Side Effects**: Repaints all CSS custom properties without reloading the page.

---

## 2. Leaderboard Table Interactions (`/`, `/polymarket`, `/kalshi`)

### 2.1 Period Selector Pills
- **Elements**: Button group `ALL`, `YTD`, `1M`, `1D`, `$5+` (Kalshi: `ALL`, `1M`, `7D`, `1D`, `Non-sports`).
- **Trigger**: Click.
- **Initial State**: `1D` or `ALL` active (highlighted with `--primary` background `#ffffff` in dark mode, `#000000` in light mode, text color inverted).
- **Resulting State**:
  - Clicked period becomes active.
  - Previous period button becomes transparent with muted foreground text.
  - Table rows animate/re-render showing P&L figures for that selected period.
- **Data Side Effect**:
  - Either client-side filters existing memory dataset or triggers `GET /api/leaderboard?period=[period]`.
- **URL Behavior**: URL path does not change; preserves clean shareable URLs.

### 2.2 Platform Filter Toggles
- **Elements**: Polymarket logo button, Kalshi badge, Hyperliquid/Myriad dot, All pill, Opinion icon.
- **Trigger**: Click.
- **Initial State**: All platforms enabled or active platform selected.
- **Resulting State**:
  - Filtered table displays only traders matching the selected platform identity.
  - Trader counter updates immediately (`XXX of YYY traders`).
- **Data Side Effect**: Client-side filtering over the `traders` array via `trader.platform === selectedPlatform`.

### 2.3 Additional Filter Pills
- **`𝕏 linked`**: Filters traders who have a connected Twitter handle (`trader.twitter !== null`).
- **`No sports`**: Excludes traders whose volume is majority sports betting (`trader.sports_share < 0.5`).
- **`No esports`**: Excludes traders focused on gaming/esports tournaments.
- **`$5+`**: Filters out micro-stakes traders below a minimum volume/P&L floor.

### 2.4 Metric Sort Pills (`Sharpe`, `Win%`, `ROI`)
- **Elements**: Small pill buttons to the right of platform filters.
- **Trigger**: Click.
- **Initial State**: Unsorted by metric (default sorted by P&L descending).
- **Resulting State**:
  - Table re-sorts descending by the chosen statistical indicator:
    - `Sharpe`: Higher Sharpe ratio first.
    - `Win%`: Higher win rate percentage first.
    - `ROI`: Higher return on investment first.
  - Pill gains active background highlight. Clicking again toggles ascending/descending or resets to P&L.

### 2.5 Real-Time Trader Search & "Clear" Button
- **Element**: Text Input (`placeholder="Search traders..."` / `placeholder="Search Kalshi traders..."`).
- **Trigger**: Keyboard input (`onInput` / `onChange`).
- **Behavior**:
  - Live filtering against `trader.name`, `trader.wallet`, `trader.kalshi_username`, and `trader.twitter`.
  - Trader counter recalculates in real time (e.g. `1 of 582 traders`).
  - When input contains text (`value.length > 0`), a clickable "Clear" text button appears immediately to the right of the search input.
  - Clicking "Clear" resets input value to `""`, clears filter, hides "Clear" button, and focuses the input.

### 2.6 Table Column Header Sorting
- **Elements**: Clickable `<th>` headers (`#`, `Score`, `P&L`).
- **Trigger**: Click.
- **Behavior**:
  - `#`: Sorts by default rank.
  - `Score`: Toggles sorting traders by custom algorithmic score (Highest to Lowest).
  - `P&L`: Toggles sorting by Net P&L amount.

### 2.7 Trader Row Navigation
- **Element**: Entire `<tr>` row in the leaderboard table.
- **Trigger**: Click.
- **Behavior**:
  - Navigates client-side to `/account/{wallet}` (for Polymarket) or `/account/{username}` (for Kalshi).
  - Preserves scroll position on browser back navigation.

### 2.8 Progressive Pagination ("Show more")
- **Element**: Button "Show more (XXX left)" at bottom of Kalshi leaderboard.
- **Trigger**: Click.
- **Initial State**: Top 100 traders rendered; button shows `Show more (900 left)`.
- **Resulting State**:
  - Appends next 100 traders to the DOM.
  - Counter decrements: `Show more (800 left)`.
  - Hides completely once all 1,000 traders are rendered.

---

## 3. Trader Profile Interactions (`/account/:id`)

### 3.1 Monthly P&L Date Navigation
- **Elements**: Left chevron `<`, Month-Year display, Right chevron `>`.
- **Trigger**: Click on `<` or `>`.
- **Behavior**: Shifts active calendar month back or forward. Updates monthly P&L total, win/loss record (`XW / YL`), and calendar day matrix.

### 3.2 Streak Bar Expansion
- **Element**: Mini streak bar tiles + Chevron Down.
- **Trigger**: Click.
- **Behavior**: Expands detailed daily win/loss breakdown modal or inline popover.

### 3.3 Chart Tooltip
- **Element**: SVG / Canvas P&L growth line.
- **Trigger**: Mouse hover (desktop) / Touch drag (mobile).
- **Behavior**:
  - Displays vertical crosshair line at cursor X position.
  - Floating card displays exact Date (e.g., `Nov 12, 2026`) and Cumulative P&L value (`+$1,114,200`).

### 3.4 Share Card Theme Toggle
- **Elements**: Pill toggle buttons `Light` | `Black`.
- **Trigger**: Click.
- **Behavior**: Toggles preview rendering of the share card between a white/light surface and pitch black surface before downloading or sharing.

### 3.5 Share Card Action Triggers
- **`Share`**: Triggers native browser `navigator.share()` API with title, text, and link.
- **`Copy image`**: Renders share card canvas to Blob (`image/png`) and writes to system clipboard (`navigator.clipboard.write([new ClipboardItem(...)])`). Displays temporary "Copied!" toast notification.
- **`Download`**: Generates and downloads PNG image named `[trader]-[month]-pnl.png`.
- **`Post on X`**: Opens new browser tab to `https://x.com/intent/post?text=...&url=...`.

---

## 4. API Docs Interactions (`/api-docs`)

### 4.1 Code & Path Copy Buttons
- **Elements**: "Copy" buttons in code blocks and endpoint cards.
- **Trigger**: Click.
- **Behavior**: Copies code snippet or URL path to clipboard. Button text switches temporarily to "Copied!" or Check icon for 2,000ms.

### 4.2 Live "Try" Links
- **Elements**: Anchor tags under "Try: /api/leaderboard?period=7d".
- **Trigger**: Click.
- **Behavior**: Opens the live JSON endpoint in a new browser tab for immediate testing.


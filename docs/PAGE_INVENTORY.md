# Page Inventory: Predicting.top

This document provides a comprehensive inventory of every page identified on predicting.top, including exact routes, page titles, layout parameters, components, data dependencies, and responsive adaptations.

---

## 1. Route Summary Table

| Route | Page Name | Primary Data Source | Key Features | Max Container Width |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Cross-Platform Leaderboard | `/api/leaderboard`, `/api/daily-profit` | Multi-period filters, platform toggles, search, score sorting | 896px (`max-w-4xl`) |
| `/polymarket` | Polymarket Leaderboard | `/api/leaderboard?platform=polymarket` | Polymarket-focused rankings, wallet badges, social links | 896px (`max-w-4xl`) |
| `/kalshi` | Kalshi Leaderboard | `/api/kalshi-leaderboard` | Top 1,000 Kalshi rankings, category tags, "Show more" | 896px (`max-w-4xl`) |
| `/battle` | Battle of the Badges | `/api/kalshi/...`, `/api/trader/...` | Head-to-head comparison, dual performance chart | 896px (`max-w-4xl`) |
| `/api-docs` | Public API Documentation | Static + Live sample snippets | Copyable code blocks, endpoint specs, parameters | 768px (`max-w-2xl`) |
| `/account/:id` (EVM) | Polymarket Profile | `/api/trader/{wallet}`, `/positions`, `/trades` | Daily P&L calendar, streak bar, P&L growth chart, share cards | 896px (`max-w-4xl`) |
| `/account/:id` (Kalshi)| Kalshi Profile | `/api/trader/{user}`, `/categories`, `/history` | Category P&L breakdown bars, cumulative history, monthly stats | 896px (`max-w-4xl`) |
| `/submit` | Get Listed Submission | Form / Static submission instructions | Wallet & account submission form | 768px (`max-w-2xl`) |
| `/terms` | Terms of Service | Static legal content | Terms of service and API usage agreement | 768px (`max-w-2xl`) |

---

## 2. Detailed Page Specifications

### 2.1 Home Page (`/`)
- **Route**: `https://predicting.top/`
- **Page Title**: `Prediction Market Leaderboard — Top Polymarket & Kalshi Traders | predicting.top`
- **Meta Description**: `The prediction market leaderboard: live P&L rankings of the top Polymarket and Kalshi traders — daily, weekly, monthly and all-time, with wallets, profiles and a free API.`
- **Visual Structure**:
  - **Header Block**:
    - `H1`: "Prediction Market Leaderboard" (font-size: `28px` desktop, `22px` mobile; font-weight: `700`)
    - Subtitle: "Top Polymarket, Kalshi & Hyperliquid traders, ranked by P&L in real time" (font-size: `14px`, text-muted)
    - Timestamp: "P&L updated [Date, Time]" (font-size: `12px`, text-muted)
    - Daily Metric (top right desktop, wrapped mobile): `Today: +$XXX,XXX` (positive green `#22c55e`, font-weight `600`)
  - **Control Bar**:
    - Search input (`placeholder="Search traders..."`, font-size `14px`, rounded-md)
    - Dynamic Trader Counter (`XXX of YYY traders`)
    - Theme Toggle Button (Moon/Sun icon)
    - Period Filters: Pill buttons `ALL`, `YTD`, `1M`, `1D`, `$5+`
    - Platform Filter Buttons:
      - Polymarket (Blue logo icon)
      - Kalshi (Green badge icon)
      - Hyperliquid / Myriad (Teal icon)
      - All (Pill button)
      - Opinion (Logo icon)
      - `𝕏 linked` (Filter traders with connected Twitter)
      - `No sports` (Exclude sports prediction markets)
      - `No esports` (Exclude esports prediction markets)
      - Metric sorting pills: `Sharpe`, `Win%`, `ROI`
    - Scoring Formula Legend: `Score = consistency 25% * returns 25% * win rate 20% * max loss 15% * profit factor 15% | Sharpe = return / volatility`
  - **Leaderboard Table**:
    - Columns: `#` (Rank), `[empty]` (Avatar), `Trader` (Name + Badges), `Joined` (Days active), `Score` (Custom weighted score), `P&L` (Net profit)
    - Row click navigation to `/account/:id`
  - **Footer**:
    - Social and site links: `𝕏 Our X`, `Get listed`, `Polymarket leaderboard`, `Kalshi leaderboard`, `Terms`
- **Screenshots**:
  - Desktop: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/home/desktop_1440x900.png)
  - Laptop: [`laptop_1366x768.png`](file:///e:/Replica/docs/reference-screenshots/home/laptop_1366x768.png)
  - Mobile: [`mobile_390x844.png`](file:///e:/Replica/docs/reference-screenshots/home/mobile_390x844.png)

---

### 2.2 Polymarket Leaderboard (`/polymarket`)
- **Route**: `https://predicting.top/polymarket`
- **Page Title**: `Polymarket Leaderboard — Top Polymarket Traders by Profit | predicting.top`
- **Meta Description**: `The Polymarket leaderboard: the most profitable Polymarket traders ranked by daily, weekly, monthly and all-time P&L, with wallets, X accounts, positions and P&L history.`
- **Visual Structure**:
  - Similar structure to `/`, pre-filtered exclusively for Polymarket traders.
  - Explanatory SEO content section below table: "About the Polymarket Leaderboard".
- **Screenshots**:
  - Desktop: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/polymarket/desktop_1440x900.png)
  - Laptop: [`laptop_1366x768.png`](file:///e:/Replica/docs/reference-screenshots/polymarket/laptop_1366x768.png)
  - Mobile: [`mobile_390x844.png`](file:///e:/Replica/docs/reference-screenshots/polymarket/mobile_390x844.png)

---

### 2.3 Kalshi Leaderboard (`/kalshi`)
- **Route**: `https://predicting.top/kalshi`
- **Page Title**: `Kalshi Leaderboard — Top 1,000 Kalshi Traders by Profit | predicting.top`
- **Meta Description**: `The Kalshi leaderboard: the top 1,000 Kalshi traders ranked by daily, weekly, monthly and all-time profit, tracked over time. Public, no Kalshi account needed.`
- **Visual Structure**:
  - **Header**: `H1` "Kalshi Leaderboard", Subtitle "The top 1,000 Kalshi traders, tracked over time", "All platforms" link button to `/`.
  - **Period Controls**: `ALL`, `1M`, `7D`, `1D`, `Non-sports`.
  - **Search**: `placeholder="Search Kalshi traders..."`.
  - **Table Structure**:
    - Columns: `#`, `[Avatar]`, `Trader` (Username + Twitter handle), `P&L` (Amount in USD).
    - Note: Score and Joined columns are absent on Kalshi-only table to match Kalshi's data availability.
  - **Pagination**: "Show more (XXX left)" button that appends 100 rows per click up to 1,000 total.
  - Explanatory SEO text: "About the Kalshi Leaderboard".
- **Screenshots**:
  - Desktop: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/kalshi/desktop_1440x900.png)
  - Laptop: [`laptop_1366x768.png`](file:///e:/Replica/docs/reference-screenshots/kalshi/laptop_1366x768.png)
  - Mobile: [`mobile_390x844.png`](file:///e:/Replica/docs/reference-screenshots/kalshi/mobile_390x844.png)

---

### 2.4 Battle of the Badges (`/battle`)
- **Route**: `https://predicting.top/battle`
- **Page Title**: `Battle of the Badges | predicting.top`
- **Meta Description**: `Polymarket vs Kalshi — compare flagged traders side by side on predicting.top.`
- **Visual Structure**:
  - **Header**: `H1` "Battle of the Badges", Subtitle "Polymarket vs Kalshi".
  - **Competitors Card**:
    - Left side: Polymarket trader avatar (blue ring), username (`@25usdc`), "Polymarket" label, Twitter link.
    - Center: "VS" divider label.
    - Right side: Kalshi trader avatar (green ring), username (`@PredMTrader`), "Kalshi" label, Twitter link.
  - **Relative Performance Card**:
    - Title: "Relative Performance"
    - Interactive Dual Line Chart comparing both traders' cumulative P&L since comparison baseline.
    - Legend: Blue line for Polymarket contender, Green line for Kalshi contender.
    - Y-Axis: Currency values (`+$725.6K`, `+$403.8K`, `+$153.8K`, `$-96.2K`).
    - X-Axis: Dates formatted as `Mon DD`.
    - Caption: "P/L change since comparison start date".
  - **Footer**: "Hosted by HiveLiveHQ" with honeycomb icon.
- **Screenshots**:
  - Desktop: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/battle/desktop_1440x900.png)
  - Laptop: [`laptop_1366x768.png`](file:///e:/Replica/docs/reference-screenshots/battle/laptop_1366x768.png)
  - Mobile: [`mobile_390x844.png`](file:///e:/Replica/docs/reference-screenshots/battle/mobile_390x844.png)

---

### 2.5 Public API Documentation (`/api-docs`)
- **Route**: `https://predicting.top/api-docs`
- **Page Title**: `Free Prediction Market API — Polymarket & Kalshi Trader Data | predicting.top`
- **Visual Structure**:
  - Top Navigation: `< Back` button (links to `/`), Theme toggle.
  - Header: `H1` "Public API", introduction text explaining zero-auth, CORS-enabled read access.
  - Quickstart Example Card: JavaScript `fetch()` sample with copy-to-clipboard button.
  - Endpoints List: Segmented cards for all 14 endpoints with `GET` badge, endpoint path, description, query params, "Try" live URL, and response fields.
- **Screenshots**:
  - Desktop: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/api-docs/desktop_1440x900.png)
  - Laptop: [`laptop_1366x768.png`](file:///e:/Replica/docs/reference-screenshots/api-docs/laptop_1366x768.png)
  - Mobile: [`mobile_390x844.png`](file:///e:/Replica/docs/reference-screenshots/api-docs/mobile_390x844.png)

---

### 2.6 Trader Profile Page (`/account/:id`)
- **Routes Tested**:
  - Polymarket EVM: `/account/0x5a218c7ad04135830a45c41aaed7294df7809318`
  - Kalshi User: `/account/ProbabilityDuck`
- **Page Title**: `[Trader Name] · [P&L Formatted] all-time | predicting.top`
- **Visual Structure**:
  - **Navigation Bar**: `< Leaderboard` button (returns to `/`), Theme toggle.
  - **Trader Overview Header**:
    - Large Circular Avatar (`w-16 h-16` / `64px`)
    - Trader Display Name (`H1`, `font-size: 24px`, bold)
    - Platform Badge (`Polymarket` blue badge / `Kalshi` green badge)
    - External Links: Platform Profile link, Twitter/𝕏 link
    - Metadata: "Joined [Mon Year]", View count (e.g. `3,000 views`)
    - Truncated EVM Address or Kalshi username
  - **Monthly Performance Bar**:
    - Month Selector: `< [Month Year] >`
    - Net Monthly P&L (colored green/red)
    - Win/Loss Record (e.g., `10W / 5L`)
    - Daily Win/Loss Streak Tiles (micro color-coded visual indicator)
  - **P&L History Section**:
    - Line chart of cumulative P&L over time with tooltip
  - **Kalshi-Exclusive Section — P&L by Category**:
    - Displayed when `platform === 'kalshi'` or categories data exists
    - Horizontal breakdown bars: Mentions, Elections, Companies, Entertainment, Economics, Sports, Politics
    - Category P&L values and number of markets traded
  - **Shareable Card Generators**:
    - "Share month + all-time" card
    - "Share P&L chart" card
    - "Share month" calendar card
    - Controls: `Light` / `Black` theme toggle, `Share` (Web Share API), `Copy image` (clipboard PNG), `Download`, `Post on X`
- **Screenshots**:
  - Polymarket Profile: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/profile_polymarket/desktop_1440x900.png), [`laptop_1366x768.png`](file:///e:/Replica/docs/reference-screenshots/profile_polymarket/laptop_1366x768.png), [`mobile_390x844.png`](file:///e:/Replica/docs/reference-screenshots/profile_polymarket/mobile_390x844.png)
  - Kalshi Profile: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/profile_kalshi/desktop_1440x900.png), [`laptop_1366x768.png`](file:///e:/Replica/docs/reference-screenshots/profile_kalshi/laptop_1366x768.png), [`mobile_390x844.png`](file:///e:/Replica/docs/reference-screenshots/profile_kalshi/mobile_390x844.png)

---

### 2.7 Submission Page (`/submit`)
- **Route**: `https://predicting.top/submit`
- **Page Title**: `Get Listed — Submit Your Polymarket or Kalshi Account | predicting.top`
- **Visual Structure**: Form allowing traders to request tracking or link their Twitter/Polymarket/Kalshi identities.
- **Screenshots**: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/submit/desktop_1440x900.png)

---

### 2.8 Terms Page (`/terms`)
- **Route**: `https://predicting.top/terms`
- **Page Title**: `Terms of Service | predicting.top`
- **Visual Structure**: Standard legal text, liability disclaimers, API usage policies.
- **Screenshots**: [`desktop_1440x900.png`](file:///e:/Replica/docs/reference-screenshots/terms/desktop_1440x900.png)


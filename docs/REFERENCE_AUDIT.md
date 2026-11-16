# Reverse Engineering Audit: Predicting.top

## 1. Executive Summary

This document presents the complete technical and visual reverse-engineering audit of **[predicting.top](https://predicting.top/)**, conducted on November 15, 2026. 

The reference site is a prediction market intelligence platform and trader leaderboard that aggregates real-time and historical Profit & Loss (P&L), trading activity, win rates, Sharpe ratios, and portfolio positions across **Polymarket**, **Kalshi**, and auxiliary prediction markets (**Hyperliquid**, **Myriad**, **Opinion**).

### Technology Stack Identified
- **Frontend Architecture**: Single Page Application (SPA) built with React / Vite, using client-side hydration over static HTML shells with pre-rendered SEO metadata.
- **Styling Engine**: Tailwind CSS with custom CSS variables matching `shadcn/ui` (Radix UI primitives). Dark mode is the default (`<html lang="en" class="dark">`), with a client-side theme toggle to a light surface palette.
- **Typography**: Primary typeface `Poppins`, Monospace `Menlo, monospace`, System fallbacks `system-ui, Arial, Helvetica, sans-serif`.
- **Iconography**: Inline SVGs and Lucide-react icons (Sun, Moon, ChevronDown, ExternalLink, Copy, Check, Twitter/𝕏, Info).
- **Charting**: SVG-based responsive line charts and horizontal category distribution bars with smooth bezier curves and custom hover tooltips.
- **Analytics & Tracking**: Google Tag Manager (`G-93TYW3C6G5`), PostHog analytics (`https://us.i.posthog.com`).
- **Backend & Data**: Public REST API served directly from the same origin under `/api/*`, offering CORS-enabled, read-only JSON responses without API key requirements.

---

## 2. Audit Methodology

The audit was executed using automated Chrome DevTools Protocol (CDP) instrumentation, headless Chromium execution, network telemetry extraction, live API fuzzing/probing, and computed DOM style extraction across three target viewports:

1. **Desktop**: 1440 x 900 px
2. **Laptop**: 1366 x 768 px
3. **Mobile**: 390 x 844 px (iPhone 14 / modern smartphone standard)

All reference screenshots have been captured and systematically cataloged under [`docs/reference-screenshots/`](file:///e:/Replica/docs/reference-screenshots).

---

## 3. Core Architectural Findings

### 3.1 SPA Routing & Client-Side State
The site uses client-side routing (HTML5 History API) with the following registered routes:
- `/` — Combined Cross-Platform Leaderboard
- `/polymarket` — Polymarket Specific Leaderboard
- `/kalshi` — Kalshi Top 1,000 Leaderboard
- `/battle` — Battle of the Badges (Head-to-head comparison)
- `/api-docs` — Public API Documentation & Playground
- `/account/:wallet-or-username` — Unified Trader Profile (handles both EVM 0x addresses and Kalshi usernames)
- `/submit` — Get Listed Entry Submission form
- `/terms` — Terms of Service

### 3.2 Server-Side Pre-rendering & SEO
While the tables and charts are dynamically rendered on the client, each page is delivered with complete, high-fidelity `<title>`, `<meta name="description">`, OpenGraph tags (`og:title`, `og:description`, `og:image`), and static navigational links to top traders in the raw HTML to maximize search engine indexing and social link unfurls.

### 3.3 Data Layer & API Architecture
The application is backed by an internal aggregation engine that crawls and snapshots Polymarket smart contracts and Kalshi APIs. Key characteristics:
- **No Authentication**: All leaderboard, trader, category, and market endpoints are publicly accessible without authentication tokens or cookies.
- **CORS Support**: `access-control-allow-origin: *` is present on all `/api/*` endpoints.
- **Rate Limiting**: Monitored via standard headers (`X-RateLimit-Limit: 60-120`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).
- **High Payload Density**: The full `/api/leaderboard` returns an array of ~785 traders (~680 KB JSON), and `/api/p/overview` returns ~3,137 positions (~2.69 MB JSON). Client-side caching and state management are critical for performance.

---

## 4. Visual & Structural Specifications Summary

| Feature | Specification |
| :--- | :--- |
| **Theme Default** | Dark (`hsl(0, 0%, 7%)` / `#121212`) |
| **Light Theme** | Light surface (`#f0f0f0` background, `#1a1a1a` text) |
| **Max Content Width** | `896px` (`max-w-4xl`) on leaderboards & profiles; `768px` (`max-w-2xl`) on API docs |
| **Corner Radius** | `--radius: 0.8rem` (12.8px), buttons `rounded-md` (6-8px), pills `rounded-full` |
| **Shadows** | All shadows explicitly disabled (`box-shadow: none !important`) |
| **PnL Colors** | Positive: `rgb(34, 197, 94)` / `#22c55e`; Negative: `rgb(239, 68, 68)` / `#ef4444` |
| **Leaderboard Row Height** | Home/Polymarket: `57px`; Kalshi: `49px` |
| **Font Family** | `Poppins, system-ui, Arial, Helvetica, sans-serif` |
| **Monospace Font** | `Menlo, monospace` (used for addresses, code, numbers) |

---

## 5. Audit Evidence Directory

All reference screenshots captured during the audit are organized as follows:

```
docs/reference-screenshots/
├── home/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── polymarket/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── kalshi/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── battle/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── api-docs/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── profile_polymarket/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── profile_kalshi/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── submit/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
├── terms/
│   ├── desktop_1440x900.png
│   ├── laptop_1366x768.png
│   └── mobile_390x844.png
└── interactions/
    ├── 01_home_initial.png
    ├── 02_search_react_duck.png
    ├── 03_period_1M.png
    ├── 04_filter_kalshi.png
    └── 05_light_mode.png
```


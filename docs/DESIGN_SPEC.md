# Design Specification: Predicting.top

This document defines the exact visual design system, CSS design tokens, typography, component geometry, color scales, and responsive behaviors extracted from `predicting.top`.

---

## 1. Color System

The application implements a dual-theme architecture powered by CSS custom properties. Dark mode is the primary default experience.

### 1.1 Theme Surface Tokens

| Token Name | Dark Mode (Default) | Light Mode | Description |
| :--- | :--- | :--- | :--- |
| `--background` | `hsl(0, 0%, 7%)` (`#121212`) | `#f0f0f0` | Main canvas background |
| `--foreground` | `hsl(0, 0%, 93%)` (`#EDEDED`) | `#1a1a1a` | Primary text color |
| `--card` | `hsl(0, 0%, 10%)` (`#1A1A1A`) | `#fcfcfc` | Container & card surfaces |
| `--card-foreground` | `hsl(0, 0%, 90%)` (`#E5E5E5`) | `hsl(0, 0%, 0%)` | Card body text |
| `--popover` | `hsl(0, 0%, 7%)` (`#121212`) | `hsl(45, 25%, 97%)` | Dropdown & tooltip surfaces |
| `--popover-foreground` | `hsl(0, 0%, 93%)` (`#EDEDED`) | `hsl(0, 0%, 100%)` | Tooltip & popover text |
| `--primary` | `hsl(0, 0%, 100%)` (`#FFFFFF`) | `#000000` | Primary buttons & active accents |
| `--primary-foreground` | `hsl(0, 0%, 0%)` (`#000000`) | `#ffffff` | Text on primary elements |
| `--secondary` | `hsl(0, 0%, 20%)` (`#333333`) | `#c4c4c4` | Secondary button backgrounds |
| `--secondary-foreground` | `hsl(0, 0%, 93%)` (`#EDEDED`) | `#1a1a1a` | Secondary button text |
| `--muted` | `hsl(0, 0%, 15%)` (`#262626`) | `#e3e3e3` | Subtle backgrounds, dividers |
| `--muted-foreground` | `hsl(0, 0%, 55%)` (`#8C8C8C`) | `#212121` | Subtitles, labels, inactive tabs |
| `--accent` | `hsl(0, 0%, 18%)` (`#2E2E2E`) | `hsl(0, 0%, 100%)` | Hover states and active item highlights |
| `--border` | `hsl(0, 0%, 18%)` (`#2E2E2E`) | `#e8e8e8` | Component and table borders |
| `--input` | `hsl(0, 0%, 15%)` (`#262626`) | `#b5b5b5` | Input field borders & backgrounds |
| `--ring` | `hsl(0, 0%, 40%)` (`#666666`) | `hsl(0, 0%, 41.96%)` | Focus ring color |

### 1.2 Financial & Metric Indicator Colors

- **Positive P&L (Profit)**: `rgb(34, 197, 94)` / `#22c55e` (Tailwind `green-500`)
- **Negative P&L (Loss)**: `rgb(239, 68, 68)` / `#ef4444` (Tailwind `red-500`)
- **Neutral / Zero P&L**: `rgb(140, 140, 140)` / `#8c8c8c` (Tailwind `zinc-500`)

### 1.3 Smart Score Color Tiers

The Smart Score (0–100) reflects trader quality based on consistency, returns, win rate, max loss, and profit factor:
- **Elite (Score ≥ 70)**: `#22c55e` (Green)
- **Proficient (Score 40 – 69.9)**: `#f97316` / `#eab308` (Amber / Orange)
- **Poor / At Risk (Score < 40)**: `#ef4444` (Red)
- **Uncalculated / Insufficient Data**: `–` in `#8c8c8c` (Muted Gray)

### 1.4 Platform Brand Accents

- **Polymarket**: `#3b82f6` (Blue badge pill, blue icon)
- **Kalshi**: `#10b981` (Emerald green badge pill, green text)
- **Hyperliquid / Myriad**: `#14b8a6` (Teal badge)
- **Opinion**: `#8b5cf6` (Purple icon)
- **Twitter / 𝕏**: `#000000` (Dark) / `#ffffff` (Inverted)

---

## 2. Typography Specification

### 2.1 Font Families
- **Primary Body & Headings**: `Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace (Numbers, Wallets, Codes)**: `Menlo, "SF Mono", Monaco, Consolas, "Liberation Mono", monospace`

### 2.2 Hierarchy & Scale

| Role | Font Size | Line Height | Weight | Letter Spacing | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title (H1 Desktop)** | `28px` (`1.75rem`) | `36px` (`2.25rem`) | `700` (Bold) | `-0.02em` | Poppins |
| **Page Title (H1 Mobile)** | `22px` (`1.375rem`)| `28px` (`1.75rem`) | `700` (Bold) | `-0.01em` | Poppins |
| **Section Header (H2)** | `20px` (`1.25rem`)  | `28px` (`1.75rem`) | `600` (SemiBold) | `-0.01em` | Poppins |
| **Card Header (H3)** | `15px` (`0.9375rem`)| `22px` (`1.375rem`)| `600` (SemiBold) | `0em` | Poppins |
| **Subtitle / Meta Text** | `14px` (`0.875rem`) | `20px` (`1.25rem`) | `400` (Normal) | `0em` | Poppins |
| **Timestamp / Micro Caption**| `12px` (`0.75rem`)| `16px` (`1rem`) | `400` (Normal) | `0em` | Poppins |
| **Table Column Header** | `13px` (`0.8125rem`)| `16px` (`1rem`) | `600` (SemiBold) | `0.04em` | Poppins |
| **Leaderboard Trader Name** | `15px` (`0.9375rem`)| `20px` (`1.25rem`)| `500` (Medium) | `0em` | Poppins |
| **Table P&L & Score** | `15px` (`0.9375rem`)| `20px` (`1.25rem`)| `600` (SemiBold) | `0em` | Menlo (Tabular) |
| **Category Subtext (Table)**| `11px` (`0.6875rem`)| `14px` (`0.875rem`)| `400` (Normal) | `0em` | Poppins |
| **Code Block / API Params** | `13px` (`0.8125rem`)| `18px` (`1.125rem`)| `400` (Normal) | `0em` | Menlo |

---

## 3. Layout, Dimensions & Spacing

### 3.1 Container System
- **Main Container Width**: `896px` (`max-w-4xl`) on home, leaderboards, and profile pages.
- **Documentation Container Width**: `768px` (`max-w-2xl`) on `/api-docs`.
- **Horizontal Page Gutter**: `16px` (`px-4`) on mobile, `24px` (`px-6`) on desktop.
- **Vertical Spacing**: `24px` (`py-6`) to `32px` (`py-8`) between major blocks.

### 3.2 Leaderboard Table Geometry
- **Table Width**: `100%` of container (`896px` desktop).
- **Row Heights**:
  - Combined / Polymarket Leaderboard: `57px` per row.
  - Kalshi Leaderboard: `49px` per row.
  - Table Header Row: `40px`.
- **Column Alignments & Widths (Desktop 1440px / 896px container)**:
  - `#` (Rank): Width `48px`, Left aligned.
  - `[Avatar]`: Width `40px` (or combined into Trader column), Centered.
  - `Trader`: Width `240px` - `260px`, Left aligned.
  - `Joined`: Width `64px`, Left aligned (Days active e.g., `319d`).
  - `Score`: Width `80px` - `100px`, Center aligned.
  - `P&L`: Width `200px` - `240px`, Right aligned.

### 3.3 Border Radii & Shadows
- **Base Border Radius**: `--radius: 0.8rem` (`12.8px`).
- **Cards**: `rounded-xl` (`12px` - `14px`).
- **Input Fields**: `rounded-md` (`6px` - `8px`).
- **Filter Pills**: `rounded-full` (`9999px`) or `rounded-md` (`6px`).
- **Avatars**: `rounded-full` (`50%`).
- **Shadows**: Disabled across all elements (`box-shadow: none !important`), enforcing a modern flat-surface design.

---

## 4. Responsive Transformation Rules

### 4.1 Mobile Viewport (≤ 768px, tested at 390 x 844)
1. **Header Reflow**:
   - Title, subtitle, timestamp, and "Today: +$XXX" stack vertically instead of flexing horizontally.
   - "Today: +$XXX" moves below the timestamp as a prominent line item.
2. **Control Bar Stacking**:
   - Search bar expands to `width: 100%`.
   - Trader count and theme toggle align below search input.
   - Period filter pills (`ALL`, `YTD`, `1M`, `1D`, `$5+`) stay in one horizontal scrollable/wrap line.
   - Platform filters wrap into two rows.
3. **Table Column Hiding**:
   - The `Joined` column is completely hidden on mobile (`display: none` / `hidden md:table-cell`).
   - Trader name truncates with text ellipsis after ~12 characters (e.g. `norris...`).
   - Table displays exactly 4 columns: `#`, `Trader`, `Score`, `P&L`.
4. **Card Adjustments on Profiles**:
   - Calendar grid and chart in "Share month + all-time" card stack vertically instead of side-by-side.
   - Action buttons (`Share`, `Copy image`, `Download`) become full-width or wrap evenly.

### 4.2 Laptop Viewport (1024px – 1366px, tested at 1366 x 768)
- Maintains exact same 5-column layout as Desktop 1440px.
- Main content remains cleanly centered within the `896px` container with proportional side margins.


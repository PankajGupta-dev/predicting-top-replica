# Known Gaps & Technical Risk Assessment: Predicting.top

This document identifies architectural variances, edge cases, data availability gaps, and implementation risks discovered during the reverse-engineering audit.

---

## 1. Data Availability & Schema Nuances

### 1.1 Polymarket vs. Kalshi Data Discrepancy
- **Polymarket Traders**: Identified by Polygon EVM addresses (`0x...`). They possess granular open positions (`/api/trader/{wallet}/positions`) and recent trade transactions (`/api/trader/{wallet}/trades`), as well as USDC balances.
- **Kalshi Traders**: Identified by exchange usernames (e.g., `ProbabilityDuck`). They do not expose individual raw smart-contract transactions; instead, predicting.top provides category-level P&L breakdowns (`/api/kalshi/{username}/categories`) and periodic snapshot history (`/api/kalshi/{username}/history`).
- **Implementation Strategy**: The unified profile component (`/account/:id`) must inspect whether the trader is a Polymarket wallet (starts with `0x` or `platform === "polymarket"`) or a Kalshi trader, conditionally rendering the respective detail modules (Positions/Trades vs. Category Breakdown).

### 1.2 Rate Limits & Caching Strategy
- **Upstream Limits**: The predicting.top public API enforces strict rate limits per IP:
  - `60 req/min` on single trader endpoints.
  - `120 req/min` on leaderboard and positions endpoints.
- **Risk**: If the replica executes live client-side fetches directly to predicting.top on every page navigation, high user traffic will immediately trigger HTTP 429 (Too Many Requests).
- **Required Mitigation**:
  - Implement Next.js App Router Server Actions or Route Handlers with Incremental Static Regeneration (ISR) and `revalidate` caching (e.g. 60 seconds for leaderboards, 300 seconds for trader profiles).
  - Use in-memory or Redis caching in server layers so user requests do not trigger upstream rate limits.

### 1.3 High Payload Sizes
- `GET /api/leaderboard`: ~682 KB JSON (~785 complete trader records).
- `GET /api/p/overview`: ~2.69 MB JSON (~3,137 positions).
- **Mitigation**: Implement server-side pagination, compression, and lightweight response transformation before client hydration.

---

## 2. Media, Avatars & External Asset Handling

### 2.1 Next.js Image Optimization Domains
Avatars and icons originate from multiple external origins:
- `https://polymarket-upload.s3.us-east-2.amazonaws.com` (Polymarket PFPs)
- `https://pbs.twimg.com` (Twitter profile pictures)
- `/api/kalshi-avatar/{username}` (Internal Kalshi avatar proxy)
- `https://predicting.top`
- **Mitigation**: Configure `remotePatterns` in `next.config.ts` to allow all required origins, and provide fallback SVG placeholders for dead or broken external avatar URLs.

### 2.2 Dynamic Share Card Generation
- The reference site offers live PNG generation and clipboard copy for:
  1. Month + All-Time Card (Calendar + Chart)
  2. P&L History Chart Card
  3. Monthly Calendar Card
- **Risk**: Native `html2canvas` or DOM-to-image conversions can fail due to CORS taint from external avatar images.
- **Mitigation**:
  - Implement client-side Canvas rendering where image assets are proxied through an internal Next.js API route to prevent canvas security tainting.
  - Leverage `navigator.clipboard.write` with fallback to direct image download for browsers that restrict clipboard PNG writing.

---

## 3. Platform Integrations & Auxiliary Markets

- **Myriad, Hyperliquid, and Opinion**: The leaderboard includes traders with flags and identifiers for Myriad (`myriad_username`), Opinion (`opinion_wallet`), and Hyperliquid. Their volume is tracked in the main dataset, but individual dedicated tabs exist primarily for Polymarket and Kalshi.
- **The Battle Route (`/battle`)**: In the current live reference, this route displays a curated, featured head-to-head match (`@25usdc` vs `@PredMTrader`). An arbitrary trader selector is not currently exposed on the public route.

---

## 4. Analytics & Referral Endpoints

- Calls to `/api/referral/visit` and `/api/referral/qualify` are proprietary telemetry hooks used by predicting.top for affiliate tracking. In the replica, these can be safely stubbed or wired to local analytics without affecting core user experience or data presentation.


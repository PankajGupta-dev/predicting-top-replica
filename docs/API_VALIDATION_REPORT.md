# API Validation Report: Predicting.top

## 1. Executive Summary

This report documents the live empirical validation of all public and internal API endpoints powering **[predicting.top](https://predicting.top/)**, executed on November 15, 2026.

All requests were safe, read-only HTTP `GET` requests issued with realistic browser `User-Agent` headers. Actual response payloads, status codes, rate-limit headers, field types, and nullability profiles were captured and recorded into [`scratch/api_validation/`](file:///e:/Replica/scratch/api_validation).

---

## 2. Global Protocol & Header Findings

- **Base URL**: `https://predicting.top`
- **Transport**: HTTPS (HTTP/2 enabled)
- **CORS Support**: `access-control-allow-origin: *` is present on all endpoints, allowing browser fetch without proxying.
- **Error Format**: When an endpoint encounters an invalid parameter or missing entity, it returns a standard JSON object with a **`message`** string field:
  ```json
  {
    "message": "Trader not found"
  }
  ```
- **Rate Limit Headers**:
  - `x-ratelimit-limit`: `60` to `120` requests per minute depending on route.
  - `x-ratelimit-remaining`: Decrementing integer counter.
  - `x-ratelimit-reset`: ISO 8601 timestamp of counter reset window.

---

## 3. Endpoint-by-Endpoint Validation Results

### 3.1 Combined Leaderboard (`/api/leaderboard`)

- **URL Pattern**: `GET /api/leaderboard?period={period}`
- **Test Invocations**:
  - `period=all` -> Status `200 OK` (Payload size: `965 KB`, ~785 items)
  - `period=1d` -> Status `200 OK` (Payload size: `754 KB`, ~785 items)
  - `period=invalid_xyz` -> Status `400 Bad Request` -> `{"message": "Invalid period parameter"}`
- **Rate Limit**: 120 req/min (`x-ratelimit-limit: 120`)
- **Observed Schema**:
  ```json
  {
    "traders": [ ... ],
    "lastUpdated": "2026-11-15T13:01:56.755Z"
  }
  ```
- **Field Analysis & Nullability (`traders[i]`)**:
  | Field | Type | Nullable | Example / Notes |
  | :--- | :--- | :--- | :--- |
  | `rank` | `number` | No (0%) | `1`, `2`, `3` |
  | `name` | `string` | No (0%) | `"RN1"`, `"balthazar"`, `"ProbabilityDuck"` |
  | `wallet` | `string \| null` | **Yes (53.0%)** | Present for Polymarket (`0x...`), null for Kalshi |
  | `additional_wallets` | `string[]` | No (0%) | Array of secondary linked EVM addresses |
  | `wallet_count` | `number` | No (0%) | `1`, `2`, `0` |
  | `twitter` | `string` | No (0%) | URL to X profile e.g. `"https://x.com/RN1polymarket"` |
  | `pfp` | `string` | No (0%) | URL to avatar image (S3, Twimg, or avatar proxy) |
  | `polynoob_story` | `string` | No (0%) | Descriptive text or empty string `""` |
  | `polymarket_profile`| `string \| null`| **Yes (0.5%)** | Polymarket profile URL |
  | `platform` | `string` | No (0%) | `"polymarket"`, `"kalshi"`, `"hyperliquid"`, `"opinion"` |
  | `kalshi_profile` | `string` | No (0%) | Empty string `""` or Kalshi URL |
  | `kalshi_username`| `string \| null`| **Yes (38.0%)** | Username on Kalshi exchange |
  | `myriad_profile` | `string` | No (0%) | Profile link or empty string |
  | `myriad_username`| `null` | **Always null** | Reserved field |
  | `opinion_wallet` | `string \| null`| **Yes (98.5%)** | EVM address for Opinion markets |
  | `opinion_profile`| `string` | No (0%) | Opinion profile URL |
  | `hyperliquid_profile` | `string` | No (0%) | Hyperliquid explorer URL |
  | `allTimePnl` | `number` | No (0%) | All-time profit/loss in USD float |
  | `join_date` | `string \| null` | **Yes (1.5%)** | Format `YYYY-MM-DD` |
  | `smart_score` | `object \| null`| **Yes (3.0%)** | Detailed score object (tier, score, winRate, sharpeRatio) |
  | `roi` | `number` | No (0%) | Float ROI percentage (e.g. `0.0179` = 1.79%) |
  | `sports_share` | `number` | No (0%) | Float between 0.0 and 1.0 (share of volume in sports) |
  | `esports_share` | `number` | No (0%) | Float between 0.0 and 1.0 |
  | `stats` | `object` | No (0%) | `{ "pnl": number, "buys": number, "sells": number }` |

---

### 3.2 Compact Embed Leaderboard (`/api/embed/leaderboard`)

- **URL Pattern**: `GET /api/embed/leaderboard?period={period}`
- **Test Invocations**:
  - `period=all` -> Status `200 OK` (Payload size: `324 KB`, 785 items)
- **Rate Limit**: 120 req/min
- **Observed Item Fields**:
  - `rank` (number)
  - `name` (string)
  - `pnl` (number)
  - `pfp` (string URL)
  - `profile_url` (string URL)
  - `platform` (string)
  - `smart_score` (number | null)
  - `win_rate` (number | null)
  - `sharpe_ratio` (number | null)

---

### 3.3 Kalshi Leaderboard (`/api/kalshi-leaderboard`)

- **URL Pattern**: `GET /api/kalshi-leaderboard?period={period}&limit={limit}`
- **Test Invocations**:
  - `period=all&limit=5` -> Status `200 OK`
  - `period=1d&limit=5` -> Status `200 OK`
- **Rate Limit**: 120 req/min
- **Observed Root Schema**:
  ```json
  {
    "period": "all",
    "total": 7634,
    "tracked": 1000,
    "lastUpdated": "2026-11-15T13:02:03.419Z",
    "traders": [ ... ]
  }
  ```
- **Observed Item Fields (`traders[i]`)**:
  - `rank` (number, 1-based)
  - `kalshi_username` (string, e.g. `"final.lamb3899"`)
  - `name` (string)
  - `pfp` (string, e.g. `"/api/kalshi-avatar/final.lamb3899"`)
  - `profile_path` (string | null, e.g. `"/account/dogname"` or `null`)
  - `kalshi_url` (string, e.g. `"https://kalshi.com/ideas/profiles/..."`)
  - `pnl` (number, float or int)
  - `pnl_all` (number)
  - `tracked` (boolean, `true`)
  - `sports_share` (number, 0 to 1)
  - `x_handle` (string | null)
  - `last_synced_at` (ISO 8601 timestamp)

---

### 3.4 Trader Profile (`/api/trader/{id}`)

- **Test Invocations**:
  - Polymarket wallet `0x5a218...` (`balthazar`) -> Status `200 OK`
  - Polymarket wallet `0x2005d...` (`RN1`) -> Status `200 OK`
  - Kalshi handle `ProbabilityDuck` -> Status `200 OK`
  - Non-existent handle `nonexistent_trader_99999` -> Status `404 Not Found` -> `{"message": "Trader not found"}`
  - Kalshi handle `final.lamb3899` -> Status `404 Not Found` -> `{"message": "Trader not found"}` (Highlights that not all 1,000 Kalshi leaderboard entries have detailed individual profiles synced).
- **Rate Limit**: 60 req/min
- **Observed Schema**:
  ```json
  {
    "trader": {
      "name": "balthazar",
      "wallet": "0x5a218c7ad04135830a45c41aaed7294df7809318",
      "additional_wallets": [],
      "wallet_count": 1,
      "twitter": "https://x.com/balthazarpoly",
      "pfp": "https://polymarket-upload.s3.us-east-2.amazonaws.com/profile-image...",
      "polynoob_story": "",
      "polymarket_profile": "https://polymarket.com/profile/0x5a21...",
      "platform": "polymarket",
      "kalshi_profile": "",
      "kalshi_username": null,
      "myriad_profile": "",
      "myriad_username": null,
      "opinion_wallet": null,
      "opinion_profile": "",
      "usdc_balance": 18274.52,
      "portfolio_value": 349120.88,
      "stats": {
        "1d": { "pnl": 5177.46, "buys": 0, "sells": 0 },
        "7d": { "pnl": -102294.28, "buys": 0, "sells": 0 },
        "30d": { "pnl": 3637.74, "buys": 0, "sells": 0 },
        "all": { "pnl": 1111673.82, "buys": 0, "sells": 0 }
      },
      "views": 3000,
      "largest_win": "0.000000",
      "join_date": "2025-01-10T15:26:05.000Z",
      "smart_score": {
        "tier": "Good",
        "score": 58.5,
        "winRate": 0.648,
        "sharpeRatio": 0.95,
        "maxDrawdownPercent": 1,
        "profitFactor": 1.91,
        "rSquared": 0.6476
      }
    }
  }
  ```

---

### 3.5 Trader Open Positions (`/api/trader/{wallet}/positions`)

- **URL Pattern**: `GET /api/trader/{wallet}/positions?limit={limit}`
- **Test Invocations**:
  - Polymarket wallet `0x5a218...` -> Status `200 OK`
  - Kalshi handle `ProbabilityDuck` -> Status `400 Bad Request` -> `{"message": "Invalid wallet address"}`
- **Rate Limit**: 120 req/min
- **Observed Item Fields (`positions[i]`)**:
  - `id`: string (market token ID)
  - `market`: string (market question title)
  - `outcome`: string (`"Yes"` | `"No"`)
  - `outcome_short`: string (`"Y"` | `"N"`)
  - `size`: number (shares held)
  - `size_formatted`: string (e.g. `"24,000.0"`)
  - `avg_price`: number (e.g. `0.5`)
  - `avg_price_formatted`: string (e.g. `"$0.500"`)
  - `current_price`: number
  - `cash_pnl`: number
  - `percent_pnl`: number
  - `pnl_formatted`: string (e.g. `"+83.0%"`)
  - `cash_pnl_formatted`: string (e.g. `"+$9,960.00"`)
  - `initial_value`: number
  - `current_value`: number
  - `current_value_formatted`: string
  - `redeemable`: boolean
  - `slug`: string
  - `event_slug`: string
  - `polymarket_url`: string
  - `icon`: string (market icon URL)
  - `end_date`: string (ISO 8601 or date string)

---

### 3.6 Trader Trade History (`/api/trader/{wallet}/trades`)

- **URL Pattern**: `GET /api/trader/{wallet}/trades?limit={limit}`
- **Test Invocations**:
  - Polymarket wallet `0x5a218...` -> Status `200 OK` (Array of trades)
  - Kalshi handle `ProbabilityDuck` -> Status `400 Bad Request` -> `{"message": "Invalid wallet address"}`
- **Rate Limit**: 120 req/min
- **Observed Item Fields (`trades[i]`)**:
  - `id`: string (transaction hash)
  - `time`: string (e.g. `"2m ago"`, `"1h ago"`)
  - `market`: string (market title)
  - `type`: string (`"buy"` | `"sell"`)
  - `type_short`: string (`"B"` | `"S"`)
  - `amount`: number (cash volume)
  - `pnl`: number
  - `transaction_hash`: string
  - `outcome`: string (`"Yes"` | `"No"`)
  - `outcome_short`: string (`"Y"` | `"N"`)
  - `price`: number (execution price per share)
  - `shares_amount`: number
  - `total_formatted`: string (e.g. `"$58.92"`)
  - `slug`: string
  - `event_slug`: string
  - `polymarket_url`: string
  - `icon`: string

---

### 3.7 Kalshi Trader P&L History (`/api/kalshi/{username}/history`)

- **URL Pattern**: `GET /api/kalshi/{username}/history`
- **Test Invocations**:
  - Kalshi handle `ProbabilityDuck` -> Status `200 OK` (2,035 snapshot data points, `238 KB`)
  - Polymarket wallet `0x5a218...` -> Status `200 OK` -> `{"history": []}` (Empty array, does not 404)
- **Rate Limit**: 100 req/min
- **Observed Schema**:
  ```json
  {
    "history": [
      {
        "timestamp": 1758896732000,
        "pnl": 90139.43,
        "date": "2025-09-26T14:25:32.000Z"
      }
    ],
    "dataPoints": 2035,
    "firstDate": "2025-09-26T14:25:32.000Z",
    "lastDate": "2026-11-15T12:26:20.613Z"
  }
  ```

---

### 3.8 Kalshi Category Breakdown (`/api/kalshi/{username}/categories`)

- **URL Pattern**: `GET /api/kalshi/{username}/categories`
- **Test Invocations**:
  - Kalshi handle `ProbabilityDuck` -> Status `200 OK` (14 categories)
  - Polymarket wallet `0x5a218...` -> Status `404 Not Found` -> `{"message": "Trader not found"}`
- **Rate Limit**: 120 req/min
- **Observed Schema**:
  ```json
  {
    "categories": [
      {
        "category": "Mentions",
        "pnl": 323247.03,
        "markets": 1859
      },
      {
        "category": "Elections",
        "pnl": 272740.15,
        "markets": 114
      }
    ]
  }
  ```

---

### 3.9 Market Insights (`/api/m/insights`)

- **URL Pattern**: `GET /api/m/insights?period={period}&limit={limit}`
- **Test Invocations**:
  - `period=24h&limit=5` -> Status `200 OK` (Payload size: `25.7 KB`)
  - `period=1h&limit=5` -> Status `200 OK` (Payload size: `8.7 KB`)
- **Rate Limit**: 120 req/min
- **Observed Item Fields (`markets[i]`)**:
  - `market`: string (market name)
  - `totalVolume`: number
  - `buyVolume`: number
  - `sellVolume`: number
  - `yesVolume`: number
  - `noVolume`: number
  - `netInflow`: number
  - `tradeCount`: number
  - `uniqueTraders`: number
  - `icon`: string
  - `polymarket_url`: string
  - `eventSlug`: string
  - `topTraders`: array of `{ "name": string, "wallet": string }`
  - `endDate`: string
  - `yesPrice`: number | null
  - `noPrice`: number | null

---

### 3.10 Daily Profit Aggregate (`/api/daily-profit`)

- **URL Pattern**: `GET /api/daily-profit`
- **Test Invocations**: Status `200 OK`
- **Rate Limit**: 100 req/min
- **Observed Schema**:
  ```json
  {
    "daily_profit": "+$434,523",
    "raw": 434523,
    "traders_count": 797
  }
  ```

---

### 3.11 Cross-Trader Open Positions (`/api/p/overview`)

- **URL Pattern**: `GET /api/p/overview`
- **Observed Characteristics**:
  - Large aggregation payload: `2.69 MB JSON` containing `3,137` active positions across all tracked traders.
  - Can take 15–25 seconds to generate on cold start.
  - Requires dedicated server-side caching and background ISR revalidation in the replica.


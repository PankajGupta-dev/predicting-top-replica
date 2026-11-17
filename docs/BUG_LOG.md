# Comprehensive Bug Log & Post-Mortem Registry

**Project**: Predicting.top Replica  
**Maintenance Scope**: Full-Stack Next.js 15 App Router  

---

## Bug Summary Index

| Bug ID | Severity | Area | Status | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | High | SSG / Data Layer | **RESOLVED** | Next.js prerender build failure when offline (`getaddrinfo ENOTFOUND`) |
| **BUG-002** | Low | UI / Navigation | **RESOLVED** | Redundant back navigation button duplicated on profile header |
| **BUG-003** | Medium | TypeScript / Lib | **RESOLVED** | TypeScript TS2554 parameter mismatch on `truncateAddress` |
| **BUG-004** | High | UI / State Logic | **RESOLVED** | Initial render counter desynchronization on user entry limit selection |
| **BUG-005** | Medium | UX / Hydration | **RESOLVED** | Chrome form autofill restoring dropdown visually while React state stayed default |
| **BUG-006** | Critical | DevOps / Vercel | **RESOLVED** | `EBADPLATFORM` failure on Linux during Vercel deployment due to direct Windows SWC dependency |

---

## Detailed Post-Mortem Entries

### BUG-001: Next.js Prerender Build Failure When Offline
- **Severity**: High (Blocked production compilation)
- **Symptom**:
  ```text
  Error: getaddrinfo ENOTFOUND predicting.top
  at HomePage (app/page.tsx:28)
  Build failed because of webpack errors
  ```
- **Root Cause**:
  Next.js 15 App Router executes Server Component data-fetching functions during `next build` to pre-render static HTML. In sandboxed local environments without outbound network access, DNS resolution for `predicting.top` threw `ENOTFOUND`.
- **Resolution**:
  1. Added a client-side `useEffect` fallback inside [`LeaderboardView.tsx`](file:///e:/Replica/components/leaderboard/LeaderboardView.tsx) to detect if initial SSR data is empty, automatically hydrating from `/api/proxy/*` on client mount.
  2. Executed production builds with network access enabled to generate static pre-rendered snapshots with live upstream data.
- **Prevention**: Always decouple SSR initial state from client hydration using graceful empty array fallbacks.

---

### BUG-002: Redundant Back Navigation Button on Profile Header
- **Severity**: Low (Visual duplication)
- **Symptom**:
  Both the universal [`NavigationHeader.tsx`](file:///e:/Replica/components/layout/NavigationHeader.tsx) and the [`ProfileHeader.tsx`](file:///e:/Replica/components/profile/ProfileHeader.tsx) rendered a `< Leaderboard` back button, resulting in stacked duplicate links.
- **Root Cause**:
  Component decomposition copied the reference page's back link into `ProfileHeader` without noticing that the universal layout shell already provided a global back navigation bar for all subpages.
- **Resolution**:
  Removed the redundant back link from `ProfileHeader.tsx`, delegating universal back navigation to `NavigationHeader.tsx`.
- **Prevention**: Enforce strict layout hierarchy separation between global shells and page-specific content blocks.

---

### BUG-003: TypeScript Parameter Count Mismatch in `truncateAddress`
- **Severity**: Medium (TypeScript compile blocker)
- **Symptom**:
  ```text
  app/account/[id]/page.tsx: TS2554: Expected 1 arguments, but got 3.
  truncateAddress(wallet, 6, 4)
  ```
- **Root Cause**:
  [`lib/normalizers/formatters.ts`](file:///e:/Replica/lib/normalizers/formatters.ts) defined `truncateAddress` with a single `address: string` parameter using hardcoded `(0, 4)...(n - 4)`. However, `ProfileHeader` passed `(wallet, 6, 4)` to match predicting.top's exact 6-character prefix format.
- **Resolution**:
  Refactored `truncateAddress` to accept optional start and end character counts:
  ```typescript
  export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
    if (!address || address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }
  ```
- **Prevention**: Run `tsc --noEmit` on every utility function modification.

---

### BUG-004: Entry Limit Counter Desynchronization on Initial Render
- **Severity**: High (Functional defect)
- **Symptom**:
  When the user selected `200` in the "Show:" dropdown, the counter text still displayed `412 of 580 traders` instead of `200 of 580 traders`.
- **Root Cause**:
  `ControlBar.tsx` rendered `{displayedCount !== undefined ? displayedCount : filteredCount} of {totalCount}`. When `displayedCount` fell back to `filteredCount` during initial SSR render, or when React state had not recomputed the slice, the total matching count (412) was displayed instead of the user's requested limit (200).
- **Resolution**:
  Introduced `effectiveDisplayedCount` computed inside [`ControlBar.tsx`](file:///e:/Replica/components/leaderboard/ControlBar.tsx) strictly from `entryLimit`:
  ```typescript
  const effectiveDisplayedCount = React.useMemo(() => {
    if (entryLimit === "all") return filteredCount;
    if (entryLimit === "custom") return Math.min(customLimit, filteredCount);
    const parsed = parseInt(entryLimit, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return Math.min(parsed, filteredCount);
    }
    return displayedCount !== undefined ? displayedCount : filteredCount;
  }, [displayedCount, entryLimit, customLimit, filteredCount]);
  ```
  Guaranteed that selecting 10 displays `10 of 580 traders`, selecting 200 displays `200 of 580 traders`, and the table strictly slices to that length.
- **Prevention**: Compute display metrics directly from the controlling state variable rather than passing decoupled secondary counts.

---

### BUG-005: Chrome Form State Drift on Browser Refresh
- **Severity**: Medium (User experience inconsistency)
- **Symptom**:
  Refreshing the page in Chrome caused the `<select>` dropdown to visually display `200`, but React's state reset to default `"all"`, rendering all 412 rows.
- **Root Cause**:
  Chrome's form autofill restores input values into the DOM upon page refresh without triggering React's synthetic `onChange` event.
- **Resolution**:
  Added automated synchronization with `localStorage` (`predicting_entry_limit` and `predicting_custom_limit`) in [`LeaderboardView.tsx`](file:///e:/Replica/components/leaderboard/LeaderboardView.tsx):
  ```typescript
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("predicting_entry_limit");
      if (saved) setEntryLimit(saved);
      const savedCustom = localStorage.getItem("predicting_custom_limit");
      if (savedCustom) setCustomLimit(parseInt(savedCustom, 10) || 100);
    } catch {}
  }, []);
  ```
  The preference is saved on change and restored on mount, ensuring visual select and React state match 100%.
- **Prevention**: Store user-customizable UI preferences in `localStorage` to avoid DOM/state drift across browser reloads.

---

### BUG-006: Platform-Specific SWC Binary in Direct Dependencies (`EBADPLATFORM`)
- **Severity**: Critical (Deployment Blocker on Vercel)
- **Symptom**:
  ```text
  npm error code EBADPLATFORM
  npm error notsup Unsupported platform for @next/swc-win32-x64-msvc@16.4.6
  wanted {"os":"win32","cpu":"x64"}
  current {"os":"linux","cpu":"x64"}
  Error: Command "npm install" exited with 1
  ```
- **Root Cause**:
  `"@next/swc-win32-x64-msvc": "^16.4.6"` was explicitly declared in `package.json` `"dependencies"`. Next.js manages platform compiler binaries as `optionalDependencies`. Because it was declared as a top-level mandatory dependency, npm failed when running in Vercel's Linux build environment.
- **Resolution**:
  1. Removed `@next/swc-win32-x64-msvc` from `package.json` `"dependencies"`.
  2. Regenerated `package-lock.json` with npm, ensuring `@next/swc-linux-x64-gnu` and other platform binaries are declared strictly under Next.js `optionalDependencies` with `"optional": true`.
  3. Pushed the cleaned dependency manifest to GitHub `main`.
- **Prevention**: Never declare platform-specific binaries (`@next/swc-*`, `sharp-win32-*`, etc.) in direct `dependencies`. Allow the parent framework to manage them via `optionalDependencies`.

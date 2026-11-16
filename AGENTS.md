# AGENTS.md — Predicting.top Replica

## Project Objective
Build a high-fidelity, full-stack recreation of https://predicting.top/.

The application must reproduce the original design, functionality, navigation, data presentation and responsive behavior.

## Non-Negotiable Rules

### 1. Reference Fidelity
- Treat the original website as the source of truth.
- Do not redesign, modernize or creatively reinterpret the UI.
- Inspect the reference before implementing any page.
- Match dimensions, typography, colors, spacing, alignment and component behavior.
- Never substitute a generic dashboard for the reference design.

### 2. Data Integrity
- Use the original public Predicting.top API as the primary data provider, subject to its terms.
- Never fabricate financial figures, trader rankings or trading history.
- Never silently replace missing live data with mock data.
- Clearly distinguish unavailable, empty and failed API responses.
- Preserve attribution required by the source API.
- Respect rate limits and implement appropriate caching.

### 3. Architecture
- Use Next.js App Router, React and TypeScript.
- Use reusable components and typed interfaces.
- Keep API integration separate from presentation components.
- Avoid unnecessary dependencies.
- Avoid duplicated business logic.
- Keep secrets and credentials out of client-side code.

### 4. Code Quality
- No unnecessary `any` types.
- No unexplained hardcoded values.
- No dead buttons or fake interactions.
- No ignored TypeScript errors.
- No unnecessary `console.log` statements.
- Handle loading, error and empty states.
- Maintain accessible controls and semantic HTML.

### 5. Testing
- Run type checking and linting.
- Test critical user journeys with Playwright.
- Capture screenshots at matching reference viewport sizes.
- Verify API response transformations.
- Fix console errors and broken navigation.

### 6. Change Management
- Work in small, independently verifiable phases.
- Do not rewrite working modules unnecessarily.
- Inspect existing files before modifying them.
- Explain important architectural decisions.
- Maintain project documentation.
- Do not claim a feature is complete without testing it.

## Definition of Done
A feature is complete only when:
1. It matches the reference design.
2. Its functionality works.
3. Its data is correctly sourced.
4. Loading and error states are handled.
5. Its route and interactions are tested.
6. No regressions are introduced.
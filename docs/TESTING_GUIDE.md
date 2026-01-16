# Testing Guide

## Philosophy
- **No Unit Tests**: We focus on End-to-End (E2E) tests using Playwright.
- **Golden Flows**: Tests should verify critical user journeys (e.g., "Full Combat Round", "Level Up", "Long Rest").

## E2E Testing with Playwright (Planned)
**Config**: `playwright.config.ts` (root)
**Tests**: `e2e/*.spec.ts`

### Best Practices
- **Selectors**: Use `data-testid` attributes (`data-testid="spell-card-fireball"`).
- **State**: Do not rely on previous test state. Each test should reset or initialize its required state.
- **Mocking**: Minimize mocking. We want to test the real Redux store and Persistence logic where possible.

### Preflight Check
Before merging, run:
```bash
./preflight.sh
```
This script will:
1. Lint the code.
2. Check for type errors (`tsc`).
3. Run available tests.
4. Verify build.

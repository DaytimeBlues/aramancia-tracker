# Testing Guide

## Overview

The Aramancia Tracker uses a comprehensive three-pronged testing strategy:

1. **Logic Validation**: Ensures D&D 5.1 rules are correctly implemented
2. **Property-Based (Chaos Testing)**: Throws garbage data at reducers to find hidden bugs
3. **Performance Verification**: Confirms virtualization works for large lists

## Why This Approach Matters

| Testing Type | Failure Impact |
|--------------|----------------|
| Logic Errors | Incorrect DC calculations, unfair gameplay, lost spell effects |
| State Corruption | App crashes, data loss, broken persistence |
| Performance Issues | Mobile browser crashes at ~500 DOM elements, scroll jank |

---

## Test Suite 1: Concentration Logic

**File**: `src/store/middleware/concentration.test.ts`

### Purpose
Validate SRD 5.1 concentration rules [PHB p.203].

### SRD Rules Covered

| Rule | Implementation |
|------|---------------|
| DC = max(10, damage / 2) | Concentration DC with floor division |
| Concentration ends at 0 HP | Incapacitated characters can't concentrate |
| One active spell | Overwriting concentration loses previous effect |

### Test Cases

| Test | Rationale |
|------|-----------|
| Happy Path: Damage → Modal | Verify middleware triggers UI on damage |
| The Race: Rapid dispatch | Ensure state corruption doesn't happen during concurrent actions |
| DC Math (22 → 11) | Verify floor division (22/2 = 11) |
| DC Math (4 → 10) | Verify minimum DC |
| DC Math (0 damage) | No modal if no damage taken |
| Null Concentration | No modal if not concentrating |
| Non-Concentration Spell | Doesn't set active spell |

### When to Run
- Before releases
- After any middleware logic changes
- In CI pipeline

---

## Test Suite 2: Property-Based Fuzz Tests

**File**: `src/features/minions/minionSlice.fuzz.test.ts`

### Purpose
Uses fast-check to generate thousands of random inputs, ensuring reducers never produce invalid state according to Zod schema.

### Chaos Scenarios

| Scenario | Input | Expected |
|----------|--------|-----------|
| Negative HP | -1000 | Clamped to 0 |
| Huge AC | 10000 | Clamped to 30 |
| Empty Name | "" | Preserved (schema allows) |
| Oversized Name | 1000 chars | Truncated to 50 chars |
| NaN Values | NaN | Stored as-is (Zod catches) |
| Reserved Keys | `__proto__` | No prototype pollution |
| Unicode Injection | Multi-byte chars | Handled gracefully |
| Non-existent ID | Random UUID | No crash, no update |

### Fuzz Test Parameters

```typescript
fc.seed(28279237); // 0xARMANCIA - reproducible CI runs
fc.assert(property, { numRuns: 1000 });
```

### When to Run
- CI pipeline on every PR (1000 runs for determinism)
- Nightly builds with higher run counts (10,000+) for chaos
- After reducer modifications

---

## Test Suite 3: Virtualization Performance

**File**: `src/components/MinionList.perf.test.tsx`

### Purpose
Verifies React 19 + TanStack Virtual correctly recycles DOM nodes when rendering large minion lists.

### Why Critical

- Level 6 Necromancer can control 20+ skeletons
- Mobile browsers crash at ~500 DOM elements
- Scrolling jank kills gameplay UX

### Test Setup

- Renders 1,000 mock minions
- Mocks `HTMLElement.clientHeight` (JSDOM doesn't calculate layout)
- Asserts `< 50` DOM nodes (verifying 950+ NOT in DOM)

### Test Cases

| Test | Assertion |
|------|-----------|
| DOM Recycling | `childElementCount < 50` |
| Container Exists | `data-testid="virtual-container"` |
| Subset Rendered | Only visible rows in DOM |
| Correct Positioning | `translateY` matches row index |
| Ref Attachment | `measureElement` called |
| Total Height | Spacer matches 1,000 × 50px |
| Empty List | No crash, 0 elements |
| Zod Validation | All rendered minions pass schema |

### When to Run
- After virtualization refactor
- Performance regression checks
- Mobile device testing

---

## Test Suite 4: Golden Flows (E2E)

**File**: `src/tests/goldenFlows.test.tsx`

### Purpose
Full user journey integration tests that catch wiring issues unit tests miss.

### Golden Flow Steps

| Phase | Step | Action | Assertion |
|-------|------|--------|-----------|
| **1. Character** | 1 | Load fresh character | Initial state (L5, 28 HP) |
| **2. Level Up** | 2 | Level up to 6 | Prof bonus 3, HP increased |
| **3. Casting** | 3 | Cast Animate Dead (conc) | Concentration active, slot used |
| | 4 | Cast Shield (non-conc) | Slot used, concentration retained |
| **4. Minions** | 5 | Add 3 skeletons | 3 minions exist |
| | 6 | Damage minion #2 | HP reduced correctly |
| **5. Combat** | 7 | Take 12 damage | Modal opens, DC 10 |
| | 8 | Pass concentration | Concentration retained |
| | 9 | Fail concentration | Concentration lost |
| | 10 | Take 100 damage | HP 0, stable |
| **6. Death** | 11 | Fail 2 death saves | Failures = 2 |
| | 12 | Heal 1 HP | Failures reset to 0 |
| **7. Rest** | 13 | Spend hit die | HD reduced, HP healed |
| | 14 | Long rest | Slots reset, HD reset |
| **8. Wild Shape** | 15 | Transform (if implemented) | Transformed state set |
| | 16 | Revert | Original state restored |
| **9. Persistence** | 17 | Save to localStorage | Success |
| | 18 | Load from localStorage | State restored |
| | 19 | Verify all state matches | All assertions pass |
| **10. Offline** | 20 | Simulate app close | State preserved |
| | 21 | Reload from storage | Full state match |

### When to Run
- After feature integration
- Before releases
- When user flows change

---

## Test Suite 5: Persistence

**File**: `src/tests/persistence.test.ts`

### Purpose
Tests localStorage behavior: versioning, quota limits, corruption handling.

### Test Cases

| Test | Scenario | Assertion |
|------|-----------|-----------|
| Schema Migration | v1.0 → v2.0 | Slots format updated, version bumped |
| Quota Exceeded | 5MB localStorage full | Graceful degradation, error returned |
| Storage Disabled | Private browsing | Error returned, no crash |
| JSON Corruption | Missing required fields | Invalid state rejected |
| Incomplete Data | Partial session object | Validation fails |

### When to Run
- After storage logic changes
- Before schema version bumps

---

## Deferrred Items

The following features are documented but not yet implemented/tested:

### Golden Flow Extensions

| Feature | Edge Case |
|---------|-----------|
| **Attunement** | Add 4 items (max 3), verify warning |
| **Inventory** | Add 50 items, verify overflow |
| **Multiclass** | Configure multiclass slots, verify calculation |
| **Spell Prep** | Prepare spell, cast, verify prepared count |
| **Grimoire** | Add custom spell, verify persistence |
| **Session** | Create new session, switch sessions |
| **Export/Import** | Export JSON, verify integrity |

### Schema Migration

**Status**: Deferred (documented in plan)

See `.agent/workflows/testing-infrastructure.md` for implementation details.

---

## Running Tests

### Commands

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode (development)
npm run test:ui           # Visual test runner
```

### Test Categories

| Category | Framework | Purpose |
|----------|-----------|---------|
| Unit Tests | Vitest + React Testing Library | Component and logic validation |
| Property-Based | fast-check | Chaos engineering on Redux reducers |
| Performance | Vitest + mocked DOM | Virtualization verification |
| Integration | Vitest | Golden flow end-to-end tests |

---

## Coverage Targets

```typescript
// vitest.config.ts
thresholds: {
  lines: 80,
  functions: 80,
  branches: 75,
  // Per-file critical thresholds
  'src/features/minions/minionSlice.ts': { branches: 90 },
  'src/store/middleware/concentrationMiddleware.ts': { branches: 95 },
},
```

---

## CI Integration

- All tests run on PR
- Fuzz tests use fixed seed `0xARMANCIA` (28279237) for reproducibility
- Nightly jobs run expanded fuzz (10,000+ iterations) with random seeds
- Coverage must meet thresholds before merge
- Golden flows test core user journeys

---

## Troubleshooting

### Test Failures

| Failure Type | Common Cause | Fix |
|--------------|---------------|-----|
| Fuzz flakiness | Random seed not fixed | Use `fc.seed()` in CI |
| DOM assertion | Layout not calculated | Mock `clientHeight` in beforeEach |
| State leakage | Global store not reset | Use `renderWithProviders` helper |
| Async race | Missing `await` | Ensure proper async handling |

### Coverage Drops

| Area | Cause | Action |
|------|--------|--------|
| Reducers | Missing branch | Add test for new code path |
| Middleware | Effect not tested | Add spy or action listener test |
| Components | Unrendered state | Add test case |

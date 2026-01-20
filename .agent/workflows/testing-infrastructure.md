---
description: Refactor test suite infrastructure - folder structure, golden flows, and coverage thresholds
---

# Testing Infrastructure Refactor Plan

## Overview
Consolidate and strengthen test suite to ensure code quality, determinism, and comprehensive coverage.

## Configuration

| Decision | Value |
|----------|--------|
| Test Folder | `src/tests/` (centralized) |
| Fuzz Seed | `0xARMANCIA` (28279237) - "Aramancia" in hex |
| Coverage | 80% lines/branches, 95% middleware branches |

---

## Phase 1: Folder Structure Migration

### Actions

- [ ] Rename `src/test/` → `src/tests/`
- [ ] Update all import paths in test files
- [ ] Update `vitest.config.ts` include paths

### Expected Structure

```
src/
├── tests/                                 # Centralized UI & Integration tests
│   ├── renderWithProviders.tsx            # Store wrapper helper
│   ├── goldenFlows.test.tsx               # E2E user journey tests
│   ├── persistence.test.ts                # Schema versioning, quota tests
│   ├── MinionDrawer.test.tsx
│   ├── SpellSlotsWidget.test.tsx
│   ├── HealthWidget.test.tsx
│   ├── ConcentrationWidget.test.tsx
│   └── srdRules.test.ts
├── features/
│   └── minions/
│       ├── minionSlice.ts
│       ├── minionSlice.fuzz.test.ts       # Fuzz tests adjacent to reducer
│       └── minionSchema.ts
├── store/
│   ├── store.ts
│   ├── middleware/
│   │   ├── concentrationMiddleware.ts
│   │   └── concentration.test.ts          # Logic tests adjacent to middleware
└── components/
    ├── MinionList.tsx
    └── MinionList.perf.test.tsx           # Perf tests adjacent to component
```

---

## Phase 2: UI Test Helper

### File: `src/tests/renderWithProviders.tsx`

**Purpose**: Provides deterministic store wrapper to prevent state leakage between tests.

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { render, RenderResult } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import minionReducer from '../features/minions/minionSlice';

// TODO: Import all reducers as needed
// import concentrationReducer from '../store/middleware/concentrationReducer';

export const makeStore = (preloadedState?: PreloadedState<any>) => {
  return configureStore({
    reducer: {
      minions: minionReducer,
      // Add other reducers here
    },
    preloadedState,
  });
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: { preloadedState?: PreloadedState<any> }
): { store: ReturnType<typeof makeStore>; ...RenderResult } {
  const store = makeStore(options?.preloadedState);
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}
```

---

## Phase 3: Fuzz Test Determinism

### File: `src/features/minions/minionSlice.fuzz.test.ts`

### Changes

- [ ] Add `seed(28279237)` after import

```typescript
import fc from 'fast-check';

// 0xARMANCIA = 28279237
// Seed chosen to represent project in hex for reproducible CI runs
fc.seed(28279237);
```

---

## Phase 4: Enhanced Golden Flow Test

### File: `src/tests/goldenFlows.test.tsx`

### Golden Flow Steps (21 Steps, 10 Phases)

| Phase | Step | Action | Assertion |
|-------|------|--------|-----------|
| **1. Character** | 1 | Load fresh character | Initial state correct (L5, 28 HP) |
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

### Test Implementation Outline

```typescript
describe('Golden Flow: Level 6 Necromancer Combat Round', () => {
  it('Full app journey: Create char → level up → cast spells → minions → combat → save → reload', async () => {
    const user = userEvent.setup();
    const { store, saveToStorage, loadFromStorage } = setupTestEnvironment();

    // === PHASE 1: Character Creation & Level Up ===
    // 1. Load fresh character (verify initial state)
    expect(store.getState().level).toBe(5);
    expect(store.getState().hp.current).toBe(28);

    // 2. Level up to 6 (verify derived stats)
    store.dispatch(setLevel(6));
    expect(store.getState().profBonus).toBe(3);
    expect(store.getState().hp.max).toBeGreaterThan(28);

    // === PHASE 2: Spell Casting & Concentration ===
    // 3. Cast Animate Dead (concentration spell)
    store.dispatch(castSpell({ name: 'Animate Dead', requiresConcentration: true, level: 3 }));
    expect(store.getState().concentration).toBe('Animate Dead');
    expect(store.getState().slots[3].used).toBe(1);

    // 4. Cast non-concentration spell (Shield)
    store.dispatch(castSpell({ name: 'Shield', requiresConcentration: false, level: 1 }));
    expect(store.getState().slots[1].used).toBe(1);

    // === PHASE 3: Minion Management ===
    // 5. Add 3 skeletons via MinionDrawer
    store.dispatch(addMinion('Skeleton'));
    store.dispatch(addMinion('Skeleton'));
    store.dispatch(addMinion('Skeleton'));
    expect(store.getState().minions.ids.length).toBe(3);

    // 6. Damage minion #2
    const minionId = store.getState().minions.ids[1];
    store.dispatch(updateMinion({ id: minionId, changes: { hp: { current: 5, max: 13 } } }));

    // === PHASE 4: Combat & Concentration Check ===
    // 7. Take 12 damage (trigger concentration DC)
    store.dispatch(takeDamage({ damage: 12 }));

    // 8. Verify concentration modal opens
    expect(store.getState().ui.concentrationModal.isOpen).toBe(true);
    expect(store.getState().ui.concentrationModal.dc).toBe(10); // max(10, 12/2)

    // 9. Pass concentration check
    store.dispatch(passConcentrationCheck());
    expect(store.getState().concentration).toBe('Animate Dead');

    // 10. Fail concentration
    store.dispatch(failConcentrationCheck());
    expect(store.getState().concentration).toBeNull();

    // 11. Take 100 damage
    store.dispatch(takeDamage({ damage: 100 }));
    expect(store.getState().hp.current).toBe(0);

    // === PHASE 5: Death Saves & Healing ===
    // 12. Verify death saves active
    expect(store.getState().deathSaves.failures).toBe(0);

    // 13. Fail 2 death saves
    store.dispatch(updateDeathSave('failures', 2));

    // 14. Heal 1 HP (reset death saves)
    store.dispatch(updateHealth(1));
    expect(store.getState().deathSaves.successes).toBe(0);
    expect(store.getState().deathSaves.failures).toBe(0);

    // === PHASE 6: Short Rest & Hit Dice ===
    // 15. Spend hit die
    store.dispatch(spendHitDie({ healed: 4, diceSpent: 1 }));
    expect(store.getState().hitDice.current).toBe(4);

    // === PHASE 7: Long Rest & Slot Recovery ===
    // 16. Long rest (recover all slots, clear concentration)
    store.dispatch(longRest());
    expect(store.getState().slots[1].used).toBe(0);
    expect(store.getState().slots[3].used).toBe(0);
    expect(store.getState().concentration).toBeNull();

    // === PHASE 8: Wild Shape (if implemented) ===
    // 17. Transform
    // TODO: Add when Wild Shape is implemented

    // 18. Revert
    // TODO: Add when Wild Shape is implemented

    // === PHASE 9: Persistence ===
    // 19. Save to localStorage
    const saveResult = saveToStorage('session', store.getState());
    expect(saveResult.success).toBe(true);

    // 20. Reload from localStorage
    const loadedState = loadFromStorage('session');

    // 21. Verify all state restored correctly
    expect(loadedState.level).toBe(6);
    expect(loadedState.hp.current).toBeGreaterThan(0);
    expect(loadedState.hitDice.current).toBe(5); // Full after rest
    expect(loadedState.minions.length).toBe(3);
    expect(loadedState.slots[1].used).toBe(0);
    expect(loadedState.slots[3].used).toBe(0);

    // === PHASE 10: Offline/Background Test ===
    // 22. Simulate app close (clear store, reload)
    const reloadedState = loadFromStorage('session');
    expect(reloadedState).toEqual(loadedState);
  });
});
```

---

## Phase 5: Persistence Tests Expansion

### File: `src/tests/persistence.test.ts`

### Tests to Add

#### Schema Versioning

```typescript
describe('Persistence - Schema Versioning', () => {
  it.todo('Migrates v1.0 state to v2.0 format');
  it.todo('Migrates v1.5 minions to v2.0 minion structure');
  it.todo('Handles multiple sequential migrations');
});
```

#### Storage Failures

```typescript
describe('Persistence - Storage Failures', () => {
  it('Handles quota exceeded gracefully', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    const result = saveToStorage('session', { data: 'x'.repeat(1000000) });
    expect(result.success).toBe(false);
    expect(result.error).toContain('quota');
  });

  it('Handles storage disabled (private browsing)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    const result = saveToStorage('session', { test: true });
    expect(result.success).toBe(false);
  });
});
```

#### Partial Corruption

```typescript
describe('Persistence - Partial Corruption', () => {
  it('Validates JSON structure before trusting it', () => {
    const corrupted = '{ "valid": true, "missingCritical": "field" }';
    const result = loadFromStorage('session', corrupted);
    expect(result.valid).toBe(false);
    expect(result.state).toBeNull();
  });

  it('Handles incomplete session data', () => {
    const incomplete = '{ "hp": { "current": 10 } }'; // Missing max
    const result = loadFromStorage('session', incomplete);
    expect(result.valid).toBe(false);
  });
});
```

---

## Phase 6: Coverage Thresholds

### File: `vitest.config.ts`

```typescript
export default defineConfig({
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    include: ['src/**/*.ts', 'src/**/*.tsx'],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 75,
      // Per-file critical thresholds
      'src/features/minions/minionSlice.ts': { branches: 90 },
      'src/store/middleware/concentrationMiddleware.ts': { branches: 95 },
    },
  },
});
```

---

## Deferred Items

### Future Golden Flow Enhancements

The following edge cases should be added as separate integration tests once implemented:

| Feature | Golden Flow Step | Edge Case |
|---------|-----------------|-----------|
| **Attunement** | After Phase 3 | Add 4 items (max 3), verify warning |
| **Inventory** | After Phase 3 | Add 50 items, verify overflow handling |
| **Multiclass** | Phase 2 | Configure multiclass slots, verify calculation |
| **Spell Prep** | After Phase 3 | Prepare spell, cast, verify prepared count |
| **Grimoire** | After Phase 3 | Add custom spell, verify persistence |
| **Session** | After Phase 9 | Create new session, switch sessions |
| **Export/Import** | After Phase 9 | Export JSON, verify import integrity |

### Deferred Feature: Schema Migration

**Status:** Not implemented yet.

**Location:** `src/utils/sessionStorage.ts`

**Required Implementation:**

```typescript
interface MigrationPlan {
  fromVersion: string;
  toVersion: string;
  migrate: (state: any) => any;
}

const MIGRATIONS: MigrationPlan[] = [
  {
    fromVersion: '1.0',
    toVersion: '2.0',
    migrate: (state) => ({
      ...state,
      schemaVersion: '2.0',
      slots: convertLegacySlots(state.slots),
    }),
  },
];

export function migrateSession(state: any): any {
  const currentVersion = state.schemaVersion;
  const targetVersion = SCHEMA_VERSION;

  if (currentVersion === targetVersion) return state;

  const applicableMigrations = MIGRATIONS.filter(
    m => m.fromVersion === currentVersion
  );

  return applicableMigrations.reduce(
    (acc, migration) => migration.migrate(acc),
    state
  );
}
```

**Tests Required (Deferred):**

```typescript
// src/tests/persistence.test.ts (future)
describe('Persistence - Schema Migration (Deferred)', () => {
  it.todo('Migrates v1.0 slots format to v2.0');
  it.todo('Migrates v1.5 minions to v2.0 minion structure');
  it.todo('Handles multiple sequential migrations');
});
```

---

## Documentation Updates

### Update: `docs/TESTING_GUIDE.md`

Add sections documenting:
- Three-pronged testing approach (Logic, Property-Based, Performance)
- Fuzz test determinism (seed 0xARMANCIA)
- Golden flow phases and step details
- Persistence testing strategies
- Coverage threshold rationale

### Update: `TESTING.md`

Add quick reference table:
```markdown
# Testing

## Test Suites

| Suite | File | Purpose |
|--------|-------|---------|
| Logic Validation | `src/store/middleware/concentration.test.ts` | D&D concentration rules |
| Property-Based | `src/features/minions/minionSlice.fuzz.test.ts` | Reducer chaos testing |
| Performance | `src/components/MinionList.perf.test.tsx` | Virtualization verification |
| E2E Golden Flows | `src/tests/goldenFlows.test.tsx` | Full user journeys |

## Quick Commands

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:ui       # Visual runner
```

Full strategy: [docs/TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)
```

---

## Implementation Checklist

### Phase 1: Folder Structure
- [ ] Rename `src/test/` → `src/tests/`
- [ ] Update all import paths
- [ ] Update vitest config

### Phase 2: Helper
- [ ] Create `src/tests/renderWithProviders.tsx`
- [ ] Update existing UI tests to use helper
- [ ] Verify no state leakage

### Phase 3: Fuzz Tests
- [ ] Add `seed(28279237)` to minionSlice.fuzz.test.ts
- [ ] Verify reproducible runs

### Phase 4: Golden Flows
- [ ] Create `src/tests/goldenFlows.test.tsx`
- [ ] Implement all 21 test steps
- [ ] Mock helper functions

### Phase 5: Persistence
- [ ] Create `src/tests/persistence.test.ts`
- [ ] Implement storage failure tests
- [ ] Document schema migration (deferred)

### Phase 6: Coverage
- [ ] Update `vitest.config.ts`
- [ ] Set thresholds
- [ ] Verify in CI

### Phase 7: Documentation
- [ ] Update `docs/TESTING_GUIDE.md`
- [ ] Create/update `TESTING.md`

---

## Summary

**Files to Create:**
- `src/tests/renderWithProviders.tsx`
- `src/tests/goldenFlows.test.tsx`
- `src/tests/persistence.test.ts`
- `.agent/workflows/testing-infrastructure.md` (this file)
- `docs/TESTING_GUIDE.md`
- `TESTING.md`

**Files to Move:**
- `src/test/*` → `src/tests/*`

**Files to Modify:**
- `src/features/minions/minionSlice.fuzz.test.ts` (add seed)
- `src/store/middleware/concentration.test.ts` (add rounding docs)
- `vitest.config.ts` (add coverage thresholds)
- All test files (update import paths)

**Tests Added:**
- 1 golden flow (21 steps)
- 3 persistence tests
- 2 storage failure tests
- 2 corruption tests

**Total Test Count Target:** 75+ tests (existing 67 + new 8+)

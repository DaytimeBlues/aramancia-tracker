# Aramancia Tracker - Implementation Plan

## Current Phase: 2 - E2E Test Foundation
**Status**: In Progress
**Branch**: `master` (Current)

### Objectives
- Migrate all Minion state from `characterSlice` to `combatSlice`.
- Establish `combatSlice` as the single source of truth for combat-related entities.
- Ensure no state duplication persists.

### Tasks
- [x] Audit all imports of Minion actions from `characterSlice`.
- [x] Update `MinionDrawer` component to dispatch `combatSlice` actions.
- [x] Add Minion selectors to `combatSlice.ts`.
- [x] Remove Minion actions/state from `characterSlice.ts` to enforce Single Source of Truth.
- [x] Verify Minion migration with manual testing / E2E (Simulated).
- [x] Delete obsolete `features/minions/minionSlice.ts`.

---

## Upcoming Phases

### Phase 2: E2E Test Foundation (Playwright)
- [ ] Install Playwright & Config.
- [ ] Create `navigation.spec.ts`.
- [ ] Create `combat.spec.ts` (Core flow).

### Phase 3: Combat Flow Completion
- [ ] Component: `InitiativeTracker.tsx`.
- [ ] Logic: Initiative rolling and sorting in `combatSlice`.

### Phase 4: Wild Shape Feature
- [ ] Slice: `wildShapeSlice.ts`.
- [ ] Widget: `WildShapeWidget` updates.

### Phase 5: Verification & Hardening
- [ ] Refactor `goldenFlows.test.tsx` to use Real Redux.
- [ ] Full Preflight Regression.

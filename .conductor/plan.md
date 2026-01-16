# Aramancia Tracker - Implementation Plan

## Current Phase: 1 - State Unification
**Status**: Pending Start
**Branch**: `feature/state-unification` (Upcoming)

### Objectives
- Migrate all Minion state from `characterSlice` to `combatSlice`.
- Establish `combatSlice` as the single source of truth for combat-related entities.
- Ensure no state duplication persists.

### Tasks
- [ ] Audit all imports of Minion actions from `characterSlice`.
- [ ] Update `MinionDrawer` component to dispatch `combatSlice` actions.
- [ ] Add Minion selectors to `combatSlice.ts`.
- [ ] Remove Minion actions/state from `characterSlice.ts` to enforce Single Source of Truth.
- [ ] Verify Minion migration with manual testing / E2E (Simulated).

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

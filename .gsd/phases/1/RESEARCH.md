# Research: Phase 1 - Combat Core & Turn Logic

> Generated on 2026-01-20

## Current State Analysis

### 1. Combat Engine (`src/engine/combatEngine.ts`)

- **Status:** Functional but detached.
- **Features:**
  - Full turn/round management.
  - Initiative sorting.
  - HP tracking (damage/healing).
  - Condition management.
- **Problem:** It maintains its own internal `state`, but the UI consumes state from Redux. We need to unify these or use the engine as a utility to generate new Redux states.

### 2. Redux Slice (`src/store/slices/combatSlice.ts`)

- **Status:** Minimal.
- **Features:**
  - `currentRound` (simple increment).
  - `activeConcentration`.
  - `minions` entity adapter.
  - `casting` state machine.
- **Gaps:**
  - Missing `turn` index.
  - Missing `currentActorId`.
  - `turnAdvanced` only increments round, doesn't cycle combatants.

### 3. Combat View (`src/components/views/CombatView.tsx`)

- **Status:** Static UI.
- **Problem:** "End Turn" button has a `TODO`. No initiative input for minions or player.

## Proposed Solution

### Unification Strategy

Shift "Source of Truth" to Redux, but utilize `CombatEngine` logic.

1. Update `CombatState` in Redux to mirror `CombatEngine`'s state structure.
2. Implement thunks that instantiate a `CombatEngine` with the current Redux state, call the engine methods, and then update Redux with the result.

### Implementation Tasks

1. **Redux Update:** Add `turn` and `currentActorId` to `combatSlice`.
2. **Initiative Integration:** Add a `combatStarted` thunk that collects all active combatants (Player + Minions), assigns initiative (prompting user for player/enemy rolls), and sorts.
3. **Turn Advancement:** Hook the "End Turn" button to a thunk that calculates the next actor and increments the round if necessary.

## Risks & Considerations

- **Minion Volatility:** Adding/removing minions mid-combat needs to rebuild the initiative order (handled by `CombatEngine.addCombatant`).
- **Concentration:** Round increments should ideally trigger checks for time-based spells (Future).

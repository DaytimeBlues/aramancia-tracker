# V3.0 Architecture Documentation

## Overview

The v3.0 architectural paradigm introduces a **state-driven relational engine** with normalized data, memoized selectors forming a directed acyclic graph (DAG), decision-node spell logic, and event-driven concentration handling.

## Core Principles

### 1. State Normalization

Data is normalized using Redux Toolkit (RTK) entity adapters to eliminate duplication and establish a single source of truth.

**Entity Types:**
- **Spells**: Stored as entities with unique IDs
- **Actor**: Character metadata (level, class, proficiency, attributes)
- **Effects**: Active modifiers that alter stats
- **Concentration**: Current concentration state

**Benefits:**
- No duplicated spell data
- Efficient updates (single-point modification)
- Predictable state shape
- Type-safe access via selectors

### 2. Relational DAG for Derived Stats

Derived statistics are computed via **memoized selectors** organized in dependency phases to prevent circular references.

#### Computation Phases

```
Phase 1: Base Values
├── Base attributes (STR, DEX, CON, INT, WIS, CHA)
├── Character level
├── Class and hit die
└── Overrides

Phase 2: Primary Derivations
├── Ability modifiers (from base attributes)
├── Proficiency bonus (from level)
└── Active effects applied

Phase 3: Secondary Derivations
├── Skill bonuses (from ability mods + proficiency)
├── Spell save DC (from proficiency + spellcasting mod)
├── Spell attack bonus
└── Prepared spells capacity

Phase 4: Tertiary Derivations
├── Armor class (from DEX + effects)
├── Maximum HP (from level + CON + hit die)
└── Initiative (from DEX + effects)
```

**Cycle Prevention:**
- Strict unidirectional data flow
- Phase-based computation order
- No selector depends on its own output
- Effects can only modify Phase 1-2 values, not Phase 3-4

### 3. Override Pattern

All derived stats support optional overrides for manual adjustments:

```typescript
// Computed value
const computedAC = 10 + dexMod + effectBonuses;

// Override takes precedence
const finalAC = override?.ac ?? computedAC;
```

**Use Cases:**
- Temporary magical effects
- Homebrew rules
- Special circumstances
- Manual corrections

### 4. Spell Decision-Node Model

Spells are extended entities with:

#### Scaling
```typescript
{
  mode: 'slot_level' | 'character_level' | 'none',
  baseLevel: number,
  formula: string, // e.g., "{slot_level}+2 darts of 1d4+1"
}
```

#### Variants
```typescript
variants: [
  { name: "Bear's Endurance", effect: "..." },
  { name: "Bull's Strength", effect: "..." },
  // ... more options
]
```

#### Resource Consumption
```typescript
{
  resourceType: 'spell_slot' | 'sorcery_points' | 'ki_points' | ...,
  resourceCost: number,
}
```

#### Concentration Flag
```typescript
concentration: boolean
```

**Upcasting Flow:**
1. Select spell
2. Query available slots (level >= spell.level)
3. Present slot options to user
4. Resolve effect using scaling formula
5. Display computed result

### 5. Event-Driven Concentration Handling

Concentration checks are triggered automatically via **RTK listener middleware**:

```
[Damage Event] → [Middleware] → [Check if Concentrating]
                                       ↓
                              [Calculate DC = max(10, ⌊dmg/2⌋)]
                                       ↓
                              [Apply feat modifiers]
                                       ↓
                              [Dispatch prompt action]
                                       ↓
                              [UI displays prompt]
```

**Feat Modifiers:**
- **War Caster**: Grants advantage on concentration saves
- **Mage Slayer**: Enemy feat that imposes disadvantage

**Prompt Data:**
```typescript
{
  dc: number,
  damage: number,
  source?: string,
  hasAdvantage: boolean,
  hasDisadvantage: boolean,
}
```

## Adding New Features

### Adding a New Derived Field

1. **Determine Phase**: Identify dependencies
   - Depends only on base values? → Phase 2
   - Depends on ability mods or proficiency? → Phase 3
   - Depends on other derived stats? → Phase 4

2. **Create Selector**:
```typescript
export const selectNewStat = createSelector(
  [selectDependency1, selectDependency2, selectOverrides],
  (dep1, dep2, overrides) => {
    if (overrides.newStat !== undefined) {
      return overrides.newStat;
    }
    return computeNewStat(dep1, dep2);
  }
);
```

3. **Add Override Support**:
```typescript
// In ActorState type
overrides?: {
  ...
  newStat?: number;
}
```

4. **Add Tests**: Verify computation and override behavior

### Adding a New Spell

1. **Define Spell Data**:
```typescript
{
  id: 'unique-id',
  name: 'Spell Name',
  level: 3,
  scaling: {
    mode: 'slot_level',
    baseLevel: 3,
    formula: '{slot_level}+5d6 fire',
  },
  concentration: true,
  // ... other fields
}
```

2. **Validate with Zod**:
```typescript
const validated = SpellSchema.parse(spellData);
```

3. **Add to Store**:
```typescript
dispatch(spellAdded(validated));
```

### Adding a New Effect Type

1. **Extend EffectTarget**:
```typescript
export type EffectTarget = 
  | { type: 'new_target', param: string }
  | ... // existing types
```

2. **Handle in Selector**:
```typescript
effects.forEach(effect => {
  if (effect.target.type === 'new_target') {
    // Apply effect
  }
});
```

## Best Practices

### Selectors
- Always use `createSelector` for memoization
- Keep selectors pure (no side effects)
- Document dependencies in comments
- Test with multiple state configurations

### State Updates
- Use RTK actions/reducers only
- Never mutate state directly
- Prefer entity adapters for collections
- Keep normalized structure

### Effects
- Effects should be granular (one stat modification each)
- Use descriptive names
- Link to source spells when applicable
- Clean up effects when source expires

### Testing
- Test each selector independently
- Test selector composition
- Test override behavior
- Test edge cases (min/max values)

## Performance Considerations

### Memoization
Reselect memoizes selector outputs. Selectors only recompute when inputs change:

```typescript
// ✓ Good: Only recomputes when actor.level changes
const selectProfBonus = createSelector(
  [selectLevel],
  (level) => computeProfBonus(level)
);

// ✗ Bad: Recomputes every time (inline function)
const selectProfBonus = (state) => computeProfBonus(state.actor.level);
```

### Normalization Benefits
- O(1) lookup by ID
- Minimal data duplication
- Efficient updates (single entity change)
- Automatic relationship management

## Migration from V2

For apps using the old direct state model:

1. **Extract Spells**: Move spell data to normalized `spells` slice
2. **Move Attributes**: Transfer to `actor.baseAttributes`
3. **Convert Derived Stats**: Remove computed fields, use selectors instead
4. **Add Overrides**: Populate `actor.overrides` for manual adjustments
5. **Update Components**: Use `useAppSelector` with derived selectors
6. **Test Thoroughly**: Verify all computed values match previous behavior

## Troubleshooting

### Infinite Render Loops
**Cause**: Selector creating new objects on each call
**Fix**: Use `createSelector` to memoize object creation

### Stale Derived Values
**Cause**: Missing dependency in selector
**Fix**: Add missing dependency to selector input array

### Unexpected Override Behavior
**Cause**: Override not cleared when returning to computed values
**Fix**: Set override to `undefined` to remove it

### Concentration Not Triggering
**Cause**: Damage action not dispatched or middleware not installed
**Fix**: Ensure `concentrationMiddleware` is in store config and use `takeDamage` action

## File Structure

```
src/
├── store/
│   ├── store.ts                    # Redux store configuration
│   ├── hooks.ts                    # Typed useAppSelector/useAppDispatch
│   ├── slices/
│   │   ├── spellsSlice.ts         # Spell entities
│   │   ├── actorSlice.ts          # Actor metadata
│   │   ├── effectsSlice.ts        # Active effects
│   │   └── concentrationSlice.ts  # Concentration state
│   ├── selectors/
│   │   └── derivedSelectors.ts    # Memoized selectors (DAG)
│   ├── middleware/
│   │   └── concentrationMiddleware.ts  # Event-driven checks
│   └── utils/
│       └── spellUtils.ts          # Upcasting logic
├── types/
│   └── v3.ts                       # V3.0 entity types
├── components/v3/
│   ├── DerivedStatsDisplay.tsx    # Shows computed stats
│   ├── SpellCastModal.tsx         # Upcasting UI
│   ├── ConcentrationPrompt.tsx    # Concentration check UI
│   └── V3DemoView.tsx             # Integration demo
└── data/
    └── v3Spells.ts                 # Sample spell data
```

## References

- [Redux Toolkit Entity Adapters](https://redux-toolkit.js.org/api/createEntityAdapter)
- [Reselect Documentation](https://github.com/reduxjs/reselect)
- [RTK Listener Middleware](https://redux-toolkit.js.org/api/createListenerMiddleware)
- [D&D 5e SRD](https://www.dndbeyond.com/sources/basic-rules)

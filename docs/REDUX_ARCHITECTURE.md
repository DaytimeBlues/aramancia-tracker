# Redux Architecture for D&D 5e Character Management

This document describes the state-driven relational engine implemented for the Aramancia Tracker.

## Overview

The architecture implements a normalized, selector-driven state management pattern using Redux Toolkit (RTK) with:

- **Normalized Entities**: Spells stored centrally, referenced by ID
- **Memoized Selectors**: DAG of selectors for derived stats
- **Listener Middleware**: Event-driven rules for concentration checks
- **Decision-Node Casting**: Spell casting with upcast options and variants
- **Override Pattern**: Manual stat adjustments without breaking relational model

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Redux Store                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   Spells     │              │  Characters   │            │
│  │   Slice      │              │    Slice      │            │
│  ├──────────────┤              ├──────────────┤            │
│  │ Normalized   │              │ Base State   │            │
│  │ Entities     │◄─────ID──────│ Spell Refs   │            │
│  │ (by ID)      │              │ Abilities    │            │
│  └──────────────┘              │ Resources    │            │
│                                 │ Overrides    │            │
│                                 └──────────────┘            │
│                                        │                     │
│                                        ▼                     │
│                            ┌──────────────────┐             │
│                            │   Selectors      │             │
│                            │   (Memoized)     │             │
│                            ├──────────────────┤             │
│                            │ Base             │             │
│                            │   ↓              │             │
│                            │ Intermediate     │             │
│                            │   ↓              │             │
│                            │ Composite        │             │
│                            └──────────────────┘             │
│                                        │                     │
│                                        ▼                     │
│                            ┌──────────────────┐             │
│                            │  UI Components   │             │
│                            ├──────────────────┤             │
│                            │ Cast Modal       │             │
│                            │ Redux Demo View  │             │
│                            └──────────────────┘             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                   Listener Middleware                        │
│  ┌────────────────────────────────────────────────┐         │
│  │ Concentration Checks on Damage Events          │         │
│  │ • War Caster Extension                         │         │
│  │ • Mage Slayer Extension                        │         │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/store/
├── store.ts                    # Redux store configuration
├── slices/
│   ├── spellsSlice.ts          # Normalized spell entities
│   └── characterSlice.ts       # Character state & spell references
├── selectors/
│   └── characterSelectors.ts   # Memoized selector DAG
├── middleware/
│   └── concentrationListener.ts # Event-driven concentration rules
├── types/
│   └── spellSchema.ts          # Spell entity schema
├── utils/
│   └── spellMigration.ts       # Legacy spell data migration
└── initialization.ts           # Initial state setup
```

## Core Concepts

### 1. Normalized Spell Schema

Spells are stored as centralized entities with complete metadata:

```typescript
interface NormalizedSpell {
  id: string;
  name: string;
  level: number;
  school: 'Evocation' | 'Necromancy' | ...;
  
  // Structured casting info
  castingTime: { amount: number; unit: 'action' | 'bonus_action' | ... };
  range: { type: 'ranged'; distance: number } | { type: 'self' };
  duration: { type: 'concentration'; amount: number; unit: 'minute' };
  
  // Scaling for upcasting
  scaling?: SpellScaling[];
  
  // Variants (e.g., damage type choices)
  variants?: SpellVariant[];
  
  // Resource costs
  resourceCosts: ResourceCost[];
  
  // Concentration metadata
  concentration: ConcentrationData;
}
```

**Key Benefits:**
- Single source of truth for spell data
- No denormalization (characters reference spells by ID)
- Easy to update spell properties globally
- Supports complex spell features (variants, scaling)

### 2. Selector Architecture (DAG)

Selectors form a Directed Acyclic Graph (DAG) with three layers:

#### Base Selectors (Read Raw State)
```typescript
selectCharacterAbilities(state) → AbilityScores
selectCharacterLevel(state) → number
selectSpellcastingAbility(state) → 'int' | 'wis' | 'cha'
```

#### Intermediate Selectors (Compute Modifiers)
```typescript
selectAbilityMods = createSelector(
  [selectCharacterAbilities],
  (abilities) => computeModifiers(abilities)
)

selectProficiencyBonus = createSelector(
  [selectCharacterLevel],
  (level) => getProfBonus(level)
)
```

#### Composite Selectors (Derive Final Stats)
```typescript
selectSpellSaveDC = createSelector(
  [selectProficiencyBonus, selectSpellcastingMod, selectStatOverrides],
  (profBonus, spellMod, overrides) => {
    // Override pattern: manual override takes precedence
    if (overrides.spellSaveDC !== undefined) {
      return overrides.spellSaveDC;
    }
    
    // Compute from base stats
    return 8 + profBonus + spellMod;
  }
)
```

**Memoization Benefits:**
- Selectors only recompute when inputs change
- Narrow dependencies minimize recalculations
- Reference equality for stable outputs
- Testable in isolation

**Example Selector Graph:**
```
abilities → abilityMods ─┐
                         ├──→ spellcastingMod ─┐
spellcastingAbility ─────┘                     │
                                               ├──→ spellSaveDC
level → proficiencyBonus ──────────────────────┤
                                               │
overrides ─────────────────────────────────────┘
```

### 3. Override Pattern

Allows manual stat adjustments without breaking the relational model:

```typescript
interface StatOverrides {
  ac?: number;
  spellSaveDC?: number;
  spellAttackBonus?: number;
  maxHP?: number;
}

// In selector:
const computedAC = baseAC + dexMod + (mageArmor ? 3 : 0) + (shield ? 5 : 0);
return overrides.ac ?? computedAC; // Override takes precedence
```

**Use Cases:**
- Magic items that set AC (Ring of Protection)
- Temporary buffs/debuffs
- Homebrew rules
- Edge cases not covered by standard formulas

### 4. Listener Middleware

Event-driven rules system for game mechanics:

```typescript
concentrationListenerMiddleware.startListening({
  actionCreator: damageTaken,
  effect: async (action, listenerApi) => {
    const { characterId, amount } = action.payload;
    const state = listenerApi.getState();
    
    // Check if concentrating
    const concentration = selectConcentrationState(state);
    if (!concentration.spellId) return;
    
    // Calculate DC: max(10, damage / 2)
    const dc = Math.max(10, Math.floor(amount / 2));
    
    // Get save modifier (includes War Caster advantage)
    const saveModifier = selectConcentrationSaveModifier(state);
    
    // Dispatch prompt for player to roll
    listenerApi.dispatch(concentrationCheckPrompted({
      characterId,
      damage: amount,
      dc,
      saveBonus: saveModifier.bonus,
      hasAdvantage: saveModifier.advantage,
      spellName: spell.name,
    }));
  }
});
```

**Extension Points:**

**War Caster:**
```typescript
// Handled via selector
selectConcentrationSaveModifier = createSelector(
  [selectSavingThrowBonuses, selectCharacterFeatures],
  (saves, features) => ({
    bonus: saves.con,
    advantage: features.warCaster, // Advantage on concentration saves
  })
)
```

**Mage Slayer:**
```typescript
// Extension point in middleware
export const mageSlayerExtension = () => {
  concentrationListenerMiddleware.startListening({
    actionCreator: damageTaken,
    effect: async (action, listenerApi) => {
      // Check if damage source has Mage Slayer and is within 5 feet
      // If so, impose disadvantage on the concentration check
      // (Requires tracking damage sources and positioning)
    }
  });
};
```

### 5. Decision-Node Casting

The Cast Modal component demonstrates spell casting as a decision tree:

```typescript
<CastModal spellId="chromatic-orb" />

// User chooses:
// 1. Upcast level (based on available slots)
// 2. Variant (acid, cold, fire, lightning, poison, thunder)
// 3. Confirms resource consumption

// On cast:
dispatch(spellSlotUsed({ characterId, level: upcastLevel }))
if (spell.concentration.required) {
  dispatch(concentrationStarted({ characterId, spellId }))
}
```

**Features:**
- Displays available spell slots per level
- Shows scaled damage/effects
- Validates resource availability
- Warns about concentration conflicts
- Integrates with normalized spell schema

## Usage Examples

### Accessing Derived Stats

```typescript
import { useAppSelector } from './store/store';
import { selectSpellSaveDC, selectArmorClass } from './store/selectors/characterSelectors';

function CharacterSheet() {
  const spellDC = useAppSelector(selectSpellSaveDC);
  const ac = useAppSelector(selectArmorClass);
  
  return (
    <div>
      <p>Spell Save DC: {spellDC}</p>
      <p>AC: {ac}</p>
    </div>
  );
}
```

### Casting Spells

```typescript
import { CastModal } from './components/v3/CastModal';

function SpellList() {
  const [castingSpellId, setCastingSpellId] = useState<string | null>(null);
  
  return (
    <>
      <button onClick={() => setCastingSpellId('fireball')}>
        Cast Fireball
      </button>
      
      {castingSpellId && (
        <CastModal
          spellId={castingSpellId}
          onClose={() => setCastingSpellId(null)}
          onCast={(spellId, level, variant) => {
            console.log(`Cast ${spellId} at level ${level}`);
          }}
        />
      )}
    </>
  );
}
```

### Setting Overrides

```typescript
import { useAppDispatch } from './store/store';
import { overrideSet } from './store/slices/characterSlice';

function OverrideControls({ characterId }: { characterId: string }) {
  const dispatch = useAppDispatch();
  
  return (
    <input
      type="number"
      placeholder="Override AC"
      onChange={(e) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        dispatch(overrideSet({ characterId, stat: 'ac', value }));
      }}
    />
  );
}
```

### Extending with Feats

```typescript
// In your middleware file
import { concentrationListenerMiddleware } from './store/middleware/concentrationListener';

concentrationListenerMiddleware.startListening({
  actionCreator: customAction,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const character = selectActiveCharacter(state);
    
    if (character?.features.customFeat) {
      // Apply custom feat logic
    }
  }
});
```

## Testing

Comprehensive tests are provided for:

1. **Selector Tests** (`characterSelectors.test.ts`):
   - Derived stat calculations
   - Memoization behavior
   - Override pattern
   - Edge cases (min/max stats)

2. **Middleware Tests** (`concentrationListener.test.ts`):
   - Damage event handling
   - Concentration DC calculation
   - Temp HP mechanics
   - Feat integration

3. **Integration Tests**:
   - Full casting flow
   - State persistence
   - Selector composition

Run tests with:
```bash
npm test
```

## Migration from Legacy State

To migrate existing spell data:

```typescript
import { migrateSpells } from './store/utils/spellMigration';
import { spells as legacySpells } from './data/spells';

const normalizedSpells = migrateSpells(legacySpells);
store.dispatch(spellsAdded(normalizedSpells));
```

## Performance Considerations

1. **Selector Memoization**: 
   - Use `createSelector` for all derived state
   - Keep selectors pure and deterministic
   - Use narrow dependencies to minimize recalculations

2. **Entity Normalization**:
   - O(1) lookups by ID
   - Avoid denormalization
   - Reference entities by ID

3. **Listener Middleware**:
   - Async-safe with `listenerApi`
   - Can be paused/stopped
   - Minimal overhead when not triggered

## Future Extensions

1. **Active Effects System**: Track ongoing spell effects
2. **Spell Preparation Limits**: Enforce class-specific preparation rules
3. **Multiclassing**: Calculate spell slots from multiple classes
4. **Custom Spells**: Support homebrew spell creation
5. **Spell Components**: Track material component inventory

## References

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Reselect (Memoized Selectors)](https://github.com/reduxjs/reselect)
- [D&D 5e SRD](https://dnd.wizards.com/resources/systems-reference-document)
- [Listener Middleware](https://redux-toolkit.js.org/api/createListenerMiddleware)

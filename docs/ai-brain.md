# Aramancia Tracker - AI Brain

## Project Identity

- **Name**: Aramancia Tracker
- **Purpose**: A streamlined, single-player D&D 5e tracking tool for Wizards.
- **Vibe**: Kyoto Minimalism (Dark void, warm gold, glassmorphism).

## Architectural Map

### State Management (Redux)

- **`character`**: Single source of truth for base stats, inventory, level, and derived scores (AC, DC).
- **`spellbook`**: Manages spell slots, prepared spells, and spell filtering.
- **`combat`**: Manages minions (EntityAdapter), active concentration, combat rounds, and casting state machine.

### Key Data Flow

1. **Mutation**: Components dispatch actions to Redux slices.
2. **Logic**: Slices handle state transitions. `recalculateDerivedCharacterData` ensures math matches SRD 5.1.
3. **Middleware**:
   - `persistenceMiddleware`: Syncs `character` and `spellbook` to `sessionStorage`.
   - `concentrationMiddleware`: Intercepts damage and triggers concentration checks.
4. **Persistence**: App hydrates from `sessionStorage` on mount (see `getActiveSession`).

### Component Hierarchy

- `AppShell`: Global layout, navigation, and persistent status bars.
- `TabRouter`: Tab-based navigation (`Character`, `Spellbook`, `Combat`, `Inventory`).
- `Widgets`: Small, reusable, linked components (e.g., `SlotAbacus`, `StatBubble`).

## SRD 5.1 Core Rules (Strict Enforcement)

### Armor Class (AC)

- **Mutually Exclusive Bases**: Mage Armor (13 + Dex) vs. Unarmored (10 + Dex) vs. Worn Armor. You cannot stack Mage Armor with Plate.
- **Additive Bonuses**: Shield (+5), Cover (+2/5) are additives.

### Hit Points & Damage

- **THP Logic**: Temporary HP never stacks; the higher replacement rule applies.
- **Damage Order**: THP absorbed first, then regular HP.
- **Concentration**: Damage requires CON save (DC = max(10, damage / 2)).

### Spellcasting

- Only one concentration spell at a time.
- Arcane Recovery (Wizard): Restore slots up to half level (round up), max slot level 5.

## Workflow Protocols (Non-Negotiable)

1. **No Unit Tests**: Do not create or update unit tests. Only E2E (Playwright) is supported for UI/Logic verification.
2. **Preflight**: Always run `./preflight.sh` before completing a task.
3. **Single Source of Truth**: Never store Redux-mirroring state in local `useState`.
4. **Visual Verification**: Use the browser tool to verify UI changes visually.

---
*Note: This document is managed by agents. Update when architecture shifts.*

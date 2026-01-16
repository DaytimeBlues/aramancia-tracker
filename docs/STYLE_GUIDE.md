# Aramancia Tracker - Code Style Guide

## Component File Structure
1. Imports (React, then external libs, then internal)
2. Type definitions (interfaces, types)
3. Constants
4. Helper functions
5. Component definition (`export const MyComponent: React.FC<...>`)
6. Export (if not inline)

## Naming Conventions
- **Components**: PascalCase (`SpellList.tsx`)
- **Hooks**: camelCase with `use` prefix (`useSpellFilter.ts`)
- **Slices**: camelCase with `Slice` suffix (`characterSlice.ts`)
- **Selectors**: camelCase with `select` prefix (`selectAllMinions`)
- **Actions**: camelCase, verb-first (`slotConsumed`, `minionAdded`)

## Redux Best Practices
- **Single Source of Truth**: Never duplicate state. If it exists in `combatSlice`, do not put it in `characterSlice`.
- **EntityAdapter**: Use `createEntityAdapter` for normalized collections (Minions, Spells) where IDs are involved.
- **Selectors**: Selectors MUST be co-located with their slice.
- **Safety**: Avoid `any`. Use `unknown` and type guards (`isError`, `isString`) if uncertain.

## CSS / Tailwind
- Use Tailwind v4 semantics.
- Custom colors should be defined in `index.css` or theme config, not hardcoded hex values (use `bg-parchment`, `text-muted`).

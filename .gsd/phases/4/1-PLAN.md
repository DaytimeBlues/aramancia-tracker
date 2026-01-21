---
phase: 4
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/components/features/spells/SpellCard.tsx
  - src/components/features/spells/SpellDetailPanel.tsx
autonomous: true

must_haves:
  truths:
    - "Spell cards can be expanded to reveal full descriptions"
    - "Expanded view shows Rolls, Ranges, Damage Types, and Saving Throws"
  artifacts:
    - "src/components/features/spells/SpellDetailPanel.tsx exists"
---

# Plan 4.1: Collapsible Spell Detail View

<objective>
Create an expandable detail panel for spell cards that reveals comprehensive SRD-compliant information.

Purpose: To allow users to see the full spell details (damage dice, saving throws, "at higher levels" text) without leaving the spellbook.
Output: New `SpellDetailPanel.tsx` and updated `SpellCard.tsx` with expand/collapse functionality.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/schemas/spellSchema.ts
- src/components/features/spells/SpellCard.tsx
</context>

<tasks>

<task type="auto">
  <name>Create SpellDetailPanel Component</name>
  <files>src/components/features/spells/SpellDetailPanel.tsx</files>
  <action>
    Create a new component that renders:
    1. Full `description` text (not truncated).
    2. `higherLevelDescription` with "At Higher Levels:" prefix if present.
    3. Components (V, S, M) with material description if applicable.
    4. Damage breakdown (dice, type) if `damage` array exists.
    5. Saving throw details (ability, success, fail) if `savingThrowDetails` exists.
    6. Attack roll indicator if `requiresAttackRoll` is true.
    7. `usageTips` if present.

    Style with Necromancer Noir theme: Obsidian background, spectral borders, soul-green highlights for Necromancy school.
    Animate entrance with `animate-in slide-in-from-top-1 duration-200`.
  </action>
  <verify>TSC check, visual check in storybook or browser</verify>
  <done>Component renders all available data for a spell.</done>
</task>

<task type="auto">
  <name>Integrate Expand/Collapse into SpellCard</name>
  <files>src/components/features/spells/SpellCard.tsx</files>
  <action>
    1. Add `useState` hook `isExpanded` (boolean, default false).
    2. Add a clickable chevron icon next to the spell name.
    3. When `isExpanded` is true, render `<SpellDetailPanel spell={spell} />` below the description snippet.
    4. Animate the card's height change smoothly.
  </action>
  <verify>Click on a spell card, verify expand/collapse works.</verify>
  <done>Spell cards expand and collapse smoothly.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `SpellDetailPanel` renders correctly for a spell with all fields (damage, save, etc.).
- [ ] `SpellDetailPanel` renders correctly for a spell with minimal fields (e.g., a utility spell).
- [ ] Expand/Collapse animation is smooth.
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>

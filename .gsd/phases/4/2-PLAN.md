---
phase: 4
plan: 2
wave: 2
depends_on: ["4.1"]
files_modified:
  - src/components/features/spells/SpellList.tsx
  - src/components/features/spells/PreparedSpellsBar.tsx
  - src/store/slices/spellbookSlice.ts
autonomous: true

must_haves:
  truths:
    - "User can see how many spells they can prepare"
    - "User can manage prepared spells with a daily ritual UI"
  artifacts:
    - "src/components/features/spells/PreparedSpellsBar.tsx exists"
---

# Plan 4.2: Daily Spell Preparation System

<objective>
Implement the SRD-compliant "Daily Ritual" spell preparation UI.

Purpose: To enforce the SRD rule "You can prepare a number of wizard spells equal to your Intelligence modifier + your wizard level."
Output: A `PreparedSpellsBar` component and updated preparation logic.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/store/slices/spellbookSlice.ts
- src/store/slices/characterSlice.ts
- src/components/features/spells/SpellList.tsx
</context>

<tasks>

<task type="auto">
  <name>Create PreparedSpellsBar Component</name>
  <files>src/components/features/spells/PreparedSpellsBar.tsx</files>
  <action>
    Create a new component that:
    1. Calculates `maxPreparedSpells = character.level + character.abilityMods.int`.
    2. Displays "Prepared: {currentCount} / {maxPreparedSpells}".
    3. Shows a visual progress bar with spectral-violet fill.
    4. Displays a warning glow if the user is at max capacity.
  </action>
  <verify>Visual check in browser.</verify>
  <done>Bar shows current vs max prepared spells correctly.</done>
</task>

<task type="auto">
  <name>Add Preparation Limit Logic</name>
  <files>src/components/features/spells/SpellList.tsx</files>
  <action>
    1. Import `PreparedSpellsBar`.
    2. Render `PreparedSpellsBar` at the top of the spell list.
    3. In `handlePrepareToggle`, prevent adding a spell if `preparedSpells.length >= maxPreparedSpells`.
    4. Add a toast notification if the user tries to exceed the limit.

    AVOID: Hardcoding the max value. It must be derived from character level and INT mod.
  </action>
  <verify>Prepare spells up to the limit, confirm enforcement.</verify>
  <done>User cannot prepare more spells than allowed.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `PreparedSpellsBar` displays correctly for a Level 5 Wizard with +3 INT.
- [ ] User cannot prepare more than 8 spells (5 + 3).
- [ ] Toast appears when trying to exceed limit.
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>

---
milestone: The Necromancer Awakening
version: 2.0.0
updated: 2026-01-21
---

# Roadmap

> **Current Phase:** 3 - Interactive Movement (Moving Bubbles)
> **Status:** in-progress

## Must-Haves (from SPEC)

- [ ] "Stylish Necromancer" Visual System (CSS & Tokens)
- [ ] Interactive Drag & Drop "Moving Bubbles"
- [ ] SRD 5.1 Full Spell Details (Interactive/Collapsible)
- [ ] Daily Spell Preparation System

---

## Phases

### Phase 1: Necromancer Visual Overhaul

**Status:** ✅ Complete
**Objective:** Shift the design system from "Kyoto Gold" to "Necromantic Violet/Green".
**Tasks:**

- [x] Update `AGENTS.md` with new color palettes and design rules.
- [x] Rewrite `src/index.css` with Necromantic tokens and Tailwind 4 mappings.
- [x] Apply glassmorphism and spectral glows to all core components.

---

### Phase 2: Structural Cleanup

**Status:** ✅ Complete
**Objective:** Remove legacy features and consolidate core data.
**Tasks:**

- [x] [DELETE] `WildShapeWidget.tsx`.
- [x] [DELETE] `InitiativeWidget.tsx`.
- [x] [RENAME] Merge Roleplay into `BiographyView.tsx`.
- [x] Clean up redundant Redux state from deleted features.

---

### Phase 3: Interactive Movement (Moving Bubbles)

**Status:** ✅ Complete
**Objective:** Enable drag-and-drop orchestration for all combat elements.
**Tasks:**

- [x] Extend `DraggableContainer` to all combat bubbles (Battle, Minions, Wand, Familiar, Concentration, Panic).
- [x] Implement position persistence in Redux.
- [x] Ensure responsive position handling (percentage-based).

---

### Phase 4: Necromantic Spellbook & Prep

**Status:** ✅ Complete
**Objective:** Implement rich SRD spell data and the preparation system.
**Tasks:**

- [x] Integrate full SRD spell data (Rolls, Ranges, Effects).
- [x] Build the "Prepared Spells" selection logic (Daily Ritual).
- [x] Create the "Collapsible Detail" view for spell descriptions.

---

### Phase 5: Inventory & Item Charges

**Status:** ⬜ Not Started
**Objective:** Track usage for limited-use magical items.
**Tasks:**

- [ ] Add `charges` (current/max) to Inventory schema.
- [ ] Implement usage logic (Consuming charges on cast).
- [ ] Add "Recharge" button/logic (Long Rest integration).

---

### Phase 6: The Oracle (ML Engine)

**Status:** ⬜ Not Started
**Objective:** Implement the feature engineering and suggestion layer.
**Tasks:**

- [ ] Implement `CharacterEmbedding` type and logic.
- [ ] Build the probabilistic suggestion engine (DAG-based).
- [ ] Integrate suggestions into the UI (The Oracle's Whispers).

---

## Progress Summary

| Phase | Status | Tasks | Complete |
|-------|--------|-------|----------|
| 1 | ✅ | 3/3 | 100% |
| 2 | ✅ | 4/4 | 100% |
| 3 | ✅ | 3/3 | 100% |
| 4 | ✅ | 3/3 | 100% |
| 5 | ⬜ | 0/3 | 0% |
| 6 | ⬜ | 0/3 | 0% |

---

## Timeline

| Phase | Started | Completed | Duration |
|-------|---------|-----------|----------|
| 1 | 2026-01-21 | — | — |
| 2 | — | — | — |
| 3 | — | — | — |
| 4 | — | — | — |
| 5 | — | — | — |
| 6 | — | — | — |

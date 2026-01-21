# SPEC.md — Project Specification

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: No code may be written until this spec is marked `FINALIZED`.

## Vision

**Aramancia Tracker** is a premium, "Stylish Necromancer" character sheet and combat management tool for D&D 5e Wizards. It focuses on the dark elegance of necromancy, featuring a deep violet/soul-green aesthetic, advanced minion orchestration, and an ML-inspired suggestion engine.

## Goals

1. **Stylish Necromancer Aesthetic** — A moody yet elegant UI using obsidian, spectral violet, soul-green, and bone-white accents with premium glassmorphism.
2. **Advanced Combat Orchestration** — Interactive "Moving Bubbles" (Drag & Drop) for Battle, Minions, Familiars, and Wands.
3. **Full SRD Spell Intelligence** — Deep integration of SRD 5.1 spell data with collapsible, rich details including roll types, effects, and examples.
4. **Wizard Mechanics Mastery** — Robust Spell Preparation (Daily selection) and Item Charge tracking (Wands/Staves).
5. **The Oracle (ML Engine)** — A feature engineering layer to model character state and provide probabilistic suggestions for play.

## Non-Goals (Out of Scope)

- Multi-class features for non-Wizard classes (specifically removing Wild Shape).
- Multi-player synchronization.
- Complex condition automation (for now).

## Constraints

- **React 19 / Vite / Tailwind 4** — Keep stack modernized.
- **Draggable Context** — All core combat bubbles must be repositionable.
- **Data Density Management** — Information-rich views must be minimizable/collapsible to prevent clutter.
- **No Unit Tests** — Methodology mandates E2E (Playwright) as the primary verification tool.

## Technical Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Necromancer Theme | Must-have | Global CSS overhaul (Violet/Green/Obsidian). |
| Moving Bubbles | Must-have | Draggable Dnd-kit implementation for all combat UI elements. |
| Spell Prep System | Must-have | Daily prepared spell logic and UI. |
| SRD Rich Spells | Must-have | Collapsible details with rolls/ranges/success-fail logic. |
| Item Charge Tracking| Must-have | Integration with inventory for limited-use items. |
| ML Oracle Engine | Should-have | Implementation of the Embedding and Suggestion layer. |

---

*Last updated: 2026-01-21 (The Necromancer Update)*

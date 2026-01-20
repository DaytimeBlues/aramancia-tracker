# SPEC.md — Project Specification

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: No code may be written until this spec is marked `FINALIZED`.

## Vision

**Aramancia Tracker** is a high-fidelity, aesthetic D&D 5e character sheet and combat management PWA. It specializes in tracking complex minion/summon logic (Necromancy) while adhering strictly to SRD 5.1 rules and a "Kyoto Noir" design aesthetic.

## Goals

1. **SRD 5.1/5.2 Compliance** — Automate AC formulas, spell slots, and combat rules exactly as written.
2. **Advanced Minion Management** — Seamlessly track multiple undead/summons, their HP, and control lifecycles.
3. **Kyoto Noir Aesthetic** — Deliver a premium UI with deep Japanese influence, glassmorphism, and elegant typography.
4. **Session Persistence** — Ensure character data across sessions is reliable and persistent via localStorage/IndexedDB.

## Non-Goals (Out of Scope)

- Homebrew rule automation (focus on SRD strictly).
- Multiplayer sync (currently a local-first single player tool).
- Full encounter builder (focus on character-specific combat tracking).

## Constraints

- **React 19 / Vite** — Must use the latest web stack provided.
- **Capacitor** — Must remain compatible with mobile wrapper.
- **No Unit Tests** — Methodology mandates E2E (Playwright) as the primary verification tool.

## Success Criteria

- [ ] 100% pass rate on combat and spellbook E2E tests.
- [ ] Automatic AC calculation reflecting all equipped items and active spells (Mage Armor).
- [ ] Minion lifecycle tracking (turn limits, automatic dismissal).
- [ ] "Kyoto Noir" design language applied across all views.

## Technical Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Combat Turn Logic | Must-have | End turn, initiative order, round tracking. |
| Spell Item Support | Must-have | Casting spells from inventory items with charges. |
| Wild Shape | Should-have | Swap character stats for beast forms. |
| Multiclass Slots | Must-have | Accurate spell slot calculation for multiclass characters. |

---

*Last updated: 2026-01-20*

# Agent Notebook

## Agent Role Definition
>
> "You are a Helpful AI Assistant with access to this project's documentation.
> When I ask a question, provide a clear answer and cite the specific source
> from our library of Markdown artifacts (`.conductor/`, `docs/`).
> Always prioritize the constraints defined in `.conductor/spec.md` over generic defaults."

---

## Design Philosophy

### Core Principles

1. **Aesthetic-Usability Effect** (Nielsen Norman): Beautiful designs feel easier to use
2. **Fitts's Law**: Important actions get larger touch targets, positioned at edges
3. **Kyoto Minimalism**: Dark void + warm gold, like a moonlit temple

### Visual Rules

- All corners: 8px radius (0.5rem)
- Card elevation: 3 levels (base, elevated, floating)
- Touch targets: minimum 44x44px (2.75rem)
- Animation timing: 200ms ease-out (actions), 300ms ease-in-out (transitions)

### Color Hierarchy

- Primary Action: White (#f5f5f4)
- Secondary Action: Gold accent (#d4af37)
- Critical State: Vermillion (#dc2626)
- Informational: Muted white (rgba(255,255,255,0.7))

### Typography Scale

- Hero: 2rem (32px) - XP, major stats
- Title: 1.25rem (20px) - section headers
- Body: 1rem (16px) - content
- Caption: 0.75rem (12px) - labels, hints

---

## Design Philosophy

### Core Principles

1. **Aesthetic-Usability Effect** (Nielsen Norman): Beautiful designs feel easier to use.
2. **Fitts's Law**: Important actions get larger touch targets, positioned at edges.
3. **Kyoto Minimalism**: Dark void + warm gold, like a moonlit temple.

### Visual Rules

- All corners: 8px radius (0.5rem)
- Card elevation: 3 levels (base, elevated, floating)
- Touch targets: minimum 44x44px (2.75rem)
- Animation timing: 200ms ease-out (actions), 300ms ease-in-out (transitions)

### Color Hierarchy

- Primary Action: White (#f5f5f4)
- Secondary Action: Gold accent (#c9a227)
- Critical State: Vermillion (#c53d3d)
- Informational: Muted white (rgba(255,255,255,0.7))

### Typography Scale

- Hero: 2rem (32px) - XP, major stats
- Title: 1.25rem (20px) - section headers
- Body: 1rem (16px) - content
- Caption: 0.75rem (12px) - labels, hints

---

## Session Log

Entries are appended by agents at the end of each session.

### 2026-01-17 (Antigravity)

**Task**: UI Beautification Phase 1 & 3
**Summary**: Established Design Brain and enhanced visual system tokens.

### 2026-01-16 (Antigravity)

**Branch**: `feature/conductor-protocol`

#### Summary

- **Conductor Initialization**: Set up directory structure (`.conductor/`, `docs/`) and core artifacts.
- **Merge Completion**: Consolidated all outstanding PRs into `master` before starting this protocol work.
- **Conflict Resolution**: Fixed `src/components/views/CombatOverlay.tsx` (restored usageTips, fixed badges), `App.tsx`, and `persistenceMiddleware.ts`.
- **Documentation**: Created `conductor_setup_guide.md` to standardize protocol across workspaces.

#### Key Decisions Made

- **Stale Branch Policy**: Decided to IGNORE ~18 stale branches (>4 days old) to avoid regression.
- **Persistence Pattern**: Established strict aliasing for excluded variables in destructuring (e.g., `minions: _minions`) to prevent variable collisions.

#### Open Questions for Next Session

- None immediately. Roadmap defined in `.conductor/plan.md`.

### 2026-01-16 (Codex)

**Branch**: `master`

#### Summary

- **Android QA Artifacts**: Added an Android CI workflow, Kotlin-based Espresso launch test, and a test plan document.
- **Gradle Updates**: Enabled Kotlin plugin support and exposed a WebView ID to allow UI click assertions.

### 2026-01-16 (Codex)

**Branch**: `work`

#### Summary

- **Lint Fixes**: Resolved hook ordering, removed unused eslint directive, and aligned combat slice test typing with store reducers.

### 2026-01-16 (Codex)

**Branch**: `work`

#### Summary

- **Test Alignment**: Updated unit tests to match current UI copy and styles, ensured combat test seeds player initiative, and excluded Playwright specs from Vitest.
- **Test Scope**: Restricted Vitest to project tests and excluded node_modules to prevent third-party suites from running.
- **Preflight**: Skip Playwright E2E when browsers are missing to avoid false failures in clean environments.

---

## Knowledge Base (Learned Patterns)

### Pattern: Excluding Ephemeral State from Persistence

**Source**: `src/store/slices/persistenceMiddleware.ts`
**Description**: When destructuring state for persistence, always alias and discard ephemeral fields like `toast` and `minions` (if managed elsewhere).
**Example**:

```typescript
// Good
const { minions: _minions, toast: _toast, ...characterData } = character;

// Bad (Causes "minions" collision if 'minions' is already in scope)
const { minions, toast, ...characterData } = character;
```

### Pattern: Conflict Resolution via Rewrite

**Source**: `src/components/features/combat/ResolutionPanel.tsx`
**Description**: When incremental patching fails due to complex conflict markers, read the file once to get context, then perform a **full file overwrite** with the desired final state. This bypasses "target content not found" errors.

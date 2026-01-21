# Agent Notebook

## Agent Role Definition
>
> "You are a Helpful AI Assistant with access to this project's documentation.
> When I ask a question, provide a clear answer and cite the specific source
> from our library of Markdown artifacts (`.conductor/`, `docs/`).
> Always prioritize the constraints defined in `.conductor/spec.md` over generic defaults."

---

## Design Philosophy (Necromancer Noir)

### Core Principles

1. **Aesthetic-Usability Effect**: Premium dark interfaces feel more powerful.
2. **Spectral Hierarchy**: Use light and color (Bloom/Glow) to guide focus in the void.
3. **Information "Ma"**: Allow for high data density but keep it hidden behind elegant, collapsible reveals.

### Visual Rules

- **Corners**: 8px (standard), 4px (tight widgets).
- **Glassmorphism**: 0.7 opacity obsidian with 12px blur + 1px spectral stroke.
- **Accents**:
  - `Spectrum-Violet`: Primary branding and energy.
  - `Soul-Green`: Life/Death state and necromantic triggers.
  - `Bone-White`: Data reading and primary text.

### Color Palette

- **Obsidian (BG)**: `#08080a`
- **Spectral Violet**: `#8b5cf6` (High energy) / `#6d28d9` (Muted)
- **Soul Green**: `#10b981` (Vibrant life/death)
- **Bone White**: `#f1f1f1` (Primary text)
- **Phantom Silver**: `#94a3b8` (Muted details)

### Typography

- **Display (Outfit)**: Used for stats, names, and titles.
- **Body (Inter)**: Used for descriptions and tooltips.
- **Serif (Playfair Display - Optional)**: Use for "Occult" flavor text if needed.

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

# Aramancia Tracker - Project Specification

## 1. Project Identity
- **Name**: Aramancia Tracker
- **Purpose**: A digital companion for tracking character state in D&D 5e sessions, specifically tailored for a Necromancer/Warlock character.
- **Target User**: D&D players who need offline-first, compliant tracking.

## 2. Core Constraints (Non-Negotiables)
- **SRD 5.1 Compliance**: All game mechanics MUST adhere to Rules As Written (RAW).
  - *Example*: AC calculations are mutually exclusive.
  - *Example*: Temporary HP does not stack.
- **Offline-First**: The app must function without an internet connection (using `sessionStorage` for persistence).
- **No Unit Tests**: Only End-to-End (E2E) tests are permitted (per project policy).
- **Preflight Mandatory**: All code must pass `./preflight.sh` before merge.

## 3. Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Redux Toolkit (Single Source of Truth)
- **Styling**: Tailwind CSS v4 (using vanilla CSS variables where appropriate)
- **E2E Testing**: Playwright (Pending Implementation)
- **Icons**: Lucide React

## 4. Architectural Principles
- **Single Source of Truth**: State for any given domain (e.g., Combat, Character) lives in ONE Redux slice.
- **Feature-First Structure**: Components are organized by feature (`features/spells`, `features/combat`) rather than type.
- **Ephemeral vs. Persistent State**: 
  - `toast`, `modal`, and `ui` state is **ephemeral** (reset on reload).
  - Character methods (HP, Slots, Inventory) are **persistent**.

## 5. Out of Scope
- Multi-character party management (Single player focus).
- Server-side synchronization / Backend.
- Native mobile app (Capacitor is separate/future).

## 6. Version Control
- **Branching**: ALWAYS use `master` as the primary branch. Do not use `main`.
- **Commit Messages**: Semantic Conventional Commits (e.g., `feat(ui): add glow`).

---
description: Fix TypeScript lint errors and missing dependencies across the codebase
phase: 1
status: active
created: 2026-01-20
---

# Phase 1: Fix Lint Errors

<role>
You are a GSD executor. You fix lint errors systematically, verify each fix, and ensure no regressions.
</role>

<objective>
Resolve all ESLint and TypeScript errors identified in the codebase review:
- 7x `@typescript-eslint/no-explicit-any` errors in combatSlice.ts
- 2x `spell.level` possibly undefined in ResolutionPanel.tsx
- 1x `useCallback` missing dependency in App.tsx
</objective>

---

## Pre-Flight

```bash
npm run lint 2>&1 | grep -E "(error|warning)"
npx tsc --noEmit 2>&1 | grep -E "(error|warning)"
```

---

## Tasks

<task type="auto">
  <name>Replace any types in combatSlice.ts thunk signatures</name>
  <files>src/store/slices/combatSlice.ts</files>
  <action>
    Import RootState and AppDispatch from ../store/hooks.ts
    Replace all `(dispatch: any, getState: any)` with proper ThunkAPI types:
    - For sync thunks: use `dispatch: Dispatch` and `getState: () => RootState`
    - The selectors already exist: selectAllMinions, selectMinionById, selectMinionCount
  </action>
  <verify>npm run lint 2>&1 | grep -c "no-explicit-any" | xargs -I {} test {} -eq 0 && echo "No any errors remaining"</verify>
  <done>ESLint report shows 0 @typescript-eslint/no-explicit-any errors in combatSlice.ts</done>
</task>

<task type="auto">
  <name>Fix spell.level undefined checks in ResolutionPanel.tsx</name>
  <files>src/components/features/combat/ResolutionPanel.tsx</files>
  <action>
    Lines 65 and 79 access spell.level which may be undefined.
    For cantrips, spell.level is 0 but may be stored as undefined.
    Add nullish coalescing: (spell.level ?? 0) on lines 65 and 79.
    Alternatively, update the getScaledDamage function to handle this defensively.
  </action>
  <verify>npx tsc --noEmit 2>&1 | grep -c "TS18048" | xargs -I {} test {} -eq 0 && echo "No TS18048 errors"</verify>
  <done>TypeScript compilation passes with 0 errors for spell.level access</done>
</task>

<task type="auto">
  <name>Fix useCallback missing dependency in App.tsx</name>
  <files>src/App.tsx</files>
  <action>
    Line 104: useCallback for updateHealth is missing character.hp.current dependency.
    Add character.hp.current to the useCallback dependency array.
    This ensures the callback recreates when HP changes, preventing stale closure issues.
  </action>
  <verify>npm run lint 2>&1 | grep -c "react-hooks/exhaustive-deps" | xargs -I {} test {} -eq 0 && echo "No hook dependency warnings"</verify>
  <done>ESLint reports 0 react-hooks/exhaustive-deps warnings in App.tsx</done>
</task>

<task type="checkpoint:verify">
  <name>Verify all fixes pass lint and type check</name>
  <action>
    Run full lint and type check to confirm all issues resolved:
    - npm run lint
    - npx tsc --noEmit
  </action>
  <verify>Both commands exit with code 0</verify>
</task>

---

## Validation

Run validation suite:

```bash
npm run lint && npx tsc --noEmit && echo "✅ All checks pass"
```

Expected output:
- ESLint: 0 errors, 1+ warnings acceptable
- TypeScript: 0 errors

---

## Rollback Plan

If issues arise:

```bash
git checkout src/store/slices/combatSlice.ts src/components/features/combat/ResolutionPanel.tsx src/App.tsx
```

---

## Completion Criteria

- [ ] 0 `@typescript-eslint/no-explicit-any` errors
- [ ] 0 TS18048 (possibly undefined) errors
- [ ] 0 react-hooks/exhaustive-deps warnings
- [ ] All unit tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)

---

## Notes

This phase resolves technical debt identified in the 2026-01-20 code review.
The fixes are low-risk: type improvements and defensive null checks.


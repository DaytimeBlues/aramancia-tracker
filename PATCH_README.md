# How to Apply ESLint Fixes

This directory contains patch files and documentation for fixing ESLint errors in PRs #47, #48, and #49.

## Quick Apply

### For PR #49

```bash
# Checkout the PR branch
git fetch origin pull/49/head:pr-49
git checkout pr-49

# Apply the patch
git apply pr-49.patch

# Verify the fix
npm run lint

# Commit the changes
git add src/features/minions/minionSlice.ts
git commit -m "Fix ESLint error: use type alias instead of empty interface"

# Push to the PR branch
git push origin HEAD:codex/add-test-files-for-redux-and-performance
```

### For PR #48

```bash
# Checkout the PR branch
git fetch origin pull/48/head:pr-48
git checkout pr-48

# Apply the patch
git apply pr-48.patch

# Verify the fix
npm run lint

# Commit the changes
git add src/App.tsx src/store/slices/persistenceMiddleware.ts src/utils/sessionStorage.ts
git commit -m "Fix ESLint errors: remove unused vars and replace 'any' types"

# Push to the PR branch
git push origin HEAD:codex/create-test-suite-for-aramancia-tracker
```

### For PR #47

No ESLint fixes needed. The CI failure is due to TypeScript compilation errors, not ESLint errors.

See `PR_47_FIX.md` for details.

## Files

- **ESLINT_FIXES.md** - Comprehensive guide with all fixes explained
- **PR_47_FIX.md** - Details for PR #47 (no ESLint errors)
- **PR_48_FIX.md** - Details for PR #48 (4 errors, 1 warning)
- **PR_49_FIX.md** - Details for PR #49 (1 error)
- **pr-48.patch** - Git patch for PR #48 fixes
- **pr-49.patch** - Git patch for PR #49 fix

## Manual Application

If the patch files don't apply cleanly, refer to the individual PR_*.md files for manual fix instructions.

## Testing

After applying fixes:

```bash
# Install dependencies (if not already installed)
npm ci

# Run ESLint
npm run lint

# Expected results:
# PR #49: Exit code 0 (no errors)
# PR #48: Exit code 0 (1 warning is OK)
# PR #47: Exit code 0 (no errors)
```

## Notes

- The warning in PR #48 about `useVirtualizer` is non-blocking and expected
- PR #47 has TypeScript compilation errors that need separate fixes
- All fixes are minimal and targeted to specific ESLint rules

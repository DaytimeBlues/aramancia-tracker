# Fix for PR #49: ESLint Error in minionSlice.ts

## Error
```
/src/features/minions/minionSlice.ts
  4:18  error  An interface declaring no members is equivalent to its supertype  @typescript-eslint/no-empty-object-type
```

## Fix
In file `src/features/minions/minionSlice.ts`, line 4:

**Change from:**
```typescript
export interface MinionState extends EntityState<Minion> {}
```

**Change to:**
```typescript
export type MinionState = EntityState<Minion>;
```

## Explanation
ESLint's `@typescript-eslint/no-empty-object-type` rule flags empty interfaces that only extend another type. 
The recommended approach is to use a type alias instead, which is semantically cleaner and avoids the lint error.

## Verification
After making this change, run `npm run lint` to verify the error is fixed.

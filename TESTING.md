# Testing

## Test Suites

| Suite | File | Purpose |
|--------|-------|---------|
| Logic Validation | `src/store/middleware/concentration.test.ts` | D&D concentration rules |
| Property-Based | `src/features/minions/minionSlice.fuzz.test.ts` | Reducer chaos testing |
| Performance | `src/components/MinionList.perf.test.tsx` | Virtualization verification |
| Integration | `src/tests/goldenFlows.test.tsx` | Full user journeys |
| Persistence | `src/tests/persistence.test.ts` | Storage & migration |

## Quick Commands

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:ui           # Visual runner
```

## Testing Strategy

Full documentation: [docs/TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)

### Three-Pronged Approach

1. **Logic Validation**: D&D 5.1 rules correctness
2. **Property-Based (Chaos)**: Garbage data testing with fast-check
3. **Performance**: Virtualization verification for mobile performance

### Key Configuration

| Setting | Value |
|---------|--------|
| Test Folder | `src/tests/` (centralized) |
| Fuzz Seed | `0xARMANCIA` (28279237) - reproducible |
| Coverage | 80% lines/branches, 95% middleware |
| Golden Flow | 21 steps, 10 phases |

### When to Run

- Before releases
- After feature changes
- CI pipeline (every PR)
- Nightly (expanded fuzz, 10k+ runs)

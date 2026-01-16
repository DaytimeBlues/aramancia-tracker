import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import combatReducer, {
    concentrationCheckRequired,
    minionAdded,
    minionRemoved,
    allMinionsCleared,
    castingStarted,
    slotConfirmed,
    castingCompletedWithSlot,
} from '../store/slices/combatSlice';
import spellbookReducer from '../store/slices/spellbookSlice';

describe('combatSlice reducers', () => {
    it('calculates concentration check DC per RAW', () => {
        const state = combatReducer(undefined, concentrationCheckRequired({ damage: 23 }));
        expect(state.concentrationCheckDC).toBe(11);
    });

    it('tracks initiative entries when minions are added and removed', () => {
        const minion = {
            id: 'm1',
            name: 'Skeleton 1',
            type: 'skeleton' as const,
            hp: 10,
            maxHp: 13,
            ac: 13,
            speed: 30,
            attacks: [],
            conditions: [],
        };

        const withMinion = combatReducer(undefined, minionAdded(minion));
        expect(withMinion.initiativeOrder).toContain('m1');

        const withoutMinion = combatReducer(withMinion, minionRemoved('m1'));
        expect(withoutMinion.initiativeOrder).not.toContain('m1');
    });

    it('clears all minions but keeps player initiative if present', () => {
        const minion = {
            id: 'm1',
            name: 'Skeleton 1',
            type: 'skeleton' as const,
            hp: 10,
            maxHp: 13,
            ac: 13,
            speed: 30,
            attacks: [],
            conditions: [],
        };

        const seeded = {
            ...combatReducer(undefined, minionAdded(minion)),
            initiativeOrder: ['player', 'm1'],
        };

        const cleared = combatReducer(seeded, allMinionsCleared());
        expect(cleared.initiativeOrder).toEqual(['player']);
        expect(cleared.minions.ids).toHaveLength(0);
    });

    it('expends a spell slot when a cast completes with a slot level', () => {
        const store = configureStore({
            reducer: {
                combat: combatReducer,
                spellbook: spellbookReducer,
            },
        });

        store.dispatch(castingStarted({ spellId: 'magic-missile' }));
        store.dispatch(slotConfirmed({ slotLevel: 2, resolutionMode: 'automatic' }));
        store.dispatch(castingCompletedWithSlot());

        expect(store.getState().spellbook.availableSlots[2]).toBe(2);
    });
});

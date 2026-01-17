import { describe, it, expect } from 'vitest';
import reducer, {
    hpChanged,
    longRestCompleted,
    itemAttuned,
} from '../store/slices/characterSlice';
import { initialCharacterData } from '../data/initialState';
import type { CharacterState } from '../store/slices/characterSlice';

const createState = (overrides: Partial<CharacterState> = {}): CharacterState => ({
    ...structuredClone(initialCharacterData),
    toast: null,
    ...overrides,
});

describe('characterSlice reducers', () => {
    it('consumes temp HP before regular HP and prompts concentration checks', () => {
        const state = createState({
            hp: { current: 20, max: 20, temp: 5 },
            concentration: 'Shield',
        });

        const damaged = reducer(state, hpChanged(12));

        expect(damaged.hp.temp).toBe(0);
        expect(damaged.hp.current).toBe(17);
        expect(damaged.concentration).toBe('Shield');
        expect(damaged.toast).toBe('CON Save DC 10 to maintain Shield');
    });

    it('drops concentration when HP hits 0', () => {
        const state = createState({
            hp: { current: 5, max: 20, temp: 0 },
            concentration: 'Hold Person',
        });

        const downed = reducer(state, hpChanged(0));

        expect(downed.hp.current).toBe(0);
        expect(downed.concentration).toBeNull();
        expect(downed.toast).toBe('Concentration on Hold Person lost - Incapacitated!');
    });

    it('enforces a maximum of 3 attuned items', () => {
        const state = createState({
            attunement: ['Amulet', 'Ring', 'Cloak'],
        });

        const capped = reducer(state, itemAttuned('Boots'));

        expect(capped.attunement).toEqual(['Amulet', 'Ring', 'Cloak']);
        expect(capped.toast).toBe('Maximum 3 attuned items!');
    });

    it('resets rest-dependent state on long rest', () => {
        const state = createState({
            hp: { current: 10, max: 35, temp: 7 },
            hitDice: { current: 1, max: 5, size: 6 },
            slots: {
                1: { used: 2, max: 4 },
                2: { used: 3, max: 3 },
                3: { used: 1, max: 2 },
            },
            mageArmour: true,
            shield: true,
            concentration: 'Web',
            deathSaves: { successes: 2, failures: 1 },
        });

        const rested = reducer(state, longRestCompleted());

        expect(rested.hp.current).toBe(35);
        expect(rested.hp.temp).toBe(0);
        expect(rested.hitDice.current).toBe(4);
        expect(rested.slots[1].used).toBe(0);
        expect(rested.slots[2].used).toBe(0);
        expect(rested.slots[3].used).toBe(0);
        expect(rested.mageArmour).toBe(false);
        expect(rested.shield).toBe(false);
        expect(rested.concentration).toBeNull();
        expect(rested.deathSaves).toEqual({ successes: 0, failures: 0 });
        expect(rested.toast).toBe('Long Rest Completed');
    });
});

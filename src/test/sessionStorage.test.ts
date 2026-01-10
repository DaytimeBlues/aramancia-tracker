import { describe, it, expect } from 'vitest';
import {
    migrateCharacterData,
    SCHEMA_VERSION,
} from '../utils/sessionStorage';
import type { CharacterData } from '../types';

// Mock a minimal CharacterData for testing migrations
const createMockCharacterData = (overrides: Partial<CharacterData> = {}): CharacterData => ({
    hp: { current: 20, max: 20, temp: 0 },
    hitDice: { current: 5, max: 5, size: 6 },
    baseAC: 10,
    mageArmour: false,
    shield: false,
    dc: 13,
    profBonus: 2,
    level: 5,
    savingThrowProficiencies: ['int', 'wis'],
    deathSaves: { successes: 0, failures: 0 },
    abilities: {
        str: { score: 10, mod: 0 },
        dex: { score: 14, mod: 2 },
        con: { score: 14, mod: 2 },
        int: { score: 16, mod: 3 },
        wis: { score: 12, mod: 1 },
        cha: { score: 10, mod: 0 },
    },
    skills: {},
    slots: {
        1: { used: 0, max: 4 },
        2: { used: 0, max: 3 },
        3: { used: 0, max: 2 },
    },
    defaultMinion: {},
    concentration: null,
    attunement: [],
    inventory: [],
    transformed: null,
    ...overrides,
});

describe('Session Storage Migrations', () => {
    describe('SCHEMA_VERSION', () => {
        it('exports current schema version', () => {
            expect(SCHEMA_VERSION).toBe('1.1');
        });
    });

    describe('migrateCharacterData', () => {
        it('recalculates proficiency bonus based on level', () => {
            const data = createMockCharacterData({
                level: 9,
                profBonus: 2, // Wrong - should be 4 at level 9
            });

            const migrated = migrateCharacterData(data, '1.0');
            expect(migrated.profBonus).toBe(4);
        });

        it('recalculates ability modifiers from scores', () => {
            const data = createMockCharacterData({
                abilities: {
                    str: { score: 18, mod: 0 }, // Wrong mod
                    dex: { score: 14, mod: 0 }, // Wrong mod
                    con: { score: 16, mod: 0 }, // Wrong mod
                    int: { score: 20, mod: 0 }, // Wrong mod
                    wis: { score: 12, mod: 0 }, // Wrong mod
                    cha: { score: 8, mod: 0 },  // Wrong mod
                },
            });

            const migrated = migrateCharacterData(data, '1.0');
            expect(migrated.abilities.str.mod).toBe(4);  // (18-10)/2 = 4
            expect(migrated.abilities.dex.mod).toBe(2);  // (14-10)/2 = 2
            expect(migrated.abilities.con.mod).toBe(3);  // (16-10)/2 = 3
            expect(migrated.abilities.int.mod).toBe(5);  // (20-10)/2 = 5
            expect(migrated.abilities.wis.mod).toBe(1);  // (12-10)/2 = 1
            expect(migrated.abilities.cha.mod).toBe(-1); // (8-10)/2 = -1
        });

        it('recalculates max HP based on level and CON', () => {
            const data = createMockCharacterData({
                level: 5,
                hp: { current: 15, max: 15, temp: 0 }, // Wrong max
                hitDice: { current: 5, max: 5, size: 6 },
                abilities: {
                    str: { score: 10, mod: 0 },
                    dex: { score: 14, mod: 2 },
                    con: { score: 14, mod: 2 }, // +2 CON mod
                    int: { score: 16, mod: 3 },
                    wis: { score: 12, mod: 1 },
                    cha: { score: 10, mod: 0 },
                },
            });

            const migrated = migrateCharacterData(data, '1.0');
            // Level 1: 6 + 2 = 8
            // Levels 2-5: 4 * (4 + 2) = 24
            // Total: 32
            expect(migrated.hp.max).toBe(32);
        });

        it('caps current HP at new max HP if it exceeded', () => {
            const data = createMockCharacterData({
                level: 5,
                hp: { current: 50, max: 50, temp: 0 }, // Was inflated
                hitDice: { current: 5, max: 5, size: 6 },
                abilities: {
                    str: { score: 10, mod: 0 },
                    dex: { score: 14, mod: 2 },
                    con: { score: 14, mod: 2 },
                    int: { score: 16, mod: 3 },
                    wis: { score: 12, mod: 1 },
                    cha: { score: 10, mod: 0 },
                },
            });

            const migrated = migrateCharacterData(data, '1.0');
            expect(migrated.hp.current).toBe(32); // Capped at new max
            expect(migrated.hp.max).toBe(32);
        });

        it('recalculates spell save DC', () => {
            const data = createMockCharacterData({
                level: 5,
                profBonus: 2, // Will be corrected to 3
                dc: 10, // Wrong DC
                abilities: {
                    str: { score: 10, mod: 0 },
                    dex: { score: 14, mod: 2 },
                    con: { score: 14, mod: 2 },
                    int: { score: 16, mod: 3 }, // +3 INT mod
                    wis: { score: 12, mod: 1 },
                    cha: { score: 10, mod: 0 },
                },
            });

            const migrated = migrateCharacterData(data, '1.0');
            // DC = 8 + prof(3) + INT mod(3) = 14
            expect(migrated.dc).toBe(14);
        });

        it('recalculates spell slots based on level', () => {
            const data = createMockCharacterData({
                level: 7,
                slots: {
                    1: { used: 2, max: 2 }, // Wrong max
                    2: { used: 1, max: 1 }, // Wrong max
                },
            });

            const migrated = migrateCharacterData(data, '1.0');
            // Level 7: { 1: 4, 2: 3, 3: 3, 4: 1 }
            expect(migrated.slots[1]).toEqual({ used: 2, max: 4 });
            expect(migrated.slots[2]).toEqual({ used: 1, max: 3 });
            expect(migrated.slots[3]).toEqual({ used: 0, max: 3 });
            expect(migrated.slots[4]).toEqual({ used: 0, max: 1 });
        });

        it('preserves used slot counts during migration', () => {
            const data = createMockCharacterData({
                level: 5,
                slots: {
                    1: { used: 3, max: 4 },
                    2: { used: 2, max: 3 },
                    3: { used: 1, max: 2 },
                },
            });

            const migrated = migrateCharacterData(data, '1.0');
            expect(migrated.slots[1].used).toBe(3);
            expect(migrated.slots[2].used).toBe(2);
            expect(migrated.slots[3].used).toBe(1);
        });

        it('sets hit dice max to level', () => {
            const data = createMockCharacterData({
                level: 8,
                hitDice: { current: 3, max: 5, size: 6 }, // Wrong max
            });

            const migrated = migrateCharacterData(data, '1.0');
            expect(migrated.hitDice.max).toBe(8);
            expect(migrated.hitDice.current).toBe(3); // Preserved
        });

        it('caps current hit dice at new max', () => {
            const data = createMockCharacterData({
                level: 3,
                hitDice: { current: 5, max: 5, size: 6 }, // Current exceeds new max
            });

            const migrated = migrateCharacterData(data, '1.0');
            expect(migrated.hitDice.max).toBe(3);
            expect(migrated.hitDice.current).toBe(3); // Capped
        });

        it('preserves non-derived fields', () => {
            const data = createMockCharacterData({
                baseAC: 15,
                mageArmour: true,
                shield: true,
                concentration: 'Fireball',
                attunement: ['Ring of Protection', 'Cloak of Invisibility'],
                inventory: ['Spellbook', 'Component Pouch'],
                transformed: {
                    active: true,
                    creatureName: 'Dire Wolf',
                    hp: { current: 30, max: 37 },
                    ac: 14,
                },
            });

            const migrated = migrateCharacterData(data, '1.0');
            expect(migrated.baseAC).toBe(15);
            expect(migrated.mageArmour).toBe(true);
            expect(migrated.shield).toBe(true);
            expect(migrated.concentration).toBe('Fireball');
            expect(migrated.attunement).toEqual(['Ring of Protection', 'Cloak of Invisibility']);
            expect(migrated.inventory).toEqual(['Spellbook', 'Component Pouch']);
            expect(migrated.transformed).toEqual({
                active: true,
                creatureName: 'Dire Wolf',
                hp: { current: 30, max: 37 },
                ac: 14,
            });
        });
    });
});

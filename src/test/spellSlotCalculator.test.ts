import { describe, it, expect } from 'vitest';
import {
    calculateCasterLevel,
    getSpellSlots,
    formatClassLevels,
    type ClassLevel,
} from '../utils/spellSlotCalculator';

describe('Multiclass Spell Slot Calculator', () => {
    describe('calculateCasterLevel', () => {
        it('sums full, half, and third casters with rounding down', () => {
            const classLevels: ClassLevel[] = [
                { className: 'Wizard', level: 5, casterType: 'full' },
                { className: 'Paladin', level: 5, casterType: 'half' },
                { className: 'Fighter (Eldritch Knight)', level: 9, casterType: 'third' },
            ];

            expect(calculateCasterLevel(classLevels)).toBe(10);
        });

        it('ignores non-casters and clamps to level 20', () => {
            const classLevels: ClassLevel[] = [
                { className: 'Wizard', level: 18, casterType: 'full' },
                { className: 'Ranger', level: 10, casterType: 'half' },
                { className: 'Barbarian', level: 5, casterType: 'none' },
            ];

            expect(calculateCasterLevel(classLevels)).toBe(20);
        });
    });

    describe('getSpellSlots', () => {
        it('returns empty slots for caster level 0', () => {
            expect(getSpellSlots(0)).toEqual({});
        });

        it('returns correct slots for caster level 5', () => {
            const slots = getSpellSlots(5);
            expect(slots[1]).toBe(4);
            expect(slots[2]).toBe(3);
            expect(slots[3]).toBe(2);
            expect(slots[4]).toBeUndefined();
        });

        it('clamps caster level below 0 and above 20', () => {
            expect(getSpellSlots(-2)).toEqual({});
            expect(getSpellSlots(999)[9]).toBe(1);
        });
    });

    describe('formatClassLevels', () => {
        it('formats class levels for display and skips zeros', () => {
            const classLevels: ClassLevel[] = [
                { className: 'Wizard', level: 5, casterType: 'full' },
                { className: 'Rogue', level: 0, casterType: 'none' },
                { className: 'Paladin', level: 2, casterType: 'half' },
            ];

            expect(formatClassLevels(classLevels)).toBe('Wizard 5 / Paladin 2');
        });
    });
});

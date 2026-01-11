/**
 * V3.0 Tests - Spell Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  getAvailableSlots,
  resolveSpellEffect,
  getValidCastLevels,
  formatSpellEffect,
} from '../../store/utils/spellUtils';
import { v3SampleSpells } from '../../data/v3Spells';

describe('V3.0 Spell Utilities', () => {
  describe('getAvailableSlots', () => {
    it('returns available spell slots', () => {
      const slots = {
        1: { used: 2, max: 4 },
        2: { used: 1, max: 3 },
        3: { used: 0, max: 2 },
      };
      
      const available = getAvailableSlots(slots, 1);
      
      expect(available).toHaveLength(3);
      expect(available[0]).toEqual({ level: 1, total: 4, used: 2, available: 2 });
      expect(available[1]).toEqual({ level: 2, total: 3, used: 1, available: 2 });
      expect(available[2]).toEqual({ level: 3, total: 2, used: 0, available: 2 });
    });

    it('filters out fully used slots', () => {
      const slots = {
        1: { used: 4, max: 4 },
        2: { used: 3, max: 3 },
        3: { used: 0, max: 2 },
      };
      
      const available = getAvailableSlots(slots, 1);
      
      expect(available).toHaveLength(1);
      expect(available[0].level).toBe(3);
    });

    it('respects minimum level', () => {
      const slots = {
        1: { used: 0, max: 4 },
        2: { used: 0, max: 3 },
        3: { used: 0, max: 2 },
      };
      
      const available = getAvailableSlots(slots, 2);
      
      expect(available).toHaveLength(2);
      expect(available[0].level).toBe(2);
      expect(available[1].level).toBe(3);
    });
  });

  describe('resolveSpellEffect', () => {
    it('returns base effect for non-scaling spells', () => {
      const shield = v3SampleSpells.find(s => s.id === 'shield')!;
      const result = resolveSpellEffect(shield, 1);
      
      expect(result.level).toBe(1);
      expect(result.description).toBe(shield.description);
    });

    it('resolves scaling formulas with slot_level', () => {
      const magicMissile = v3SampleSpells.find(s => s.id === 'magic-missile')!;
      
      const level1 = resolveSpellEffect(magicMissile, 1);
      expect(level1.resolvedEffect).toContain('3 darts'); // 1+2
      
      const level3 = resolveSpellEffect(magicMissile, 3);
      expect(level3.resolvedEffect).toContain('5 darts'); // 3+2
    });
  });

  describe('getValidCastLevels', () => {
    it('returns slot levels >= spell level', () => {
      const fireball = v3SampleSpells.find(s => s.id === 'fireball')!;
      const availableSlots = [
        { level: 1, total: 4, used: 0, available: 4 },
        { level: 2, total: 3, used: 0, available: 3 },
        { level: 3, total: 2, used: 0, available: 2 },
        { level: 4, total: 1, used: 0, available: 1 },
      ];
      
      const validLevels = getValidCastLevels(fireball, availableSlots);
      
      expect(validLevels).toEqual([3, 4]);
    });

    it('returns empty array if no valid slots', () => {
      const fireball = v3SampleSpells.find(s => s.id === 'fireball')!;
      const availableSlots = [
        { level: 1, total: 4, used: 0, available: 4 },
        { level: 2, total: 3, used: 0, available: 3 },
      ];
      
      const validLevels = getValidCastLevels(fireball, availableSlots);
      
      expect(validLevels).toEqual([]);
    });
  });

  describe('formatSpellEffect', () => {
    it('formats base level effect', () => {
      const spell = v3SampleSpells.find(s => s.id === 'magic-missile')!;
      const formatted = formatSpellEffect(spell, 1);
      
      expect(formatted).toBeTruthy();
    });

    it('shows upcast bonus for higher levels', () => {
      const spell = v3SampleSpells.find(s => s.id === 'fireball')!;
      const formatted = formatSpellEffect(spell, 5);
      
      expect(formatted).toContain('+2 level'); // 5 - 3 = 2
    });
  });
});

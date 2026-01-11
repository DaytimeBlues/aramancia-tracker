/**
 * V3.0 Tests - Derived Selectors
 */

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import actorReducer from '../../store/slices/actorSlice';
import effectsReducer from '../../store/slices/effectsSlice';
import {
  selectProficiencyBonus,
  selectAbilityModifiers,
  selectSpellSaveDC,
  selectSpellAttackBonus,
  selectMaxHP,
  selectArmorClass,
} from '../../store/selectors/derivedSelectors';

// Helper to create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      actor: actorReducer,
      effects: effectsReducer,
      spells: () => ({ ids: [], entities: {} }), // Mock spells
      concentration: () => ({ current: { active: false, effectIds: [] }, prompt: null }),
    },
  });
};

describe('V3.0 Derived Selectors', () => {
  describe('selectProficiencyBonus', () => {
    it('calculates proficiency bonus from level', () => {
      const store = createTestStore();
      
      // Default level 5 -> +3
      expect(selectProficiencyBonus(store.getState())).toBe(3);
    });

    it('updates when level changes', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setLevel', payload: 1 });
      expect(selectProficiencyBonus(store.getState())).toBe(2);
      
      store.dispatch({ type: 'actor/setLevel', payload: 9 });
      expect(selectProficiencyBonus(store.getState())).toBe(4);
      
      store.dispatch({ type: 'actor/setLevel', payload: 17 });
      expect(selectProficiencyBonus(store.getState())).toBe(6);
    });
  });

  describe('selectAbilityModifiers', () => {
    it('calculates ability modifiers from scores', () => {
      const store = createTestStore();
      const mods = selectAbilityModifiers(store.getState());
      
      // Default INT 17 -> +3
      expect(mods.int).toBe(3);
      // Default DEX 14 -> +2
      expect(mods.dex).toBe(2);
      // Default CON 14 -> +2
      expect(mods.con).toBe(2);
    });

    it('updates when attributes change', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setAttribute', payload: { ability: 'int', value: 20 } });
      const mods = selectAbilityModifiers(store.getState());
      expect(mods.int).toBe(5);
    });
  });

  describe('selectSpellSaveDC', () => {
    it('calculates spell save DC', () => {
      const store = createTestStore();
      
      // 8 + profBonus(3) + intMod(3) = 14
      expect(selectSpellSaveDC(store.getState())).toBe(14);
    });

    it('updates when level or INT changes', () => {
      const store = createTestStore();
      
      // Increase INT to 20 (+5)
      store.dispatch({ type: 'actor/setAttribute', payload: { ability: 'int', value: 20 } });
      // 8 + 3 + 5 = 16
      expect(selectSpellSaveDC(store.getState())).toBe(16);
      
      // Increase level to 9 (prof +4)
      store.dispatch({ type: 'actor/setLevel', payload: 9 });
      // 8 + 4 + 5 = 17
      expect(selectSpellSaveDC(store.getState())).toBe(17);
    });

    it('respects overrides', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setOverride', payload: { key: 'spellSaveDC', value: 99 } });
      expect(selectSpellSaveDC(store.getState())).toBe(99);
    });
  });

  describe('selectSpellAttackBonus', () => {
    it('calculates spell attack bonus', () => {
      const store = createTestStore();
      
      // profBonus(3) + intMod(3) = +6
      expect(selectSpellAttackBonus(store.getState())).toBe(6);
    });

    it('updates when stats change', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setAttribute', payload: { ability: 'int', value: 18 } });
      // 3 + 4 = +7
      expect(selectSpellAttackBonus(store.getState())).toBe(7);
    });

    it('respects overrides', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setOverride', payload: { key: 'spellAttackBonus', value: 10 } });
      expect(selectSpellAttackBonus(store.getState())).toBe(10);
    });
  });

  describe('selectMaxHP', () => {
    it('calculates max HP from level, CON, and hit die', () => {
      const store = createTestStore();
      
      // Level 5 wizard (d6), CON 14 (+2)
      // L1: 6 + 2 = 8
      // L2-5: 4 * (4 + 2) = 24
      // Total: 32
      expect(selectMaxHP(store.getState())).toBe(32);
    });

    it('updates when CON changes', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setAttribute', payload: { ability: 'con', value: 16 } });
      // L1: 6 + 3 = 9
      // L2-5: 4 * (4 + 3) = 28
      // Total: 37
      expect(selectMaxHP(store.getState())).toBe(37);
    });

    it('respects overrides', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setOverride', payload: { key: 'maxHp', value: 100 } });
      expect(selectMaxHP(store.getState())).toBe(100);
    });
  });

  describe('selectArmorClass', () => {
    it('calculates default AC (10 + DEX)', () => {
      const store = createTestStore();
      
      // 10 + dexMod(2) = 12
      expect(selectArmorClass(store.getState())).toBe(12);
    });

    it('updates when DEX changes', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setAttribute', payload: { ability: 'dex', value: 20 } });
      // 10 + 5 = 15
      expect(selectArmorClass(store.getState())).toBe(15);
    });

    it('respects overrides', () => {
      const store = createTestStore();
      
      store.dispatch({ type: 'actor/setOverride', payload: { key: 'ac', value: 18 } });
      expect(selectArmorClass(store.getState())).toBe(18);
    });
  });
});

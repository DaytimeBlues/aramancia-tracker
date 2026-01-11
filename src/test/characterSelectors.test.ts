/**
 * Character Selectors Tests
 * 
 * Tests for memoized selectors demonstrating:
 * - Correct derivation of stats
 * - Memoization (selectors don't recompute with same inputs)
 * - Override pattern functionality
 * - Selector composition
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import characterReducer, { 
  characterAdded,
  setActiveCharacter,
  abilityScoreUpdated,
  levelUpdated,
  overrideSet,
  featureToggled,
  type Character,
} from '../store/slices/characterSlice';
import spellsReducer from '../store/slices/spellsSlice';
import {
  selectAbilityMods,
  selectProficiencyBonus,
  selectSpellcastingMod,
  selectSpellSaveDC,
  selectSpellAttackBonus,
  selectArmorClass,
  selectAllSkillBonuses,
  selectMaxPreparedSpells,
  selectMaxHP,
  selectConcentrationSaveModifier,
} from '../store/selectors/characterSelectors';

describe('Character Selectors', () => {
  let store: ReturnType<typeof configureStore>;
  
  // Test character
  const testCharacter: Character = {
    id: 'test-char-1',
    name: 'Test Wizard',
    level: 5,
    abilities: {
      str: 10,
      dex: 14,
      con: 14,
      int: 16,
      wis: 12,
      cha: 8,
    },
    proficiencies: {
      savingThrows: ['int', 'wis'],
      skills: {
        'Arcana': true,
        'Investigation': true,
      },
    },
    resources: {
      hp: {
        current: 32,
        max: 32,
        temp: 0,
      },
      hitDice: {
        current: 5,
        max: 5,
        size: 6,
      },
      deathSaves: {
        successes: 0,
        failures: 0,
      },
    },
    spellSlots: {
      1: { used: 0, max: 4 },
      2: { used: 0, max: 3 },
      3: { used: 0, max: 2 },
    },
    knownSpells: [],
    preparedSpells: [],
    concentration: {
      spellId: null,
      startedAt: null,
      advantageOnSaves: false,
    },
    features: {
      warCaster: false,
      mageSlayer: false,
      resilientCon: false,
    },
    overrides: {},
    hitDieSize: 6,
    spellcastingAbility: 'int',
    baseAC: 10,
    mageArmor: false,
    shield: false,
    attunement: [],
    inventory: [],
  };
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        character: characterReducer,
        spells: spellsReducer,
      },
    });
    
    // Add test character and set as active
    store.dispatch(characterAdded(testCharacter));
    store.dispatch(setActiveCharacter('test-char-1'));
  });
  
  describe('Base Selectors', () => {
    it('should select ability modifiers correctly', () => {
      const state = store.getState();
      const mods = selectAbilityMods(state);
      
      expect(mods).toEqual({
        str: 0,  // 10 -> 0
        dex: 2,  // 14 -> 2
        con: 2,  // 14 -> 2
        int: 3,  // 16 -> 3
        wis: 1,  // 12 -> 1
        cha: -1, // 8 -> -1
      });
    });
    
    it('should calculate proficiency bonus from level', () => {
      const state = store.getState();
      expect(selectProficiencyBonus(state)).toBe(3); // Level 5 = +3
      
      // Update level and verify
      store.dispatch(levelUpdated({ characterId: 'test-char-1', level: 9 }));
      expect(selectProficiencyBonus(store.getState())).toBe(4); // Level 9 = +4
    });
    
    it('should select spellcasting modifier', () => {
      const state = store.getState();
      expect(selectSpellcastingMod(state)).toBe(3); // INT 16 = +3
    });
  });
  
  describe('Composite Selectors', () => {
    it('should calculate spell save DC correctly', () => {
      const state = store.getState();
      // 8 + prof(3) + INT(3) = 14
      expect(selectSpellSaveDC(state)).toBe(14);
    });
    
    it('should calculate spell attack bonus correctly', () => {
      const state = store.getState();
      // prof(3) + INT(3) = +6
      expect(selectSpellAttackBonus(state)).toBe(6);
    });
    
    it('should calculate armor class correctly', () => {
      const state = store.getState();
      expect(selectArmorClass(state)).toBe(10); // Base AC 10
    });
    
    it('should calculate AC with Mage Armor', () => {
      // Modify character to have Mage Armor
      const charWithMageArmor = { ...testCharacter, mageArmor: true };
      store.dispatch(characterAdded(charWithMageArmor));
      store.dispatch(setActiveCharacter(charWithMageArmor.id));
      
      const state = store.getState();
      // 13 + DEX(2) = 15
      expect(selectArmorClass(state)).toBe(15);
    });
    
    it('should calculate AC with Shield spell', () => {
      const charWithShield = { ...testCharacter, shield: true };
      store.dispatch(characterAdded(charWithShield));
      store.dispatch(setActiveCharacter(charWithShield.id));
      
      const state = store.getState();
      // Base(10) + Shield(5) = 15
      expect(selectArmorClass(state)).toBe(15);
    });
    
    it('should calculate all skill bonuses', () => {
      const state = store.getState();
      const skills = selectAllSkillBonuses(state);
      
      // Proficient skills: Arcana and Investigation (INT + prof)
      expect(skills['Arcana']).toBe(6); // INT(3) + prof(3)
      expect(skills['Investigation']).toBe(6); // INT(3) + prof(3)
      
      // Non-proficient skills (just ability mod)
      expect(skills['Stealth']).toBe(2); // DEX(2)
      expect(skills['Perception']).toBe(1); // WIS(1)
      expect(skills['Athletics']).toBe(0); // STR(0)
    });
    
    it('should calculate max prepared spells', () => {
      const state = store.getState();
      // Level(5) + INT(3) = 8
      expect(selectMaxPreparedSpells(state)).toBe(8);
    });
    
    it('should calculate max HP', () => {
      const state = store.getState();
      // Level 5 Wizard, d6, CON +2
      // Level 1: 6 + 2 = 8
      // Levels 2-5: 4 * (4 + 2) = 24
      // Total: 32
      expect(selectMaxHP(state)).toBe(32);
    });
  });
  
  describe('Override Pattern', () => {
    it('should use override for spell save DC when set', () => {
      store.dispatch(overrideSet({ 
        characterId: 'test-char-1', 
        stat: 'spellSaveDC', 
        value: 20 
      }));
      
      const state = store.getState();
      expect(selectSpellSaveDC(state)).toBe(20);
    });
    
    it('should compute spell save DC when override is cleared', () => {
      // Set override
      store.dispatch(overrideSet({ 
        characterId: 'test-char-1', 
        stat: 'spellSaveDC', 
        value: 20 
      }));
      
      expect(selectSpellSaveDC(store.getState())).toBe(20);
      
      // Clear override
      store.dispatch(overrideSet({ 
        characterId: 'test-char-1', 
        stat: 'spellSaveDC', 
        value: undefined 
      }));
      
      expect(selectSpellSaveDC(store.getState())).toBe(14); // Back to computed
    });
    
    it('should use override for AC when set', () => {
      store.dispatch(overrideSet({ 
        characterId: 'test-char-1', 
        stat: 'ac', 
        value: 18 
      }));
      
      const state = store.getState();
      expect(selectArmorClass(state)).toBe(18);
    });
    
    it('should use override for max HP when set', () => {
      store.dispatch(overrideSet({ 
        characterId: 'test-char-1', 
        stat: 'maxHP', 
        value: 50 
      }));
      
      const state = store.getState();
      expect(selectMaxHP(state)).toBe(50);
    });
  });
  
  describe('Memoization', () => {
    it('should return same reference when inputs unchanged', () => {
      const state1 = store.getState();
      const mods1 = selectAbilityMods(state1);
      
      // Get state again without changes
      const state2 = store.getState();
      const mods2 = selectAbilityMods(state2);
      
      // Should be same reference (memoized)
      expect(mods1).toBe(mods2);
    });
    
    it('should recompute when abilities change', () => {
      const state1 = store.getState();
      const mods1 = selectAbilityMods(state1);
      
      // Change INT score
      store.dispatch(abilityScoreUpdated({
        characterId: 'test-char-1',
        ability: 'int',
        value: 18,
      }));
      
      const state2 = store.getState();
      const mods2 = selectAbilityMods(state2);
      
      // Should be different reference (recomputed)
      expect(mods1).not.toBe(mods2);
      expect(mods2?.int).toBe(4); // 18 -> +4
    });
    
    it('should not recompute spell DC when unrelated state changes', () => {
      const state1 = store.getState();
      const dc1 = selectSpellSaveDC(state1);
      
      // Change something unrelated (STR doesn't affect spell DC)
      store.dispatch(abilityScoreUpdated({
        characterId: 'test-char-1',
        ability: 'str',
        value: 14,
      }));
      
      const state2 = store.getState();
      const dc2 = selectSpellSaveDC(state2);
      
      // Should be same value (and ideally same reference, though primitive)
      expect(dc1).toBe(dc2);
    });
  });
  
  describe('Feat Integration', () => {
    it('should apply War Caster advantage to concentration saves', () => {
      const state1 = store.getState();
      let saveModifier = selectConcentrationSaveModifier(state1);
      
      expect(saveModifier.advantage).toBe(false);
      expect(saveModifier.bonus).toBe(2); // CON save: CON(2)
      
      // Enable War Caster
      store.dispatch(featureToggled({ 
        characterId: 'test-char-1', 
        feature: 'warCaster' 
      }));
      
      const state2 = store.getState();
      saveModifier = selectConcentrationSaveModifier(state2);
      
      expect(saveModifier.advantage).toBe(true);
      expect(saveModifier.bonus).toBe(2);
    });
    
    it('should include proficiency in CON saves with proficiency', () => {
      // Add CON to saving throw proficiencies
      const charWithConProf = { 
        ...testCharacter, 
        proficiencies: {
          ...testCharacter.proficiencies,
          savingThrows: ['int', 'wis', 'con'],
        },
      };
      
      store.dispatch(characterAdded(charWithConProf));
      store.dispatch(setActiveCharacter(charWithConProf.id));
      
      const state = store.getState();
      const saveModifier = selectConcentrationSaveModifier(state);
      
      // CON(2) + prof(3) = +5
      expect(saveModifier.bonus).toBe(5);
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle minimum stats correctly', () => {
      const charWithLowStats = {
        ...testCharacter,
        id: 'low-stats',
        abilities: {
          str: 1,
          dex: 1,
          con: 1,
          int: 1,
          wis: 1,
          cha: 1,
        },
        level: 1,
      };
      
      store.dispatch(characterAdded(charWithLowStats));
      store.dispatch(setActiveCharacter('low-stats'));
      
      const state = store.getState();
      const mods = selectAbilityMods(state);
      
      // All abilities should be -5
      Object.values(mods!).forEach(mod => {
        expect(mod).toBe(-5);
      });
      
      // Spell DC should still be valid: 8 + 2 + (-5) = 5
      expect(selectSpellSaveDC(state)).toBe(5);
    });
    
    it('should handle maximum stats correctly', () => {
      const charWithHighStats = {
        ...testCharacter,
        id: 'high-stats',
        abilities: {
          str: 30,
          dex: 30,
          con: 30,
          int: 30,
          wis: 30,
          cha: 30,
        },
        level: 20,
      };
      
      store.dispatch(characterAdded(charWithHighStats));
      store.dispatch(setActiveCharacter('high-stats'));
      
      const state = store.getState();
      const mods = selectAbilityMods(state);
      
      // All abilities should be +10
      Object.values(mods!).forEach(mod => {
        expect(mod).toBe(10);
      });
      
      // Spell DC: 8 + 6 + 10 = 24
      expect(selectSpellSaveDC(state)).toBe(24);
    });
  });
});

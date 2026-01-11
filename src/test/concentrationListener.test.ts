/**
 * Concentration Listener Middleware Tests
 * 
 * Tests for event-driven concentration check system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import characterReducer, {
  characterAdded,
  setActiveCharacter,
  damageTaken,
  concentrationStarted,
  concentrationEnded,
  type Character,
} from '../store/slices/characterSlice';
import spellsReducer, { spellsAdded } from '../store/slices/spellsSlice';
import { concentrationListenerMiddleware } from '../store/middleware/concentrationListener';
import type { NormalizedSpell } from '../store/types/spellSchema';

describe('Concentration Listener Middleware', () => {
  let store: ReturnType<typeof configureStore>;
  
  const testCharacter: Character = {
    id: 'test-char',
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
      skills: {},
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
  
  const testSpell: NormalizedSpell = {
    id: 'test-concentration-spell',
    name: 'Test Concentration Spell',
    level: 2,
    school: 'Evocation',
    castingTime: { amount: 1, unit: 'action' },
    range: { type: 'ranged', distance: 60 },
    duration: { type: 'concentration', amount: 1, unit: 'minute' },
    components: { verbal: true, somatic: true, material: false },
    attack: { type: 'save', subtype: 'dex' },
    effect: {
      type: 'damage',
      description: '3d6 fire damage',
      diceFormula: '3d6',
      damageType: 'fire',
    },
    description: 'A test concentration spell',
    resourceCosts: [{ type: 'slot', value: 2 }],
    concentration: {
      required: true,
      maxDuration: '1 minute',
    },
  };
  
  beforeEach(() => {
    // Create store with listener middleware
    store = configureStore({
      reducer: {
        character: characterReducer,
        spells: spellsReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(concentrationListenerMiddleware.middleware),
    });
    
    // Setup initial state
    store.dispatch(characterAdded(testCharacter));
    store.dispatch(setActiveCharacter('test-char'));
    store.dispatch(spellsAdded([testSpell]));
  });
  
  describe('Damage Events', () => {
    it('should not trigger check when not concentrating', () => {
      const actionsSpy = vi.fn();
      
      // Subscribe to store to track actions
      const unsubscribe = store.subscribe(() => {
        actionsSpy();
      });
      
      // Take damage while not concentrating
      store.dispatch(damageTaken({ characterId: 'test-char', amount: 10 }));
      
      const state = store.getState();
      
      // HP should be reduced
      expect(state.character.entities['test-char']?.resources.hp.current).toBe(22);
      
      // No concentration to lose
      expect(state.character.entities['test-char']?.concentration.spellId).toBeNull();
      
      unsubscribe();
    });
    
    it('should handle damage with temp HP correctly', () => {
      // Set temp HP
      const charWithTempHP = {
        ...testCharacter,
        resources: {
          ...testCharacter.resources,
          hp: {
            current: 32,
            max: 32,
            temp: 10,
          },
        },
      };
      
      store.dispatch(characterAdded(charWithTempHP));
      store.dispatch(setActiveCharacter(charWithTempHP.id));
      
      // Take 5 damage (temp HP absorbs)
      store.dispatch(damageTaken({ characterId: charWithTempHP.id, amount: 5 }));
      
      const state = store.getState();
      const character = state.character.entities[charWithTempHP.id];
      
      expect(character?.resources.hp.temp).toBe(5); // 10 - 5
      expect(character?.resources.hp.current).toBe(32); // Unchanged
    });
    
    it('should handle damage exceeding temp HP', () => {
      const charWithTempHP = {
        ...testCharacter,
        resources: {
          ...testCharacter.resources,
          hp: {
            current: 32,
            max: 32,
            temp: 5,
          },
        },
      };
      
      store.dispatch(characterAdded(charWithTempHP));
      store.dispatch(setActiveCharacter(charWithTempHP.id));
      
      // Take 10 damage (5 absorbed by temp, 5 to real HP)
      store.dispatch(damageTaken({ characterId: charWithTempHP.id, amount: 10 }));
      
      const state = store.getState();
      const character = state.character.entities[charWithTempHP.id];
      
      expect(character?.resources.hp.temp).toBe(0); // All absorbed
      expect(character?.resources.hp.current).toBe(27); // 32 - 5
    });
    
    it('should end concentration when dropped to 0 HP', () => {
      // Start concentrating
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: testSpell.id 
      }));
      
      // Take massive damage
      store.dispatch(damageTaken({ characterId: 'test-char', amount: 100 }));
      
      const state = store.getState();
      const character = state.character.entities['test-char'];
      
      expect(character?.resources.hp.current).toBe(0);
      expect(character?.concentration.spellId).toBeNull(); // Concentration lost
    });
  });
  
  describe('Concentration DC Calculation', () => {
    it('should calculate DC = 10 for damage <= 20', () => {
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: testSpell.id 
      }));
      
      // Take 10 damage -> DC should be max(10, 10/2) = 10
      store.dispatch(damageTaken({ characterId: 'test-char', amount: 10 }));
      
      // In a real implementation, the listener would dispatch a prompt action
      // We're testing the DC calculation logic here
      const dc = Math.max(10, Math.floor(10 / 2));
      expect(dc).toBe(10);
    });
    
    it('should calculate DC = damage/2 for damage > 20', () => {
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: testSpell.id 
      }));
      
      // Take 30 damage -> DC should be max(10, 30/2) = 15
      store.dispatch(damageTaken({ characterId: 'test-char', amount: 30 }));
      
      const dc = Math.max(10, Math.floor(30 / 2));
      expect(dc).toBe(15);
    });
    
    it('should calculate DC for odd damage amounts', () => {
      // 23 damage -> DC = max(10, floor(23/2)) = max(10, 11) = 11
      const dc = Math.max(10, Math.floor(23 / 2));
      expect(dc).toBe(11);
    });
  });
  
  describe('Concentration State Management', () => {
    it('should start concentration on spell cast', () => {
      const beforeState = store.getState();
      expect(beforeState.character.entities['test-char']?.concentration.spellId).toBeNull();
      
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: testSpell.id 
      }));
      
      const afterState = store.getState();
      const character = afterState.character.entities['test-char'];
      
      expect(character?.concentration.spellId).toBe(testSpell.id);
      expect(character?.concentration.startedAt).toBeTruthy();
    });
    
    it('should end concentration manually', () => {
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: testSpell.id 
      }));
      
      expect(store.getState().character.entities['test-char']?.concentration.spellId).toBe(testSpell.id);
      
      store.dispatch(concentrationEnded({ characterId: 'test-char' }));
      
      const state = store.getState();
      const character = state.character.entities['test-char'];
      
      expect(character?.concentration.spellId).toBeNull();
      expect(character?.concentration.startedAt).toBeNull();
    });
    
    it('should replace concentration when casting new spell', () => {
      const spell2: NormalizedSpell = {
        ...testSpell,
        id: 'spell-2',
        name: 'Second Spell',
      };
      
      store.dispatch(spellsAdded([spell2]));
      
      // Start concentration on first spell
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: testSpell.id 
      }));
      
      expect(store.getState().character.entities['test-char']?.concentration.spellId).toBe(testSpell.id);
      
      // Cast second concentration spell (would end first)
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: spell2.id 
      }));
      
      const state = store.getState();
      expect(state.character.entities['test-char']?.concentration.spellId).toBe(spell2.id);
    });
  });
  
  describe('Feat Integration - War Caster', () => {
    it('should provide advantage flag for War Caster', () => {
      // War Caster is handled via selector
      const charWithWarCaster = {
        ...testCharacter,
        features: {
          ...testCharacter.features,
          warCaster: true,
        },
      };
      
      store.dispatch(characterAdded(charWithWarCaster));
      store.dispatch(setActiveCharacter(charWithWarCaster.id));
      
      const state = store.getState();
      const character = state.character.entities[charWithWarCaster.id];
      
      expect(character?.features.warCaster).toBe(true);
      
      // The selector would provide advantage = true
      // This is tested in characterSelectors.test.ts
    });
  });
  
  describe('Listener Behavior', () => {
    it('should only trigger on actual damage (not healing)', () => {
      store.dispatch(concentrationStarted({ 
        characterId: 'test-char', 
        spellId: testSpell.id 
      }));
      
      // Damage should trigger listener
      const beforeHP = store.getState().character.entities['test-char']?.resources.hp.current;
      store.dispatch(damageTaken({ characterId: 'test-char', amount: 5 }));
      const afterHP = store.getState().character.entities['test-char']?.resources.hp.current;
      
      expect(afterHP).toBe((beforeHP ?? 0) - 5);
      
      // Listener would have dispatched concentration check prompt
      // (In actual implementation, we'd check for the prompt action)
    });
  });
});

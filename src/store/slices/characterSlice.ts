/**
 * Character Slice - D&D 5e Character State
 * 
 * This slice manages character state with:
 * - Base attributes (ability scores, level, proficiency)
 * - Derived stats handled via selectors (NOT stored here to avoid denormalization)
 * - Spell references by ID (NOT embedded spell data)
 * - Resource tracking (HP, spell slots, etc.)
 * - Override support for manual stat adjustments
 * 
 * Design principle: Store only base state. Derive everything else via selectors.
 */

import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import type { CharacterSpellState } from '../types/spellSchema';
import type { RootState } from '../store';

/**
 * Base ability scores
 */
export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

/**
 * Proficiency configuration
 */
export interface Proficiencies {
  savingThrows: Array<keyof AbilityScores>;
  skills: Record<string, boolean>; // skill name -> proficient
}

/**
 * Combat resources
 */
export interface CombatResources {
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  hitDice: {
    current: number;
    max: number;
    size: number;
  };
  deathSaves: {
    successes: number;
    failures: number;
  };
}

/**
 * Spell slots state
 */
export interface SpellSlots {
  [level: number]: {
    used: number;
    max: number;
  };
}

/**
 * Manual stat overrides
 * Allows players to override derived values without breaking the relational model
 */
export interface StatOverrides {
  /** Override AC calculation */
  ac?: number;
  /** Override spell save DC */
  spellSaveDC?: number;
  /** Override spell attack bonus */
  spellAttackBonus?: number;
  /** Override max HP */
  maxHP?: number;
  /** Override initiative bonus */
  initiative?: number;
}

/**
 * Concentration state
 */
export interface ConcentrationState {
  /** Currently concentrating spell ID (if any) */
  spellId: string | null;
  /** When concentration started (timestamp) */
  startedAt: number | null;
  /** Any modifiers to concentration checks (e.g., War Caster) */
  advantageOnSaves: boolean;
}

/**
 * Feat/feature flags that affect game mechanics
 */
export interface CharacterFeatures {
  /** War Caster feat: advantage on concentration saves */
  warCaster: boolean;
  /** Mage Slayer feat: enemy has disadvantage when you're adjacent */
  mageSlayer: boolean;
  /** Resilient (Constitution): proficiency in CON saves */
  resilientCon: boolean;
}

/**
 * Full character entity
 */
export interface Character {
  id: string;
  name: string;
  level: number;
  
  /** Base ability scores (everything else derived) */
  abilities: AbilityScores;
  
  /** Proficiencies */
  proficiencies: Proficiencies;
  
  /** Combat resources */
  resources: CombatResources;
  
  /** Spell slots */
  spellSlots: SpellSlots;
  
  /** Spell references (by ID) - separate from spell entities */
  knownSpells: string[]; // For known-spell casters
  preparedSpells: CharacterSpellState[]; // For prepared-spell casters
  
  /** Concentration state */
  concentration: ConcentrationState;
  
  /** Features/Feats that affect mechanics */
  features: CharacterFeatures;
  
  /** Manual overrides for derived stats */
  overrides: StatOverrides;
  
  /** Hit die size (class-dependent) */
  hitDieSize: number;
  
  /** Spellcasting ability (INT, WIS, or CHA) */
  spellcastingAbility: keyof AbilityScores;
  
  /** Maximum spells prepared (for prepared casters) */
  maxPreparedSpells?: number;
  
  /** Armor/equipment that affects AC */
  baseAC: number;
  mageArmor: boolean;
  shield: boolean;
  
  /** Additional state */
  attunement: string[]; // Max 3
  inventory: string[];
}

/**
 * Entity adapter for characters
 */
const charactersAdapter = createEntityAdapter<Character>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Initial state
 */
const initialState = charactersAdapter.getInitialState({
  activeCharacterId: null as string | null,
});

/**
 * Character slice
 */
const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    // Character CRUD
    characterAdded: charactersAdapter.addOne,
    characterUpdated: charactersAdapter.updateOne,
    characterRemoved: charactersAdapter.removeOne,
    
    // Set active character
    setActiveCharacter(state, action: PayloadAction<string | null>) {
      state.activeCharacterId = action.payload;
    },
    
    // Ability score updates
    abilityScoreUpdated(
      state,
      action: PayloadAction<{ characterId: string; ability: keyof AbilityScores; value: number }>
    ) {
      const { characterId, ability, value } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        character.abilities[ability] = value;
      }
    },
    
    // Level update
    levelUpdated(state, action: PayloadAction<{ characterId: string; level: number }>) {
      const { characterId, level } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        character.level = level;
      }
    },
    
    // HP updates
    hpChanged(state, action: PayloadAction<{ characterId: string; current: number }>) {
      const { characterId, current } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        character.resources.hp.current = current;
      }
    },
    
    tempHpChanged(state, action: PayloadAction<{ characterId: string; temp: number }>) {
      const { characterId, temp } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        character.resources.hp.temp = temp;
      }
    },
    
    // Damage taken (triggers concentration check via middleware)
    damageTaken(state, action: PayloadAction<{ characterId: string; amount: number }>) {
      const { characterId, amount } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        // Temp HP absorbs damage first (RAW)
        const tempAbsorbed = Math.min(character.resources.hp.temp, amount);
        const remainingDamage = amount - tempAbsorbed;
        
        character.resources.hp.temp -= tempAbsorbed;
        character.resources.hp.current = Math.max(0, character.resources.hp.current - remainingDamage);
        
        // If dropped to 0, lose concentration
        if (character.resources.hp.current === 0) {
          character.concentration.spellId = null;
          character.concentration.startedAt = null;
        }
      }
    },
    
    // Spell slot updates
    spellSlotUsed(state, action: PayloadAction<{ characterId: string; level: number }>) {
      const { characterId, level } = action.payload;
      const character = state.entities[characterId];
      if (character && character.spellSlots[level]) {
        character.spellSlots[level].used = Math.min(
          character.spellSlots[level].used + 1,
          character.spellSlots[level].max
        );
      }
    },
    
    spellSlotRestored(state, action: PayloadAction<{ characterId: string; level: number }>) {
      const { characterId, level } = action.payload;
      const character = state.entities[characterId];
      if (character && character.spellSlots[level]) {
        character.spellSlots[level].used = Math.max(0, character.spellSlots[level].used - 1);
      }
    },
    
    // Concentration management
    concentrationStarted(state, action: PayloadAction<{ characterId: string; spellId: string }>) {
      const { characterId, spellId } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        character.concentration.spellId = spellId;
        character.concentration.startedAt = Date.now();
      }
    },
    
    concentrationEnded(state, action: PayloadAction<{ characterId: string }>) {
      const { characterId } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        character.concentration.spellId = null;
        character.concentration.startedAt = null;
      }
    },
    
    // Spell preparation
    spellPrepared(state, action: PayloadAction<{ characterId: string; spellState: CharacterSpellState }>) {
      const { characterId, spellState } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        const existing = character.preparedSpells.find(s => s.spellId === spellState.spellId);
        if (existing) {
          existing.prepared = true;
        } else {
          character.preparedSpells.push(spellState);
        }
      }
    },
    
    spellUnprepared(state, action: PayloadAction<{ characterId: string; spellId: string }>) {
      const { characterId, spellId } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        const spell = character.preparedSpells.find(s => s.spellId === spellId);
        if (spell) {
          spell.prepared = false;
        }
      }
    },
    
    // Override updates
    overrideSet(
      state,
      action: PayloadAction<{ characterId: string; stat: keyof StatOverrides; value: number | undefined }>
    ) {
      const { characterId, stat, value } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        if (value === undefined) {
          delete character.overrides[stat];
        } else {
          character.overrides[stat] = value;
        }
      }
    },
    
    // Feature toggles
    featureToggled(
      state,
      action: PayloadAction<{ characterId: string; feature: keyof CharacterFeatures }>
    ) {
      const { characterId, feature } = action.payload;
      const character = state.entities[characterId];
      if (character) {
        character.features[feature] = !character.features[feature];
      }
    },
  },
});

/**
 * Export actions
 */
export const {
  characterAdded,
  characterUpdated,
  characterRemoved,
  setActiveCharacter,
  abilityScoreUpdated,
  levelUpdated,
  hpChanged,
  tempHpChanged,
  damageTaken,
  spellSlotUsed,
  spellSlotRestored,
  concentrationStarted,
  concentrationEnded,
  spellPrepared,
  spellUnprepared,
  overrideSet,
  featureToggled,
} = characterSlice.actions;

/**
 * Export reducer
 */
export default characterSlice.reducer;

/**
 * Base selectors
 */
export const characterSelectors = charactersAdapter.getSelectors<RootState>(
  (state) => state.character
);

export const {
  selectAll: selectAllCharacters,
  selectById: selectCharacterById,
  selectIds: selectCharacterIds,
  selectEntities: selectCharacterEntities,
  selectTotal: selectTotalCharacters,
} = characterSelectors;

/**
 * Select active character ID
 */
export const selectActiveCharacterId = (state: RootState) => state.character.activeCharacterId;

/**
 * Select active character entity
 */
export const selectActiveCharacter = (state: RootState) => {
  const activeId = selectActiveCharacterId(state);
  return activeId ? selectCharacterById(state, activeId) : null;
};

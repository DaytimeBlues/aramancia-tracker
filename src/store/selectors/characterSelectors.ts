/**
 * Character Selectors - Memoized Derived State
 * 
 * This file demonstrates a DAG (Directed Acyclic Graph) of selectors:
 * 
 * BASE SELECTORS (read raw state)
 *   ↓
 * INTERMEDIATE SELECTORS (compute modifiers, bonuses)
 *   ↓
 * COMPOSITE SELECTORS (compute final stats like spell DC, skill bonuses)
 * 
 * Key principles:
 * - Memoization: Selectors only recompute when inputs change
 * - Stable inputs: Use narrow selectors to minimize recalculations
 * - Layered: Build complex selectors from simple ones
 * - Testable: Each layer can be tested independently
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { selectActiveCharacter, selectCharacterById } from '../slices/characterSlice';
import { selectSpellById } from '../slices/spellsSlice';
import type { Character, AbilityScores } from '../slices/characterSlice';

// ============================================================================
// BASE SELECTORS - Read raw state directly
// ============================================================================

/**
 * Get character's ability scores
 */
export const selectCharacterAbilities = createSelector(
  [selectActiveCharacter],
  (character): AbilityScores | null => character?.abilities ?? null
);

/**
 * Get character's level
 */
export const selectCharacterLevel = createSelector(
  [selectActiveCharacter],
  (character): number => character?.level ?? 1
);

/**
 * Get character's spellcasting ability
 */
export const selectSpellcastingAbility = createSelector(
  [selectActiveCharacter],
  (character) => character?.spellcastingAbility ?? 'int'
);

/**
 * Get character's proficiencies
 */
export const selectProficiencies = createSelector(
  [selectActiveCharacter],
  (character) => character?.proficiencies ?? { savingThrows: [], skills: {} }
);

/**
 * Get character's features
 */
export const selectCharacterFeatures = createSelector(
  [selectActiveCharacter],
  (character) => character?.features ?? { warCaster: false, mageSlayer: false, resilientCon: false }
);

/**
 * Get character's overrides
 */
export const selectStatOverrides = createSelector(
  [selectActiveCharacter],
  (character) => character?.overrides ?? {}
);

/**
 * Get concentration state
 */
export const selectConcentrationState = createSelector(
  [selectActiveCharacter],
  (character) => character?.concentration ?? { spellId: null, startedAt: null, advantageOnSaves: false }
);

/**
 * Get spell slots
 */
export const selectSpellSlots = createSelector(
  [selectActiveCharacter],
  (character) => character?.spellSlots ?? {}
);

// ============================================================================
// INTERMEDIATE SELECTORS - Compute modifiers and bonuses
// ============================================================================

/**
 * Calculate ability modifier from score
 * SRD 5.1: floor((score - 10) / 2)
 */
const getAbilityMod = (score: number): number => Math.floor((score - 10) / 2);

/**
 * Calculate proficiency bonus from level
 * SRD 5.1: +2 (L1-4), +3 (L5-8), +4 (L9-12), +5 (L13-16), +6 (L17-20)
 */
const PROFICIENCY_BASE = 2;
const PROFICIENCY_LEVEL_DIVISOR = 4;

const getProfBonus = (level: number): number => 
  Math.floor((level - 1) / PROFICIENCY_LEVEL_DIVISOR) + PROFICIENCY_BASE;

/**
 * Memoized ability modifiers
 * Only recomputes when abilities change
 */
export const selectAbilityMods = createSelector(
  [selectCharacterAbilities],
  (abilities): Record<keyof AbilityScores, number> | null => {
    if (!abilities) return null;
    
    return {
      str: getAbilityMod(abilities.str),
      dex: getAbilityMod(abilities.dex),
      con: getAbilityMod(abilities.con),
      int: getAbilityMod(abilities.int),
      wis: getAbilityMod(abilities.wis),
      cha: getAbilityMod(abilities.cha),
    };
  }
);

/**
 * Memoized proficiency bonus
 * Only recomputes when level changes
 */
export const selectProficiencyBonus = createSelector(
  [selectCharacterLevel],
  (level): number => getProfBonus(level)
);

/**
 * Memoized spellcasting modifier
 * Only recomputes when abilities or spellcasting ability changes
 */
export const selectSpellcastingMod = createSelector(
  [selectAbilityMods, selectSpellcastingAbility],
  (mods, ability): number => mods?.[ability] ?? 0
);

/**
 * Calculate Constitution modifier
 */
export const selectConstitutionMod = createSelector(
  [selectAbilityMods],
  (mods): number => mods?.con ?? 0
);

/**
 * Calculate Dexterity modifier
 */
export const selectDexterityMod = createSelector(
  [selectAbilityMods],
  (mods): number => mods?.dex ?? 0
);

// ============================================================================
// COMPOSITE SELECTORS - Final derived stats
// ============================================================================

/**
 * Spell Save DC with override support
 * Formula: 8 + proficiency bonus + spellcasting modifier
 * Override pattern: overrides.spellSaveDC ?? computed value
 */
export const selectSpellSaveDC = createSelector(
  [selectProficiencyBonus, selectSpellcastingMod, selectStatOverrides],
  (profBonus, spellMod, overrides): number => {
    // Check for manual override first
    if (overrides.spellSaveDC !== undefined) {
      return overrides.spellSaveDC;
    }
    
    // Compute from base stats
    return 8 + profBonus + spellMod;
  }
);

/**
 * Spell Attack Bonus with override support
 * Formula: proficiency bonus + spellcasting modifier
 */
export const selectSpellAttackBonus = createSelector(
  [selectProficiencyBonus, selectSpellcastingMod, selectStatOverrides],
  (profBonus, spellMod, overrides): number => {
    if (overrides.spellAttackBonus !== undefined) {
      return overrides.spellAttackBonus;
    }
    
    return profBonus + spellMod;
  }
);

/**
 * Armor Class with override support
 * Handles base AC, Mage Armor, and Shield spell
 */
export const selectArmorClass = createSelector(
  [
    selectActiveCharacter,
    selectDexterityMod,
    selectStatOverrides,
  ],
  (character, dexMod, overrides): number => {
    if (!character) return 10;
    
    // Check for manual override first
    if (overrides.ac !== undefined) {
      return overrides.ac;
    }
    
    let ac = character.baseAC;
    
    // Mage Armor: base AC becomes 13 + DEX
    if (character.mageArmor) {
      ac = 13 + dexMod;
    }
    
    // Shield spell: +5 AC (stacks)
    if (character.shield) {
      ac += 5;
    }
    
    return ac;
  }
);

/**
 * Initiative bonus with override support
 * Formula: Dexterity modifier
 */
export const selectInitiativeBonus = createSelector(
  [selectDexterityMod, selectStatOverrides],
  (dexMod, overrides): number => {
    if (overrides.initiative !== undefined) {
      return overrides.initiative;
    }
    
    return dexMod;
  }
);

/**
 * Skill bonus calculator
 * Factory function that creates a memoized selector for a specific skill
 * 
 * @param skillName - Name of the skill (e.g., "Perception", "Stealth")
 * @param ability - Associated ability (e.g., "wis", "dex")
 */
export const makeSelectSkillBonus = (skillName: string, ability: keyof AbilityScores) => {
  return createSelector(
    [selectAbilityMods, selectProficiencyBonus, selectProficiencies],
    (mods, profBonus, proficiencies): number => {
      if (!mods) return 0;
      
      const abilityMod = mods[ability];
      const isProficient = proficiencies.skills[skillName] ?? false;
      
      return abilityMod + (isProficient ? profBonus : 0);
    }
  );
};

/**
 * Common skill selectors
 */
export const selectPerceptionBonus = makeSelectSkillBonus('Perception', 'wis');
export const selectStealthBonus = makeSelectSkillBonus('Stealth', 'dex');
export const selectArcanaBonus = makeSelectSkillBonus('Arcana', 'int');
export const selectInvestigationBonus = makeSelectSkillBonus('Investigation', 'int');

/**
 * All skill bonuses
 */
export const selectAllSkillBonuses = createSelector(
  [selectAbilityMods, selectProficiencyBonus, selectProficiencies],
  (mods, profBonus, proficiencies) => {
    if (!mods) return {};
    
    const skills = {
      // Strength
      Athletics: { ability: 'str' as const, mod: mods.str },
      
      // Dexterity
      Acrobatics: { ability: 'dex' as const, mod: mods.dex },
      'Sleight of Hand': { ability: 'dex' as const, mod: mods.dex },
      Stealth: { ability: 'dex' as const, mod: mods.dex },
      
      // Intelligence
      Arcana: { ability: 'int' as const, mod: mods.int },
      History: { ability: 'int' as const, mod: mods.int },
      Investigation: { ability: 'int' as const, mod: mods.int },
      Nature: { ability: 'int' as const, mod: mods.int },
      Religion: { ability: 'int' as const, mod: mods.int },
      
      // Wisdom
      'Animal Handling': { ability: 'wis' as const, mod: mods.wis },
      Insight: { ability: 'wis' as const, mod: mods.wis },
      Medicine: { ability: 'wis' as const, mod: mods.wis },
      Perception: { ability: 'wis' as const, mod: mods.wis },
      Survival: { ability: 'wis' as const, mod: mods.wis },
      
      // Charisma
      Deception: { ability: 'cha' as const, mod: mods.cha },
      Intimidation: { ability: 'cha' as const, mod: mods.cha },
      Performance: { ability: 'cha' as const, mod: mods.cha },
      Persuasion: { ability: 'cha' as const, mod: mods.cha },
    };
    
    const result: Record<string, number> = {};
    
    for (const [skillName, skillData] of Object.entries(skills)) {
      const isProficient = proficiencies.skills[skillName] ?? false;
      result[skillName] = skillData.mod + (isProficient ? profBonus : 0);
    }
    
    return result;
  }
);

/**
 * Saving throw bonuses
 */
export const selectSavingThrowBonuses = createSelector(
  [selectAbilityMods, selectProficiencyBonus, selectProficiencies],
  (mods, profBonus, proficiencies) => {
    if (!mods) return {};
    
    const result: Record<keyof AbilityScores, number> = {
      str: mods.str,
      dex: mods.dex,
      con: mods.con,
      int: mods.int,
      wis: mods.wis,
      cha: mods.cha,
    };
    
    // Add proficiency bonus to proficient saves
    for (const ability of proficiencies.savingThrows) {
      result[ability] += profBonus;
    }
    
    return result;
  }
);

/**
 * Maximum HP with override support
 */
export const selectMaxHP = createSelector(
  [selectActiveCharacter, selectCharacterLevel, selectConstitutionMod, selectStatOverrides],
  (character, level, conMod, overrides): number => {
    if (!character) return 0;
    
    // Check for manual override
    if (overrides.maxHP !== undefined) {
      return overrides.maxHP;
    }
    
    const hitDieSize = character.hitDieSize;
    
    // Level 1: max hit die + CON mod
    const level1HP = hitDieSize + conMod;
    
    // Levels 2+: average hit die + CON mod per level
    // Average = floor(hitDieSize / 2) + 1
    const avgPerLevel = Math.floor(hitDieSize / 2) + 1;
    const additionalLevels = level - 1;
    const additionalHP = additionalLevels * (avgPerLevel + conMod);
    
    const totalHP = level1HP + additionalHP;
    
    // Minimum 1 HP per level
    return Math.max(level, totalHP);
  }
);

/**
 * Available spell slots (unused slots per level)
 */
export const selectAvailableSpellSlots = createSelector(
  [selectSpellSlots],
  (slots) => {
    const available: Record<number, number> = {};
    
    for (const [level, slot] of Object.entries(slots)) {
      available[Number(level)] = slot.max - slot.used;
    }
    
    return available;
  }
);

/**
 * Maximum prepared spells
 * Formula: spellcasting modifier + character level (minimum 1)
 */
export const selectMaxPreparedSpells = createSelector(
  [selectSpellcastingMod, selectCharacterLevel, selectActiveCharacter],
  (spellMod, level, character): number => {
    // If character has explicit max, use it
    if (character?.maxPreparedSpells !== undefined) {
      return character.maxPreparedSpells;
    }
    
    // Standard formula
    return Math.max(1, spellMod + level);
  }
);

/**
 * Count of currently prepared spells
 */
export const selectPreparedSpellCount = createSelector(
  [selectActiveCharacter],
  (character): number => {
    if (!character) return 0;
    
    return character.preparedSpells.filter(s => s.prepared && !s.alwaysPrepared).length;
  }
);

/**
 * Can prepare more spells?
 */
export const selectCanPrepareMoreSpells = createSelector(
  [selectPreparedSpellCount, selectMaxPreparedSpells],
  (prepared, max): boolean => prepared < max
);

/**
 * Currently concentrating spell (full spell entity)
 */
export const selectConcentratingSpell = createSelector(
  [selectConcentrationState, (state: RootState) => state],
  (concentration, state) => {
    if (!concentration.spellId) return null;
    
    return selectSpellById(state, concentration.spellId);
  }
);

/**
 * Concentration save DC when taking damage
 * Formula: max(10, damage / 2)
 * 
 * This is used by the concentration listener middleware
 */
export const makeSelectConcentrationDC = (damage: number) => {
  return createSelector(
    [],
    (): number => Math.max(10, Math.floor(damage / 2))
  );
};

/**
 * Concentration save modifier
 * Includes CON save bonus and War Caster advantage
 */
export const selectConcentrationSaveModifier = createSelector(
  [selectSavingThrowBonuses, selectCharacterFeatures],
  (saves, features) => {
    return {
      bonus: saves.con ?? 0,
      advantage: features.warCaster,
    };
  }
);

/**
 * V3.0 Selectors - Memoized derived stats with DAG structure
 * 
 * COMPUTATION ORDER (DAG phases to prevent cycles):
 * 1. Base: ability scores, level, class
 * 2. ASI/Feats: ability score improvements, feat bonuses
 * 3. Items/Effects: equipment, active spell effects
 * 4. Derived: final computed stats (modifiers, AC, HP, spell DC, etc.)
 * 
 * OVERRIDE PATTERN:
 * - If override exists, return it
 * - Otherwise, compute value from dependencies
 */

import { createSelector } from 'reselect';
import type { RootState } from '../store';
import { effectsSelectors } from '../slices/effectsSlice';
import { spellsSelectors } from '../slices/spellsSlice';

// ============================================================================
// PHASE 1: BASE SELECTORS (No dependencies)
// ============================================================================

export const selectActor = (state: RootState) => state.actor;

export const selectBaseAttributes = createSelector(
  [selectActor],
  (actor) => actor.baseAttributes
);

export const selectLevel = createSelector(
  [selectActor],
  (actor) => actor.level
);

export const selectClass = createSelector(
  [selectActor],
  (actor) => actor.class
);

export const selectHitDieSize = createSelector(
  [selectActor],
  (actor) => actor.hitDieSize
);

export const selectSpellcastingAbility = createSelector(
  [selectActor],
  (actor) => actor.spellcastingAbility
);

export const selectOverrides = createSelector(
  [selectActor],
  (actor) => actor.overrides || {}
);

// ============================================================================
// PHASE 2: ABILITY MODIFIERS & PROFICIENCY (Depends on Phase 1)
// ============================================================================

/**
 * Calculate ability modifier from score
 * SRD 5.1: floor((score - 10) / 2)
 */
const getAbilityModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

/**
 * Calculate proficiency bonus by level
 * SRD 5.1: +2 (L1-4), +3 (L5-8), +4 (L9-12), +5 (L13-16), +6 (L17-20)
 */
const getProficiencyBonus = (level: number): number => {
  const clampedLevel = Math.max(1, Math.min(20, level));
  return Math.floor((clampedLevel - 1) / 4) + 2;
};

export const selectProficiencyBonus = createSelector(
  [selectLevel, selectOverrides],
  (level, overrides) => {
    // No override for proficiency bonus currently, but pattern is here
    return getProficiencyBonus(level);
  }
);

/**
 * Get active effects from state
 */
export const selectAllEffects = effectsSelectors.selectAll;

export const selectActiveEffects = createSelector(
  [selectActor, selectAllEffects],
  (actor, allEffects) => {
    return allEffects.filter(effect => actor.activeEffectIds.includes(effect.id));
  }
);

/**
 * Compute ability modifiers with effect bonuses
 * Phase 2: Depends on base attributes (Phase 1) and active effects
 */
export const selectAbilityModifiers = createSelector(
  [selectBaseAttributes, selectActiveEffects],
  (baseAttributes, effects) => {
    const modifiers = {
      str: getAbilityModifier(baseAttributes.str),
      dex: getAbilityModifier(baseAttributes.dex),
      con: getAbilityModifier(baseAttributes.con),
      int: getAbilityModifier(baseAttributes.int),
      wis: getAbilityModifier(baseAttributes.wis),
      cha: getAbilityModifier(baseAttributes.cha),
    };

    // Apply ability score effects
    effects.forEach(effect => {
      if (effect.target.type === 'ability_score') {
        const ability = effect.target.ability;
        const newScore = baseAttributes[ability] + effect.modifier;
        modifiers[ability] = getAbilityModifier(newScore);
      }
    });

    return modifiers;
  }
);

// ============================================================================
// PHASE 3: SKILL BONUSES (Depends on Phase 2)
// ============================================================================

/**
 * Standard D&D skills mapped to abilities
 */
const SKILLS = {
  acrobatics: 'dex',
  animalHandling: 'wis',
  arcana: 'int',
  athletics: 'str',
  deception: 'cha',
  history: 'int',
  insight: 'wis',
  intimidation: 'cha',
  investigation: 'int',
  medicine: 'wis',
  nature: 'int',
  perception: 'wis',
  performance: 'cha',
  persuasion: 'cha',
  religion: 'int',
  sleightOfHand: 'dex',
  stealth: 'dex',
  survival: 'wis',
} as const;

/**
 * Skill bonuses with proficiency and effects
 * Depends on ability modifiers and proficiency bonus
 */
export const selectSkillBonuses = createSelector(
  [selectAbilityModifiers, selectProficiencyBonus, selectActiveEffects],
  (abilityMods, profBonus, effects) => {
    const skillBonuses: Record<string, number> = {};

    Object.entries(SKILLS).forEach(([skill, ability]) => {
      let bonus = abilityMods[ability as keyof typeof abilityMods];
      
      // TODO: Add proficiency tracking per skill
      // For now, assuming some skills have proficiency based on typical wizard
      const proficientSkills = ['arcana', 'history', 'insight', 'investigation'];
      if (proficientSkills.includes(skill)) {
        bonus += profBonus;
      }

      // Apply skill-specific effects
      effects.forEach(effect => {
        if (effect.target.type === 'skill' && effect.target.skill === skill) {
          bonus += effect.modifier;
        }
      });

      skillBonuses[skill] = bonus;
    });

    return skillBonuses;
  }
);

// ============================================================================
// PHASE 4: DERIVED COMBAT STATS (Depends on Phase 2-3)
// ============================================================================

/**
 * Spell Save DC
 * SRD 5.1: 8 + proficiency bonus + spellcasting ability modifier
 * Respects overrides
 */
export const selectSpellSaveDC = createSelector(
  [selectProficiencyBonus, selectAbilityModifiers, selectSpellcastingAbility, selectOverrides, selectActiveEffects],
  (profBonus, abilityMods, spellcastingAbility, overrides, effects) => {
    if (overrides.spellSaveDC !== undefined) {
      return overrides.spellSaveDC;
    }

    if (!spellcastingAbility) return undefined;

    let dc = 8 + profBonus + abilityMods[spellcastingAbility];

    // Apply effects that modify spell save DC
    effects.forEach(effect => {
      if (effect.target.type === 'spell_save_dc') {
        dc += effect.modifier;
      }
    });

    return dc;
  }
);

/**
 * Spell Attack Bonus
 * SRD 5.1: proficiency bonus + spellcasting ability modifier
 * Respects overrides
 */
export const selectSpellAttackBonus = createSelector(
  [selectProficiencyBonus, selectAbilityModifiers, selectSpellcastingAbility, selectOverrides, selectActiveEffects],
  (profBonus, abilityMods, spellcastingAbility, overrides, effects) => {
    if (overrides.spellAttackBonus !== undefined) {
      return overrides.spellAttackBonus;
    }

    if (!spellcastingAbility) return undefined;

    let bonus = profBonus + abilityMods[spellcastingAbility];

    // Apply effects that modify spell attack
    effects.forEach(effect => {
      if (effect.target.type === 'spell_attack') {
        bonus += effect.modifier;
      }
    });

    return bonus;
  }
);

/**
 * Prepared Spells Capacity
 * Most classes: spellcasting modifier + class level (minimum 1)
 */
export const selectPreparedSpellsCapacity = createSelector(
  [selectLevel, selectAbilityModifiers, selectSpellcastingAbility, selectClass],
  (level, abilityMods, spellcastingAbility, charClass) => {
    if (!spellcastingAbility) return undefined;

    // Wizards, Clerics, Druids, Paladins: ability mod + level
    if (['Wizard', 'Cleric', 'Druid', 'Paladin'].includes(charClass)) {
      return Math.max(1, abilityMods[spellcastingAbility] + level);
    }

    // Other classes may vary or prepare all known spells
    return undefined;
  }
);

/**
 * Armor Class
 * Base AC with effects and overrides
 */
export const selectArmorClass = createSelector(
  [selectOverrides, selectAbilityModifiers, selectActiveEffects],
  (overrides, abilityMods, effects) => {
    if (overrides.ac !== undefined) {
      return overrides.ac;
    }

    // Default unarmored: 10 + DEX mod
    let ac = 10 + abilityMods.dex;

    // Apply AC effects (armor, shields, spells, etc.)
    effects.forEach(effect => {
      if (effect.target.type === 'ac') {
        ac += effect.modifier;
      }
    });

    return ac;
  }
);

/**
 * Maximum Hit Points
 * Simplified calculation - can be extended
 */
export const selectMaxHP = createSelector(
  [selectLevel, selectHitDieSize, selectAbilityModifiers, selectOverrides],
  (level, hitDieSize, abilityMods, overrides) => {
    if (overrides.maxHp !== undefined) {
      return overrides.maxHp;
    }

    const conMod = abilityMods.con;
    
    // First level: max hit die + CON mod
    const firstLevelHP = hitDieSize + conMod;
    
    if (level === 1) {
      return Math.max(1, firstLevelHP);
    }

    // Subsequent levels: average + CON mod
    const avgHitDie = Math.floor(hitDieSize / 2) + 1;
    const subsequentLevels = level - 1;
    
    const totalHP = firstLevelHP + subsequentLevels * (avgHitDie + conMod);
    
    // RAW: Minimum 1 HP per level
    return Math.max(level, totalHP);
  }
);

/**
 * Initiative Bonus
 */
export const selectInitiativeBonus = createSelector(
  [selectAbilityModifiers, selectOverrides, selectActiveEffects],
  (abilityMods, overrides, effects) => {
    if (overrides.initiative !== undefined) {
      return overrides.initiative;
    }

    let initiative = abilityMods.dex;

    // Apply initiative effects
    effects.forEach(effect => {
      if (effect.target.type === 'initiative') {
        initiative += effect.modifier;
      }
    });

    return initiative;
  }
);

// ============================================================================
// SPELL SELECTORS
// ============================================================================

export const selectAllSpells = spellsSelectors.selectAll;

export const selectSpellById = (state: RootState, spellId: string) => 
  spellsSelectors.selectById(state, spellId);

export const selectPreparedSpells = createSelector(
  [selectActor, selectAllSpells],
  (actor, allSpells) => {
    return allSpells.filter(spell => actor.preparedSpellIds.includes(spell.id));
  }
);

export const selectSpellsByLevel = (level: number) => createSelector(
  [selectAllSpells],
  (spells) => spells.filter(spell => spell.level === level)
);

// ============================================================================
// CONCENTRATION SELECTORS
// ============================================================================

export const selectConcentration = (state: RootState) => state.concentration.current;

export const selectConcentrationPrompt = (state: RootState) => state.concentration.prompt;

export const selectIsConcentrating = createSelector(
  [selectConcentration],
  (concentration) => concentration.active
);

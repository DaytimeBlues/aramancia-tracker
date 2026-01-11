/**
 * V3.0 Spell Utilities
 * Pure functions for spell upcasting and effect resolution
 */

import type { Spell, UpcastResult, SlotAvailability } from '../../types/v3';

/**
 * Calculate available spell slots for casting
 * @param slots Current slot state { level: { used, max } }
 * @param minLevel Minimum spell level to consider
 * @returns Array of available slot levels with counts
 */
export function getAvailableSlots(
  slots: Record<number, { used: number; max: number }>,
  minLevel: number
): SlotAvailability[] {
  const available: SlotAvailability[] = [];

  for (let level = minLevel; level <= 9; level++) {
    const slot = slots[level];
    if (slot && slot.max > 0) {
      const avail = slot.max - slot.used;
      if (avail > 0) {
        available.push({
          level,
          total: slot.max,
          used: slot.used,
          available: avail,
        });
      }
    }
  }

  return available;
}

/**
 * Resolve spell effect at a given cast level
 * Evaluates scaling formula to compute final effect
 * 
 * @param spell Spell to cast
 * @param castLevel Level at which to cast (must be >= spell.level)
 * @returns Resolved effect description
 */
export function resolveSpellEffect(spell: Spell, castLevel: number): UpcastResult {
  if (!spell.scaling || spell.scaling.mode === 'none') {
    // No scaling, return base effect
    return {
      level: castLevel,
      resolvedEffect: spell.damage || spell.description,
      description: spell.description,
    };
  }

  const { mode, baseLevel, formula } = spell.scaling;
  const levelDiff = castLevel - (baseLevel || spell.level);

  if (!formula) {
    return {
      level: castLevel,
      resolvedEffect: spell.damage || spell.description,
      description: spell.description,
    };
  }

  // Parse and evaluate formula
  let resolvedEffect = formula;

  if (mode === 'slot_level') {
    // Replace {slot_level} with actual cast level and evaluate arithmetic
    resolvedEffect = resolvedEffect.replace(/{slot_level}/g, String(castLevel));
    
    // Evaluate simple arithmetic (e.g., "1+2" -> "3")
    resolvedEffect = resolvedEffect.replace(/(\d+)\+(\d+)/g, (_match, a, b) => {
      return String(Number(a) + Number(b));
    });
    
    // Handle formulas like "1d4+{slot_level}" -> "1d4+3" for level 3
    // Handle formulas like "{slot_level}d6" -> "3d6" for level 3
  } else if (mode === 'character_level') {
    // Character level scaling (e.g., cantrips)
    // Not implemented for slot-based spells in this version
  }

  // Additional dice scaling (e.g., +1d6 per slot level above base)
  // Example: "3d6" at base, "+1d6" per level -> "4d6" at +1, "5d6" at +2
  if (formula.includes('+{level}d')) {
    const match = formula.match(/(\d+)d(\d+)\s*\+\s*\{level\}d(\d+)/);
    if (match) {
      const baseDice = parseInt(match[1]);
      const baseDie = match[2];
      const totalDice = baseDice + levelDiff;
      resolvedEffect = `${totalDice}d${baseDie}`;
    }
  }

  return {
    level: castLevel,
    resolvedEffect,
    description: spell.description,
  };
}

/**
 * Get all valid cast levels for a spell given available slots
 * 
 * @param spell Spell to cast
 * @param availableSlots Available slot levels
 * @returns Array of valid cast levels
 */
export function getValidCastLevels(
  spell: Spell,
  availableSlots: SlotAvailability[]
): number[] {
  const minLevel = spell.level;
  
  return availableSlots
    .filter(slot => slot.level >= minLevel)
    .map(slot => slot.level);
}

/**
 * Parse a dice formula and evaluate it
 * Examples: "3d6" -> "3d6", "1d4+3" -> "1d4+3"
 * This is a simple parser for display purposes
 */
export function parseDiceFormula(formula: string): {
  dice: number;
  sides: number;
  modifier: number;
} | null {
  const match = formula.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
  if (!match) return null;

  return {
    dice: parseInt(match[1]),
    sides: parseInt(match[2]),
    modifier: match[3] ? parseInt(match[3]) : 0,
  };
}

/**
 * Format a spell's effect at a given level for display
 * 
 * @param spell Spell to format
 * @param castLevel Level to cast at
 * @returns Formatted string for UI display
 */
export function formatSpellEffect(spell: Spell, castLevel: number): string {
  const result = resolveSpellEffect(spell, castLevel);
  
  if (spell.level === castLevel) {
    return result.resolvedEffect;
  }

  // Show upcast bonus
  const levelDiff = castLevel - spell.level;
  return `${result.resolvedEffect} (+${levelDiff} level${levelDiff > 1 ? 's' : ''})`;
}

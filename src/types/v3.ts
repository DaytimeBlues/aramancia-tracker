/**
 * V3.0 Entity Types
 * State-driven relational engine with normalized entities
 */

import { z } from 'zod';
import type { AbilityKey } from './index';

// ============================================================================
// SPELL ENTITIES
// ============================================================================

/**
 * Spell scaling configuration
 */
export const SpellScalingSchema = z.object({
  mode: z.enum(['none', 'slot_level', 'character_level']),
  baseLevel: z.number().min(0).max(9),
  formula: z.string().optional(), // e.g., "1d4+{slot_level}" or "{slot_level}d6"
});

export type SpellScaling = z.infer<typeof SpellScalingSchema>;

/**
 * Spell variant (e.g., different effects for Enhance Ability)
 */
export const SpellVariantSchema = z.object({
  name: z.string(),
  effect: z.string(),
});

export type SpellVariant = z.infer<typeof SpellVariantSchema>;

/**
 * Resource consumption type
 */
export const ResourceTypeSchema = z.enum([
  'spell_slot',
  'sorcery_points',
  'ki_points',
  'channel_divinity',
  'none',
]);

export type ResourceType = z.infer<typeof ResourceTypeSchema>;

/**
 * Extended Spell entity with decision-node capabilities
 */
export const SpellSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().min(0).max(9),
  school: z.string(),
  castTime: z.string(),
  range: z.string(),
  duration: z.string(),
  components: z.string(),
  concentration: z.boolean().default(false),
  description: z.string(),
  attack: z.string().optional(),
  damage: z.string().optional(),
  scaling: SpellScalingSchema.optional(),
  variants: z.array(SpellVariantSchema).optional(),
  resourceType: ResourceTypeSchema.default('spell_slot'),
  resourceCost: z.number().default(1),
  incantation: z.string().optional(),
  pronunciation: z.string().optional(),
});

export type Spell = z.infer<typeof SpellSchema>;

// ============================================================================
// ATTRIBUTE & ABILITY SCORES
// ============================================================================

export interface AttributeScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface DerivedModifiers {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

// ============================================================================
// ACTOR METADATA
// ============================================================================

export interface ActorState {
  id: string;
  name: string;
  level: number;
  class: string;
  subclass?: string;
  proficiencyBonus: number;
  hitDieSize: number;
  spellcastingAbility?: AbilityKey;

  // References to normalized entities
  preparedSpellIds: string[];
  activeEffectIds: string[];

  // Base attributes
  baseAttributes: AttributeScores;

  // Overrides for derived stats (optional)
  overrides?: {
    ac?: number;
    maxHp?: number;
    initiative?: number;
    spellSaveDC?: number;
    spellAttackBonus?: number;
  };
  favoredSpells?: string[];
}

// ============================================================================
// PREPARATION & SPELLCASTING
// ============================================================================

export interface PreparationList {
  id: string;
  actorId: string;
  preparedSpellIds: string[];
  maxPrepared?: number; // Override for max prepared spells
}

// ============================================================================
// ACTIVE EFFECTS
// ============================================================================

export type EffectTarget =
  | { type: 'ability_score', ability: AbilityKey }
  | { type: 'ac' }
  | { type: 'hp' }
  | { type: 'skill', skill: string }
  | { type: 'saving_throw', ability: AbilityKey }
  | { type: 'proficiency_bonus' }
  | { type: 'initiative' }
  | { type: 'spell_save_dc' }
  | { type: 'spell_attack' };

export interface ActiveEffect {
  id: string;
  name: string;
  sourceSpellId?: string;
  target: EffectTarget;
  modifier: number; // Numeric bonus/penalty
  duration?: number; // Rounds, or undefined for indefinite
  concentration?: boolean;
}

// ============================================================================
// CONCENTRATION STATE
// ============================================================================

export interface ConcentrationState {
  active: boolean;
  spellId?: string;
  spellName?: string;
  effectIds: string[]; // Effects tied to this concentration
}

// ============================================================================
// CONCENTRATION PROMPT
// ============================================================================

export interface ConcentrationPrompt {
  dc: number;
  damage: number;
  source?: string;
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  warCaster?: boolean; // Feat-based modifier
  mageSlayer?: boolean; // Enemy feat
}

// ============================================================================
// SPELL CASTING CONTEXT
// ============================================================================

export interface SpellCastContext {
  spellId: string;
  spellName: string;
  baseLevel: number;
  availableSlots: { level: number; available: number }[];
  selectedLevel?: number;
  variant?: string;
}

// ============================================================================
// DERIVED STATS (computed via selectors)
// ============================================================================

export interface DerivedStats {
  abilityModifiers: DerivedModifiers;
  proficiencyBonus: number;
  skillBonuses: Record<string, number>;
  spellAttackBonus?: number;
  spellSaveDC?: number;
  preparedSpellsCapacity?: number;
  armorClass?: number;
  hitPoints?: { current: number; max: number };
  initiative: number;
}

// ============================================================================
// SLOT AVAILABILITY
// ============================================================================

export interface SlotAvailability {
  level: number;
  total: number;
  used: number;
  available: number;
}

// ============================================================================
// UPCASTING RESULT
// ============================================================================

export interface UpcastResult {
  level: number;
  resolvedEffect: string; // e.g., "3d4+3 force damage" for Magic Missile at level 2
  description: string;
}
// ============================================================================
// SUMMONING ENTITIES (VRGtR / 2024 PHB)
// ============================================================================

export type SummonForm = 'Ghostly' | 'Putrid' | 'Skeletal';

export interface Summon {
  id: string;
  name: string;
  type: 'Spirit';
  form: SummonForm;
  slotLevel: number;
  currentHp: number;
  maxHp: number;
  ac: number;
  attacks: number;
  active: boolean;
}

export interface SummonsState {
  activeSummons: Summon[];
}

export interface SpellCastResult {
  spellId: string;
  slotLevel: number;
  summonId?: string;
}

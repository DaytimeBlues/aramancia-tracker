/**
 * Normalized Spell Schema for D&D 5e
 * 
 * This schema models spells as "decision nodes" with:
 * - Upcasting support (scaling damage/effects)
 * - Variants (different casting modes or choices)
 * - Resource consumption (spell slots, components, materials)
 * - Concentration metadata
 * 
 * Spells are stored centrally and referenced by ID to avoid denormalization.
 */

/**
 * Scaling configuration for upcast levels
 */
export interface SpellScaling {
  /** Which attribute scales (damage dice, duration, targets, etc.) */
  attribute: 'damage' | 'duration' | 'targets' | 'area' | 'healing';
  /** Base value at the spell's minimum level */
  baseValue: string;
  /** How it scales per level above minimum */
  perLevel: string;
  /** Maximum level this scaling applies to (optional) */
  maxLevel?: number;
}

/**
 * Spell variant - different casting modes or choices
 * E.g., Healing Word with different target selection, Chromatic Orb with damage type choice
 */
export interface SpellVariant {
  id: string;
  name: string;
  description: string;
  /** Any modifier to the base spell effect */
  effectModifier?: string;
  /** Additional resource costs for this variant */
  additionalCosts?: ResourceCost[];
}

/**
 * Resource consumption for spell casting
 */
export interface ResourceCost {
  type: 'slot' | 'component' | 'material' | 'reaction' | 'bonus_action' | 'action';
  /** For slots: the level consumed. For materials: the item name */
  value: string | number;
  /** For material components: gold cost */
  gpCost?: number;
  /** Whether the component is consumed */
  consumed?: boolean;
}

/**
 * Concentration metadata
 */
export interface ConcentrationData {
  /** Whether this spell requires concentration */
  required: boolean;
  /** Maximum duration of concentration */
  maxDuration?: string;
  /** Special rules for maintaining concentration on this spell */
  specialRules?: string;
}

/**
 * Attack/Save information
 */
export interface SpellAttack {
  type: 'attack' | 'save' | 'none';
  /** For attacks: melee/ranged spell attack. For saves: ability type (WIS, DEX, etc.) */
  subtype?: string;
}

/**
 * Normalized Spell Entity
 * 
 * This is the central spell definition stored in the spells slice.
 * Characters reference spells by ID, not by embedding full spell data.
 */
export interface NormalizedSpell {
  /** Unique identifier for the spell */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Spell level (0 for cantrips, 1-9 for leveled spells) */
  level: number;
  
  /** School of magic */
  school: 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation';
  
  /** Casting time */
  castingTime: {
    amount: number;
    unit: 'action' | 'bonus_action' | 'reaction' | 'minute' | 'hour';
    condition?: string; // For reactions: "when you take damage", etc.
  };
  
  /** Range/Area */
  range: {
    type: 'self' | 'touch' | 'ranged' | 'special';
    distance?: number; // In feet for ranged
    area?: {
      type: 'sphere' | 'cube' | 'cone' | 'line' | 'cylinder';
      size: number; // In feet
    };
  };
  
  /** Duration */
  duration: {
    type: 'instantaneous' | 'timed' | 'concentration' | 'until_dispelled' | 'special';
    amount?: number;
    unit?: 'round' | 'minute' | 'hour' | 'day';
  };
  
  /** Components required */
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
    materialCost?: number; // In GP
    materialConsumed?: boolean;
  };
  
  /** Attack or saving throw */
  attack: SpellAttack;
  
  /** Base damage or effect */
  effect: {
    type: 'damage' | 'healing' | 'utility' | 'buff' | 'debuff' | 'control';
    description: string;
    /** For damage/healing spells */
    diceFormula?: string; // e.g., "2d8", "3d6"
    damageType?: string; // e.g., "fire", "necrotic", "psychic"
  };
  
  /** Full description */
  description: string;
  
  /** Scaling when upcast */
  scaling?: SpellScaling[];
  
  /** Spell variants (different casting choices) */
  variants?: SpellVariant[];
  
  /** Resource costs */
  resourceCosts: ResourceCost[];
  
  /** Concentration metadata */
  concentration: ConcentrationData;
  
  /** Flavor text (incantation, pronunciation, etc.) */
  flavor?: {
    incantation?: string;
    pronunciation?: string;
    lore?: string;
  };
  
  /** Tags for filtering/searching */
  tags?: string[];
  
  /** Source book/reference */
  source?: {
    book: string;
    page?: number;
  };
}

/**
 * Spell preparation/known state for a character
 * Separate from the spell entity itself
 */
export interface CharacterSpellState {
  /** Spell ID reference */
  spellId: string;
  
  /** Whether the spell is prepared (for prepared casters) */
  prepared: boolean;
  
  /** For spells always prepared (domain spells, racial spells, etc.) */
  alwaysPrepared: boolean;
  
  /** Custom notes for this character's use of the spell */
  notes?: string;
  
  /** Number of times cast today (for tracking resources) */
  castCount?: number;
  
  /** Favorite upcast level (UI hint) */
  favoriteUpcastLevel?: number;
}

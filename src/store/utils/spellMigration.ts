/**
 * Spell Data Migration Utilities
 * 
 * Converts legacy spell data to normalized schema format
 */

import type { Spell } from '../../types';
import type { NormalizedSpell, SpellScaling, ConcentrationData, ResourceCost } from '../types/spellSchema';

/**
 * Parse school abbreviation to full name
 */
const parseSchool = (abbr: string): NormalizedSpell['school'] => {
  const schools: Record<string, NormalizedSpell['school']> = {
    'ABJ': 'Abjuration',
    'CONJ': 'Conjuration',
    'DIV': 'Divination',
    'ENCH': 'Enchantment',
    'EVO': 'Evocation',
    'ILLU': 'Illusion',
    'NECRO': 'Necromancy',
    'TRANS': 'Transmutation',
  };
  
  return schools[abbr] || 'Evocation';
};

/**
 * Parse casting time string
 */
const parseCastingTime = (castTime: string): NormalizedSpell['castingTime'] => {
  const lower = castTime.toLowerCase();
  
  if (lower.includes('reaction')) {
    return { amount: 1, unit: 'reaction', condition: castTime };
  }
  if (lower.includes('bonus')) {
    return { amount: 1, unit: 'bonus_action' };
  }
  if (lower.includes('minute')) {
    const match = castTime.match(/(\d+)/);
    return { amount: match ? parseInt(match[1]) : 1, unit: 'minute' };
  }
  if (lower.includes('hour')) {
    const match = castTime.match(/(\d+)/);
    return { amount: match ? parseInt(match[1]) : 1, unit: 'hour' };
  }
  
  return { amount: 1, unit: 'action' };
};

/**
 * Parse range string
 */
const parseRange = (range: string): NormalizedSpell['range'] => {
  const lower = range.toLowerCase();
  
  if (lower === 'self') {
    return { type: 'self' };
  }
  if (lower === 'touch') {
    return { type: 'touch' };
  }
  
  const match = range.match(/(\d+)/);
  if (match) {
    return { type: 'ranged', distance: parseInt(match[1]) };
  }
  
  return { type: 'special' };
};

/**
 * Parse duration string
 */
const parseDuration = (duration: string): NormalizedSpell['duration'] => {
  const lower = duration.toLowerCase();
  
  if (lower.includes('instantaneous')) {
    return { type: 'instantaneous' };
  }
  
  const isConcentration = lower.includes('conc');
  
  if (lower.includes('minute')) {
    const match = duration.match(/(\d+)/);
    const amount = match ? parseInt(match[1]) : 1;
    return isConcentration 
      ? { type: 'concentration', amount, unit: 'minute' }
      : { type: 'timed', amount, unit: 'minute' };
  }
  
  if (lower.includes('hour')) {
    const match = duration.match(/(\d+)/);
    const amount = match ? parseInt(match[1]) : 1;
    return isConcentration 
      ? { type: 'concentration', amount, unit: 'hour' }
      : { type: 'timed', amount, unit: 'hour' };
  }
  
  if (lower.includes('round')) {
    const match = duration.match(/(\d+)/);
    const amount = match ? parseInt(match[1]) : 1;
    return isConcentration 
      ? { type: 'concentration', amount, unit: 'round' }
      : { type: 'timed', amount, unit: 'round' };
  }
  
  return { type: 'special' };
};

/**
 * Parse components string
 */
const parseComponents = (components: string): NormalizedSpell['components'] => {
  return {
    verbal: components.includes('V'),
    somatic: components.includes('S'),
    material: components.includes('M'),
  };
};

/**
 * Parse attack/save string
 */
const parseAttack = (attack: string): NormalizedSpell['attack'] => {
  const lower = attack.toLowerCase();
  
  if (lower.includes('save')) {
    // Extract ability (WIS, DEX, etc.)
    const match = attack.match(/(STR|DEX|CON|INT|WIS|CHA)/i);
    return { type: 'save', subtype: match ? match[1].toLowerCase() : undefined };
  }
  
  if (lower.includes('attack')) {
    return { type: 'attack', subtype: 'ranged' };
  }
  
  return { type: 'none' };
};

/**
 * Determine effect type from description
 */
const determineEffectType = (damage: string, desc: string): NormalizedSpell['effect']['type'] => {
  const lower = damage.toLowerCase() + ' ' + desc.toLowerCase();
  
  if (lower.includes('damage') || lower.includes('necrotic') || lower.includes('fire') || lower.includes('psychic')) {
    return 'damage';
  }
  if (lower.includes('heal') || lower.includes('hp')) {
    return 'healing';
  }
  if (lower.includes('unconscious') || lower.includes('charm') || lower.includes('frighten')) {
    return 'control';
  }
  if (lower.includes('bonus') || lower.includes('advantage')) {
    return 'buff';
  }
  if (lower.includes('disadvantage') || lower.includes('penalty')) {
    return 'debuff';
  }
  
  return 'utility';
};

/**
 * Extract damage dice from description
 */
const extractDamageDice = (damage: string): string | undefined => {
  const match = damage.match(/(\d+d\d+)/);
  return match ? match[1] : undefined;
};

/**
 * Extract damage type from description
 */
const extractDamageType = (damage: string, desc: string): string | undefined => {
  const text = (damage + ' ' + desc).toLowerCase();
  
  const types = [
    'necrotic', 'fire', 'cold', 'lightning', 'thunder', 'acid', 'poison',
    'psychic', 'radiant', 'force', 'slashing', 'piercing', 'bludgeoning'
  ];
  
  for (const type of types) {
    if (text.includes(type)) {
      return type;
    }
  }
  
  return undefined;
};

/**
 * Create spell ID from name
 */
const createSpellId = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

/**
 * Convert legacy spell to normalized format
 */
export const migrateSpell = (legacy: Spell): NormalizedSpell => {
  const duration = parseDuration(legacy.duration);
  const isConcentration = duration.type === 'concentration';
  
  const spell: NormalizedSpell = {
    id: createSpellId(legacy.name),
    name: legacy.name,
    level: legacy.lvl,
    school: parseSchool(legacy.school),
    castingTime: parseCastingTime(legacy.castTime),
    range: parseRange(legacy.range),
    duration,
    components: parseComponents(legacy.components),
    attack: parseAttack(legacy.attack),
    effect: {
      type: determineEffectType(legacy.damage, legacy.desc),
      description: legacy.damage,
      diceFormula: extractDamageDice(legacy.damage),
      damageType: extractDamageType(legacy.damage, legacy.desc),
    },
    description: legacy.desc,
    resourceCosts: [
      {
        type: 'slot',
        value: legacy.lvl,
      },
    ],
    concentration: {
      required: isConcentration,
      maxDuration: isConcentration && duration.amount ? `${duration.amount} ${duration.unit}s` : undefined,
    },
  };
  
  // Add flavor if available
  if (legacy.incantation || legacy.pronunciation) {
    spell.flavor = {
      incantation: legacy.incantation,
      pronunciation: legacy.pronunciation,
    };
  }
  
  return spell;
};

/**
 * Convert multiple spells
 */
export const migrateSpells = (legacySpells: Spell[]): NormalizedSpell[] => {
  return legacySpells.map(migrateSpell);
};

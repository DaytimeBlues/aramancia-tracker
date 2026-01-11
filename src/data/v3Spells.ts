/**
 * V3.0 Sample Spell Data
 * Extended spells with scaling, variants, and concentration
 */

import type { Spell } from '../types/v3';

export const v3SampleSpells: Spell[] = [
  // Scaling spell example: Magic Missile
  {
    id: 'magic-missile',
    name: 'Magic Missile',
    level: 1,
    school: 'Evocation',
    castTime: '1 action',
    range: '120 feet',
    duration: 'Instantaneous',
    components: 'V, S',
    concentration: false,
    description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.',
    damage: '3 × (1d4+1) force',
    scaling: {
      mode: 'slot_level',
      baseLevel: 1,
      formula: '{slot_level}+2 darts of 1d4+1 force',
    },
    resourceType: 'spell_slot',
    resourceCost: 1,
    incantation: 'Missilia Magica',
    pronunciation: 'mis-SIL-ee-ah MAH-jih-kah',
  },

  // Scaling spell example: Fireball
  {
    id: 'fireball',
    name: 'Fireball',
    level: 3,
    school: 'Evocation',
    castTime: '1 action',
    range: '150 feet',
    duration: 'Instantaneous',
    components: 'V, S, M (a tiny ball of bat guano and sulfur)',
    concentration: false,
    description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.',
    attack: 'DEX save',
    damage: '8d6 fire',
    scaling: {
      mode: 'slot_level',
      baseLevel: 3,
      formula: '{slot_level}+5d6 fire', // 8d6 at level 3, +1d6 per level above 3
    },
    resourceType: 'spell_slot',
    resourceCost: 1,
    incantation: 'Ignis Globus',
    pronunciation: 'IG-nis GLOH-bus',
  },

  // Variant spell example: Enhance Ability
  {
    id: 'enhance-ability',
    name: 'Enhance Ability',
    level: 2,
    school: 'Transmutation',
    castTime: '1 action',
    range: 'Touch',
    duration: 'Concentration, up to 1 hour',
    components: 'V, S, M (fur or a feather from a beast)',
    concentration: true,
    description: 'You touch a creature and bestow upon it a magical enhancement. Choose one of the following effects; the target gains that effect until the spell ends.',
    variants: [
      {
        name: "Bear's Endurance",
        effect: 'Advantage on Constitution checks, and gains 2d6 temporary hit points',
      },
      {
        name: "Bull's Strength",
        effect: 'Advantage on Strength checks, and carrying capacity is doubled',
      },
      {
        name: "Cat's Grace",
        effect: 'Advantage on Dexterity checks, and no damage from falling 20 feet or less',
      },
      {
        name: "Eagle's Splendor",
        effect: 'Advantage on Charisma checks',
      },
      {
        name: "Fox's Cunning",
        effect: 'Advantage on Intelligence checks',
      },
      {
        name: "Owl's Wisdom",
        effect: 'Advantage on Wisdom checks',
      },
    ],
    resourceType: 'spell_slot',
    resourceCost: 1,
    incantation: 'Virtus Augmentum',
    pronunciation: 'VEER-toos ow-MEN-tum',
  },

  // Concentration spell example: Haste
  {
    id: 'haste',
    name: 'Haste',
    level: 3,
    school: 'Transmutation',
    castTime: '1 action',
    range: 'Touch',
    duration: 'Concentration, up to 1 minute',
    components: 'V, S, M (a shaving of licorice root)',
    concentration: true,
    description: 'Choose a willing creature that you can see within range. Until the spell ends, the target\'s speed is doubled, it gains a +2 bonus to AC, it has advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used only to take the Attack (one weapon attack only), Dash, Disengage, Hide, or Use an Object action.',
    resourceType: 'spell_slot',
    resourceCost: 1,
    incantation: 'Celeritas',
    pronunciation: 'keh-LEHR-ih-tas',
  },

  // Non-scaling spell example: Shield
  {
    id: 'shield',
    name: 'Shield',
    level: 1,
    school: 'Abjuration',
    castTime: '1 reaction',
    range: 'Self',
    duration: 'Until the start of your next turn',
    components: 'V, S',
    concentration: false,
    description: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.',
    scaling: {
      mode: 'none',
      baseLevel: 1,
    },
    resourceType: 'spell_slot',
    resourceCost: 1,
    incantation: 'Scutum',
    pronunciation: 'SKOO-tum',
  },

  // Cantrip example (character level scaling)
  {
    id: 'fire-bolt',
    name: 'Fire Bolt',
    level: 0,
    school: 'Evocation',
    castTime: '1 action',
    range: '120 feet',
    duration: 'Instantaneous',
    components: 'V, S',
    concentration: false,
    description: 'You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn\'t being worn or carried. This spell\'s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).',
    attack: 'Ranged spell attack',
    damage: '1d10 fire',
    scaling: {
      mode: 'character_level',
      baseLevel: 0,
      formula: '1d10 at 1st, 2d10 at 5th, 3d10 at 11th, 4d10 at 17th',
    },
    resourceType: 'none',
    resourceCost: 0,
    incantation: 'Ignis Sagitta',
    pronunciation: 'IG-nis sah-GIT-tah',
  },
];

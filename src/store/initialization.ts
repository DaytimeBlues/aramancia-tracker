/**
 * Redux Store Initialization
 * 
 * Initializes the Redux store with:
 * - Migrated spell data from legacy format
 * - Example character with normalized spell references
 * - Sample spell with scaling and variants
 */

import { store } from '../store/store';
import { spellsAdded } from '../store/slices/spellsSlice';
import { characterAdded, setActiveCharacter } from '../store/slices/characterSlice';
import { migrateSpells } from '../store/utils/spellMigration';
import { spells as legacySpells } from '../data/spells';
import type { NormalizedSpell } from '../store/types/spellSchema';
import type { Character } from '../store/slices/characterSlice';

/**
 * Initialize spell entities
 */
export const initializeSpells = () => {
  // Migrate legacy spells
  const normalizedSpells = migrateSpells(legacySpells);
  
  // Add example spell with scaling (Absorb Elements upcast)
  const absorbElementsEnhanced: NormalizedSpell = {
    ...normalizedSpells.find(s => s.id === 'absorb-elements')!,
    scaling: [
      {
        attribute: 'damage',
        baseValue: '1d6',
        perLevel: '1d6',
        maxLevel: 9,
      },
    ],
  };
  
  // Replace Absorb Elements with enhanced version
  const spellsWithScaling = normalizedSpells.map(s => 
    s.id === 'absorb-elements' ? absorbElementsEnhanced : s
  );
  
  // Add example spell with variants (Chromatic Orb - damage type choice)
  const chromaticOrb: NormalizedSpell = {
    id: 'chromatic-orb',
    name: 'Chromatic Orb',
    level: 1,
    school: 'Evocation',
    castingTime: { amount: 1, unit: 'action' },
    range: { type: 'ranged', distance: 90 },
    duration: { type: 'instantaneous' },
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a diamond worth at least 50 gp',
      materialCost: 50,
      materialConsumed: false,
    },
    attack: { type: 'attack', subtype: 'ranged' },
    effect: {
      type: 'damage',
      description: '3d8 damage',
      diceFormula: '3d8',
    },
    description: 'You hurl a 4-inch-diameter sphere of energy at a creature within range. Choose acid, cold, fire, lightning, poison, or thunder for the type of damage.',
    scaling: [
      {
        attribute: 'damage',
        baseValue: '3d8',
        perLevel: '1d8',
        maxLevel: 9,
      },
    ],
    variants: [
      {
        id: 'acid',
        name: 'Acid Damage',
        description: 'Deal acid damage',
        effectModifier: 'acid',
      },
      {
        id: 'cold',
        name: 'Cold Damage',
        description: 'Deal cold damage',
        effectModifier: 'cold',
      },
      {
        id: 'fire',
        name: 'Fire Damage',
        description: 'Deal fire damage',
        effectModifier: 'fire',
      },
      {
        id: 'lightning',
        name: 'Lightning Damage',
        description: 'Deal lightning damage',
        effectModifier: 'lightning',
      },
      {
        id: 'poison',
        name: 'Poison Damage',
        description: 'Deal poison damage',
        effectModifier: 'poison',
      },
      {
        id: 'thunder',
        name: 'Thunder Damage',
        description: 'Deal thunder damage',
        effectModifier: 'thunder',
      },
    ],
    resourceCosts: [
      { type: 'slot', value: 1 },
      { type: 'material', value: 'diamond', gpCost: 50 },
    ],
    concentration: {
      required: false,
    },
  };
  
  // Add all spells to store
  store.dispatch(spellsAdded([...spellsWithScaling, chromaticOrb]));
};

/**
 * Create example character for demo
 */
export const initializeDemoCharacter = () => {
  const demoCharacter: Character = {
    id: 'demo-wizard',
    name: 'Elara the Wise',
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
        'History': true,
        'Perception': true,
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
      1: { used: 1, max: 4 },
      2: { used: 0, max: 3 },
      3: { used: 1, max: 2 },
    },
    knownSpells: [
      'toll-the-dead',
      'mage-hand',
      'message',
      'prestidigitation',
      'sleep-2024',
      'detect-magic',
      'faerie-fire',
      'disguise-self',
      'absorb-elements',
      'phantasmal-force',
      'suggestion',
      'mirror-image',
      'animate-dead',
      'chromatic-orb',
    ],
    preparedSpells: [
      {
        spellId: 'toll-the-dead',
        prepared: true,
        alwaysPrepared: true, // Cantrips always prepared
      },
      {
        spellId: 'mage-hand',
        prepared: true,
        alwaysPrepared: true,
      },
      {
        spellId: 'detect-magic',
        prepared: true,
        alwaysPrepared: false,
      },
      {
        spellId: 'faerie-fire',
        prepared: true,
        alwaysPrepared: false,
      },
      {
        spellId: 'absorb-elements',
        prepared: true,
        alwaysPrepared: false,
      },
      {
        spellId: 'phantasmal-force',
        prepared: true,
        alwaysPrepared: false,
      },
      {
        spellId: 'chromatic-orb',
        prepared: true,
        alwaysPrepared: false,
      },
    ],
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
    baseAC: 12,
    mageArmor: false,
    shield: false,
    attunement: ['Staff of Power', 'Ring of Protection'],
    inventory: ['Spellbook', 'Component Pouch', 'Arcane Focus'],
  };
  
  store.dispatch(characterAdded(demoCharacter));
  store.dispatch(setActiveCharacter('demo-wizard'));
};

/**
 * Initialize all Redux state
 */
export const initializeReduxState = () => {
  initializeSpells();
  initializeDemoCharacter();
};

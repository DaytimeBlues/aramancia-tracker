/**
 * initialState.ts - Wizard Default Character
 * Level 5 Necromancy Wizard for testing
 */
import type { CharacterData } from '../types';
import { getSpellSlotsWithUsed } from '../utils/srdRules';

export const initialCharacterData: CharacterData = {
    // Core stats
    hp: { current: 32, max: 32, temp: 0 },  // d6 (4avg) + CON 14 at level 5 = 6 + (4*4) + (5*2) = 32
    hitDice: { current: 5, max: 5, size: 6 }, // d6 for Wizard
    baseAC: 12, // DEX 2 + Mage Armor (13) if active, else 10+2=12. (Let's stick to unarmored 10+2=12)
    dc: 14, // 8 + 3 (Prof) + 3 (INT 16)
    profBonus: 3,
    level: 5,
    savingThrowProficiencies: ['int', 'wis'], // Wizard saves
    deathSaves: { successes: 0, failures: 0 },
    abilities: {
        str: 8,
        dex: 14,
        con: 14,
        int: 16, // Primary stat
        wis: 12,
        cha: 10
    },
    abilityMods: {
        str: -1,
        dex: 2,
        con: 2,
        int: 3,
        wis: 1,
        cha: 0
    },
    skills: {
        acrobatics: { name: 'Acrobatics', attr: 'dex', prof: false },
        animalHandling: { name: 'Animal Handling', attr: 'wis', prof: false },
        arcana: { name: 'Arcana', attr: 'int', prof: true },
        athletics: { name: 'Athletics', attr: 'str', prof: false },
        deception: { name: 'Deception', attr: 'cha', prof: false },
        history: { name: 'History', attr: 'int', prof: true },
        insight: { name: 'Insight', attr: 'wis', prof: false },
        intimidation: { name: 'Intimidation', attr: 'cha', prof: false },
        investigation: { name: 'Investigation', attr: 'int', prof: true },
        medicine: { name: 'Medicine', attr: 'wis', prof: false },
        nature: { name: 'Nature', attr: 'int', prof: false },
        perception: { name: 'Perception', attr: 'wis', prof: false },
        performance: { name: 'Performance', attr: 'cha', prof: false },
        persuasion: { name: 'Persuasion', attr: 'cha', prof: false },
        religion: { name: 'Religion', attr: 'int', prof: false },
        sleightOfHand: { name: 'Sleight of Hand', attr: 'dex', prof: false },
        stealth: { name: 'Stealth', attr: 'dex', prof: false },
        survival: { name: 'Survival', attr: 'wis', prof: false }
    },
    concentration: null,
    attunement: [],
    inventory: [
        { name: 'Spellbook' },
        { name: 'Arcane Focus (Crystal)' },
        { name: 'Scholar\'s Pack' },
        {
            name: 'Wand',
            charges: { current: 7, max: 7 },
            spells: ['Magic Missile', 'Web', 'Fly'],
            description: 'A mysterious wand with 7 charges.'
        }
    ],
    // Wizard Spell Slots (Level 5: 4/3/2)
    slots: getSpellSlotsWithUsed(5),
    mageArmour: false,
    shield: false,
    preparedSpells: [
        'Mage Armor',
        'Shield',
        'Magic Missile',
        'Misty Step',
        'Counterspell',
        'Fireball',
        'Animate Dead',
        'Web', // Concentration
        'Fly'  // Concentration
    ],
    defaultMinion: {
        skeleton: {
            hp: 13,
            ac: 13,
            notes: 'Vulnerable to bludgeoning.'
        },
        zombie: {
            hp: 22,
            ac: 8,
            notes: 'Undead Fortitude.'
        }
    }
};

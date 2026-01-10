/**
 * Ability score and its derived modifier
 * - score: Base (editable) - the ability score (1-20, or up to 30 with magic)
 * - mod: Derived (calculated) - floor((score - 10) / 2)
 */
export interface Ability {
    /** Base ability score (editable) */
    score: number;
    /** Derived modifier = floor((score - 10) / 2) */
    mod: number;
}

export interface Skill {
    name: string;
    attr: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    prof: boolean;
}

export interface Spell {
    name: string;
    lvl: number;
    school: string;
    castTime: string;
    range: string;
    duration: string;
    components: string;
    attack: string;
    damage: string;
    desc: string;
    incantation?: string;
    pronunciation?: string;
}

export interface MinionStats {
    hp: number;
    ac: number;
    notes: string;
}

export interface Minion {
    id: string;
    type: 'Skeleton' | 'Zombie';
    name: string;
    hp: { current: number; max: number };
    ac: number;
    notes: string;
}

/**
 * Hit Dice tracking
 * - current: Runtime state - available dice to spend on short rest
 * - max: Derived - equal to character level
 * - size: Base - die size determined by class (6 for Wizard d6, 8 for Cleric d8, etc.)
 */
export interface HitDice {
    /** Available dice to spend (runtime) */
    current: number;
    /** Max dice = character level (derived) */
    max: number;
    /** Die size, e.g., 6 for d6 (base, determined by class) */
    size: number;
}

/**
 * Character data with clear separation between base (editable) and derived (calculated) fields.
 * 
 * Base Fields (Editable):
 * - level: Character level (1-20)
 * - abilities.*.score: Ability scores
 * - baseAC: Base armor class
 * - hitDice.size: Hit die size (d6, d8, etc.)
 * - savingThrowProficiencies: Which saves are proficient
 * 
 * Derived Fields (Calculated per SRD 5.1):
 * - profBonus: 2 + floor((level - 1) / 4)
 * - abilities.*.mod: floor((score - 10) / 2)
 * - hp.max: hitDieSize + conMod + (level-1) * (avgHitDie + conMod)
 * - dc: 8 + profBonus + spellcastingMod (INT for Wizard)
 * - slots.*.max: Full caster spell slots table
 * - hitDice.max: Equal to level
 * 
 * Runtime/Session State:
 * - hp.current, hp.temp: Current health state
 * - hitDice.current: Available hit dice to spend
 * - slots.*.used: Expended spell slots
 * - deathSaves: Current death save progress
 * - concentration, transformed, etc.
 */
export interface CharacterData {
    // === HEALTH ===
    /** HP state: current (runtime), max (derived from level/CON), temp (runtime) */
    hp: { current: number; max: number; temp: number };
    /** Hit dice: current (runtime), max (derived = level), size (base = class hit die) */
    hitDice: HitDice;

    // === ARMOR CLASS ===
    /** Base AC (editable) - typically 10 + DEX for unarmored */
    baseAC: number;
    /** Runtime toggle for Mage Armour spell */
    mageArmour: boolean;
    /** Runtime toggle for Shield spell */
    shield: boolean;

    // === LEVEL & PROFICIENCY ===
    /** Character level (base, editable) - 1 to 20 */
    level: number;
    /** Proficiency bonus (derived) = 2 + floor((level - 1) / 4) */
    profBonus: number;

    // === SPELLCASTING ===
    /** Spell save DC (derived) = 8 + profBonus + spellcastingMod */
    dc: number;
    /** Spell slots: used (runtime), max (derived from level) */
    slots: {
        [level: number]: { used: number; max: number };
    };

    // === SAVING THROWS ===
    /** Which saving throws the character is proficient in (base) */
    savingThrowProficiencies: ('str' | 'dex' | 'con' | 'int' | 'wis' | 'cha')[];
    /** Current death save progress (runtime) */
    deathSaves: { successes: number; failures: number };

    // === ABILITIES ===
    /** Ability scores (base) and modifiers (derived) */
    abilities: {
        str: Ability;
        dex: Ability;
        con: Ability;
        int: Ability;
        wis: Ability;
        cha: Ability;
    };

    // === SKILLS ===
    /** Skill proficiencies and attributes (base) */
    skills: {
        [key: string]: Skill;
    };

    // === MINIONS ===
    /** Default stats for summoned minions (base) */
    defaultMinion: {
        [key: string]: MinionStats;
    };

    // === RUNTIME STATE ===
    /** Currently concentrating spell (runtime) */
    concentration: string | null;
    /** Attuned magic items, max 3 (runtime) */
    attunement: string[];
    /** General inventory items (runtime) */
    inventory: string[];
    /** Wild Shape / Polymorph state (runtime) */
    transformed: {
        active: boolean;
        creatureName: string;
        hp: { current: number; max: number };
        ac: number;
    } | null;
}

export interface Session {
    id: string;
    sessionNumber: number;
    date: string;
    label?: string;
    characterData: CharacterData;
    minions: Minion[];
    lastModified: string;
}

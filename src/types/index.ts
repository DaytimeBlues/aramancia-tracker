// Core ability types
export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScores {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export interface AbilityMods {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

// Skill types
export interface Skill {
    name: string;
    attr: AbilityKey;
    prof: boolean;
}

export interface Skills {
    acrobatics: Skill;
    animalHandling: Skill;
    arcana: Skill;
    athletics: Skill;
    deception: Skill;
    history: Skill;
    insight: Skill;
    intimidation: Skill;
    investigation: Skill;
    medicine: Skill;
    nature: Skill;
    perception: Skill;
    performance: Skill;
    persuasion: Skill;
    religion: Skill;
    sleightOfHand: Skill;
    stealth: Skill;
    survival: Skill;
}

// HP and Hit Dice
export interface HitPoints {
    current: number;
    max: number;
    temp: number;
}

export interface HitDice {
    current: number;
    max: number;
    size: number;
}

// Death Saves
export interface DeathSaves {
    successes: number;
    failures: number;
}

// Spell Slots
export interface SpellSlot {
    max: number;
    used: number;
}

export interface SpellSlots {
    1: SpellSlot;
    2: SpellSlot;
    3: SpellSlot;
    4: SpellSlot;
    5: SpellSlot;
    6: SpellSlot;
    7: SpellSlot;
    8: SpellSlot;
    9: SpellSlot;
}

// Inventory
export interface InventoryItem {
    name: string;
    quantity?: number;
    weight?: number;
    description?: string;
    spells?: string[];
}

// Minion types
export interface MinionAttack {
    name: string;
    bonus: number;
    damage: string;
}

export interface Minion {
    id: string;
    type: string;
    name: string;
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    attacks: MinionAttack[];
    conditions: string[];
    notes?: string;
}

// Warlock-specific types
export interface PactSlots {
    current: number;
    max: number;
    level: number;
}

export interface Invocation {
    id: string;
    name: string;
    description: string;
    active: boolean;
}

export interface PactBoon {
    type: 'chain' | 'blade' | 'tome';
    pactWeapon?: {
        name: string;
        type: string;
    };
    familiar?: string;
}

export interface Patron {
    name: string;
    features: string[];
}

export interface Arcanum {
    6?: string;
    7?: string;
    8?: string;
    9?: string;
}

// Spell type
export interface Spell {
    id: string;
    name: string;
    lvl: number;
    school: string;
    time: string;
    range: string;
    components: string;
    duration: string;
    classes: string[];
    description: string;
    concentration?: boolean;
    ritual?: boolean;
    attack?: 'melee' | 'ranged';
    save?: AbilityKey;
    damage?: string;
    damageType?: string;
}

// Character Data
export interface CharacterData {
    // Core stats
    hp: HitPoints;
    hitDice: HitDice;
    baseAC: number;
    dc: number;
    profBonus: number;
    level: number;
    savingThrowProficiencies: AbilityKey[];
    deathSaves: DeathSaves;
    
    // Abilities
    abilities: AbilityScores;
    abilityMods: AbilityMods;
    skills: Skills;
    
    // Spells and magic
    concentration: string | null;
    attunement: InventoryItem[];
    inventory: InventoryItem[];
    slots: SpellSlots;
    mageArmour: boolean;
    shield: boolean;
    preparedSpells: string[];
    
    // Warlock-specific
    pactSlots: PactSlots;
    cantripsKnown: string[];
    spellsKnown: string[];
    arcanum: Arcanum;
    invocations: Invocation[];
    pactBoon: PactBoon;
    patron: Patron;
}

// Session type
export interface Session {
    id: string;
    sessionNumber: number;
    date: string;
    label?: string;
    characterData: CharacterData;
    lastModified: string;
    minions: Minion[];
}

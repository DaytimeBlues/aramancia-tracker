import type { Familiar } from './types';

export interface CharacterState {
    // ... typical character fields
    familiar: Familiar | null;
}

export const FAMILIAR_FORMS: Familiar['form'][] = [
    'owl',
    'cat',
    'raven',
    'bat',
    'hawk',
    'lizard',
    'snake',
    'octopus',
    'spider',
    'frog',
    'crab',
    'seahorse',
    'fish',
    'rat',
    'weasel'
];

export interface FamiliarBase {
    form: Familiar['form'];
    hp: number;
    maxHp: number;
    ac: number;
    speed: number;
    flySpeed?: number;
    swimSpeed?: number;
    senses: string;
}

export const FAMILIAR_STATS: Record<Familiar['form'], FamiliarBase> = {
    owl: { form: 'owl', hp: 1, maxHp: 1, ac: 11, speed: 5, flySpeed: 60, senses: 'Darkvision 120 ft., Passive Perception 13' },
    cat: { form: 'cat', hp: 2, maxHp: 2, ac: 12, speed: 40, senses: 'Darkvision 60 ft., Passive Perception 13' },
    raven: { form: 'raven', hp: 1, maxHp: 1, ac: 12, speed: 10, flySpeed: 50, senses: 'Passive Perception 13' },
    bat: { form: 'bat', hp: 1, maxHp: 1, ac: 12, speed: 5, flySpeed: 30, senses: 'Blindsight 60 ft., Passive Perception 11' },
    hawk: { form: 'hawk', hp: 1, maxHp: 1, ac: 13, speed: 10, flySpeed: 60, senses: 'Passive Perception 14' },
    lizard: { form: 'lizard', hp: 2, maxHp: 2, ac: 10, speed: 20, senses: 'Darkvision 30 ft., Passive Perception 9' },
    snake: { form: 'snake', hp: 2, maxHp: 2, ac: 13, speed: 30, swimSpeed: 30, senses: 'Blindsight 10 ft., Passive Perception 10' },
    octopus: { form: 'octopus', hp: 3, maxHp: 3, ac: 12, speed: 5, swimSpeed: 30, senses: 'Darkvision 30 ft., Passive Perception 12' },
    spider: { form: 'spider', hp: 1, maxHp: 1, ac: 12, speed: 20, senses: 'Darkvision 30 ft., Passive Perception 10' },
    frog: { form: 'frog', hp: 1, maxHp: 1, ac: 11, speed: 20, swimSpeed: 20, senses: 'Darkvision 30 ft., Passive Perception 11' },
    crab: { form: 'crab', hp: 2, maxHp: 2, ac: 11, speed: 20, swimSpeed: 20, senses: 'Blindsight 30 ft., Passive Perception 9' },
    seahorse: { form: 'seahorse', hp: 1, maxHp: 1, ac: 11, speed: 0, swimSpeed: 20, senses: 'Passive Perception 10' },
    fish: { form: 'fish', hp: 1, maxHp: 1, ac: 11, speed: 0, swimSpeed: 40, senses: 'Darkvision 60 ft., Passive Perception 10' },
    rat: { form: 'rat', hp: 1, maxHp: 1, ac: 10, speed: 20, senses: 'Darkvision 30 ft., Passive Perception 10' },
    weasel: { form: 'weasel', hp: 1, maxHp: 1, ac: 13, speed: 30, senses: 'Passive Perception 13' }
};

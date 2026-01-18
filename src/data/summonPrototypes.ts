import type { SummonPrototype } from '../types';

export const SUMMON_PROTOTYPES: SummonPrototype[] = [
    {
        name: 'Wolf',
        cr: '1/4',
        hp: 11,
        ac: 13,
        speed: 40,
        attacks: [{ name: 'Bite', toHit: 4, damage: '2d4+2', damageType: 'piercing' }],
        abilities: ['Pack Tactics'],
        duration: 600, // 1 hour in rounds
        maxCount: 8,
        spellLevel: 3
    },
    {
        name: 'Giant Wolf Spider',
        cr: '1/4',
        hp: 11,
        ac: 13,
        speed: 40,
        climbSpeed: 40,
        attacks: [{ name: 'Bite', toHit: 3, damage: '1d4+1', damageType: 'piercing' }],
        abilities: ['Spider Climb', 'Web Sense'],
        duration: 600,
        maxCount: 8,
        spellLevel: 3
    },
    {
        name: 'Dryad',
        cr: '1',
        hp: 22,
        ac: 11,
        speed: 30,
        attacks: [{ name: 'Club', toHit: 2, damage: '1d4', damageType: 'bludgeoning' }],
        abilities: ['Innate Spellcasting', 'Tree Stride'],
        duration: 600,
        maxCount: 1,
        spellLevel: 4
    },
    {
        name: 'Smoke Mephit',
        cr: '1/4',
        hp: 22,
        ac: 12,
        speed: 30,
        flySpeed: 30,
        attacks: [{ name: 'Claws', toHit: 4, damage: '1d4+2', damageType: 'slashing' }],
        abilities: ['Death Burst', 'Cinder Breath'],
        duration: 600,
        maxCount: 8,
        spellLevel: 5
    },
    {
        name: 'Fire Elemental',
        cr: '5',
        hp: 102,
        ac: 13,
        speed: 50,
        attacks: [{ name: 'Touch', toHit: 6, damage: '2d6+3', damageType: 'fire' }],
        abilities: ['Fire Form', 'Illumination'],
        duration: 600,
        maxCount: 1,
        spellLevel: 5
    },
    {
        name: 'Water Elemental',
        cr: '5',
        hp: 114,
        ac: 14,
        speed: 30,
        swimSpeed: 90,
        attacks: [{ name: 'Slam', toHit: 7, damage: '2d8+4', damageType: 'bludgeoning' }],
        abilities: ['Water Form', 'Freeze'],
        duration: 600,
        maxCount: 1,
        spellLevel: 5
    }
];

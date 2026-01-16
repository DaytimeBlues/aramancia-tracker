import type { Minion, MinionAttack } from '../types';
import { undeadStats } from '../data/undeadStats';

/**
 * Calculates stats for "Summon Undead" spell (Tasha's Cauldron)
 */
export function createSummonUndead(
    spellLevel: number,
    form: 'ghostly' | 'putrid' | 'skeletal',
    spellAttackMod: number,

): Minion | null {
    const baseStatBlock = undeadStats.find(s => s.name.toLowerCase().includes(form));
    if (!baseStatBlock) return null;

    const level = Math.max(3, spellLevel); // Minimum 3rd level

    // HP: 30 (Ghostly/Putrid) or 20 (Skeletal) + 10 per spell level above 3? 
    // Wait, Tasha's text: "30 (Ghostly/Putrid) or 20 (Skeletal) + 10 for each spell level above 3rd"
    // Actually the stat block says "30 + 10/Level" usually means 30 + 10*(Level-3)?
    // Let's stick to the text: "30 + 10 for each spell level above 3rd" 
    // So base (at lvl 3) is 30.
    // Lvl 4 = 40.
    // Formula: Base + 10 * (level - 3).
    const baseHp = form === 'skeletal' ? 20 : 30;
    const hp = baseHp + 10 * (level - 3);

    // AC: 11 + Spell Level
    const ac = 11 + level;

    // Multiattack: Half spell level rounded down
    const attacksCount = Math.floor(level / 2);

    // Damage: 1dX + 3 + Spell Level
    // Ghostly: 1d8, Putrid: 1d6, Skeletal: 2d4
    let dice = '1d8';
    if (form === 'putrid') dice = '1d6';
    if (form === 'skeletal') dice = '2d4'; // Grave Bolt

    const damageBonus = 3 + level;
    const damageString = `${dice} + ${damageBonus}`;

    const attacks: MinionAttack[] = [];

    // Primary Attack
    const attackName = form === 'ghostly' ? 'Deathly Touch' : form === 'putrid' ? 'Rotting Claw' : 'Grave Bolt';
    const damageType = form === 'putrid' ? 'slashing' : 'necrotic';

    attacks.push({
        name: `${attackName} (${attacksCount}x)`,
        toHit: spellAttackMod,
        damage: damageString,
        damageType
    });

    return {
        id: crypto.randomUUID(),
        name: `${form.charAt(0).toUpperCase() + form.slice(1)} Spirit`,
        type: 'undead_spirit',
        form,
        hp,
        maxHp: hp,
        ac,
        speed: form === 'ghostly' ? 0 : 30, // Ghostly flies
        attacks,
        conditions: [],
        notes: `Level ${level} Summon. Immunity: Necrotic, Poison. ${form === 'ghostly' ? 'Fly 40ft (Hover). Incorporeal.' : ''}`
    };
}

/**
 * Calculates stats for "Animate Dead" with Undead Thralls (Necromancer Lvl 6)
 */
export function createAnimateDead(
    type: 'skeleton' | 'zombie',
    wizardLevel: number,
    profBonus: number,
    hasUndeadThralls: boolean = true
): Minion | null {
    const minionType = type; // 'skeleton' or 'zombie' (lowercase)
    // Find base stats. type in undeadStats is capped "Skeleton" / "Zombie"
    const baseStatBlock = undeadStats.find(s => s.name.toLowerCase() === minionType);
    if (!baseStatBlock) return null;

    let hp = parseInt(baseStatBlock.hp.split(' ')[0]) || 1;
    let damageBonus = 0; // Usage: added to weapon damage

    if (hasUndeadThralls) {
        // "Create undead... max hit points increased by your wizard level"
        // It says "hit point maximum is increased by an amount equal to your wizard level"
        hp += wizardLevel;

        // "When undead... rolls damage... add your proficiency bonus to the damage"
        damageBonus = profBonus;
    }

    // Parse attacks and add bonus
    const attacks: MinionAttack[] = baseStatBlock.actions
        .filter(a => ['Shortbow', 'Shortsword', 'Slam'].includes(a.name))
        .map(a => {
            const baseDmg = a.desc.match(/\d+d\d+(?:\s*[+-]\s*(\d+))?/);
            const dice = baseDmg ? baseDmg[0].split(' ')[0] : '1d6'; // e.g. "1d6"
            const staticDmg = baseDmg && baseDmg[1] ? parseInt(baseDmg[1]) : 0;

            // Reconstruct: "1d6 + (Static + Prof)"
            const totalBonus = staticDmg + damageBonus;
            const toHit = parseInt(a.desc.match(/\+(\d+)/)?.[1] || "0");

            return {
                name: a.name,
                toHit,
                damage: `${dice} + ${totalBonus}`,
                damageType: a.desc.includes('piercing') ? 'piercing' : 'bludgeoning'
            };
        });

    return {
        id: crypto.randomUUID(),
        name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type: minionType,
        hp,
        maxHp: hp, // Undead Thralls increases MAX hp
        ac: parseInt(baseStatBlock.ac.split(' ')[0]) || 10,
        speed: parseInt(baseStatBlock.speed.split(' ')[0]) || 30,
        attacks,
        conditions: [],
        notes: hasUndeadThralls ? 'Undead Thralls: +HP, +Dmg' : ''
    };
}

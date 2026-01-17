import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { castingCancelled, castingCompletedWithSlot } from '../../store/slices/combatSlice';
import { ResolutionPanel } from '../features/combat/ResolutionPanel';
import { spells } from '../../data/spells';
import { SpellV3 } from '../../schemas/spellSchema';

const SCHOOL_MAP: Record<string, SpellV3['school']> = {
    ABJ: 'Abjuration',
    CONJ: 'Conjuration',
    DIV: 'Divination',
    ENCH: 'Enchantment',
    EVO: 'Evocation',
    ILLU: 'Illusion',
    NECRO: 'Necromancy',
    TRANS: 'Transmutation',
};

const mapCastingTime = (value?: string): SpellV3['castingTime'] => {
    const normalized = value?.toLowerCase().trim();
    switch (normalized) {
        case '1 action':
            return '1 action';
        case '1 bonus action':
            return '1 bonus action';
        case '1 reaction':
            return '1 reaction';
        case '1 minute':
            return '1 minute';
        case '10 minutes':
            return '10 minutes';
        case '1 hour':
            return '1 hour';
        case '24 hours':
            return '24 hours';
        case 'special':
            return 'special';
        default:
            return '1 action';
    }
};

const mapRange = (value?: string): SpellV3['range'] => {
    const normalized = value?.toLowerCase().trim() ?? '';
    if (normalized === 'self') return 'Self';
    if (normalized === 'touch') return 'Touch';
    if (normalized === 'sight') return 'Sight';
    if (normalized === 'unlimited') return 'Unlimited';
    if (normalized === 'special') return 'Special';
    const feetMatch = normalized.match(/^(\d+)\s*ft/);
    if (feetMatch) {
        const feet = feetMatch[1];
        const withFeet = `${feet} feet`;
        return withFeet as SpellV3['range'];
    }
    if (normalized.endsWith('mile')) return '1 mile';
    return 'Self';
};

const mapDuration = (value?: string): SpellV3['duration'] => {
    const normalized = value?.toLowerCase().trim() ?? '';
    if (normalized.includes('instant')) {
        return { type: 'instantaneous' };
    }
    if (normalized.includes('special')) {
        return { type: 'special', value };
    }
    if (normalized.includes('concentration')) {
        return { type: 'concentration', value };
    }
    if (normalized) {
        return { type: 'timed', value };
    }
    return { type: 'instantaneous' };
};

// Define the shape expected by ResolutionPanel
// Using Partial since we're adapting from legacy spell format and don't have all V3 fields
type SpellAdapter = Partial<SpellV3> & {
    id: string;
    name: string;
    level: number;
    requiresAttackRoll: boolean;
    requiresSavingThrow: boolean;
    ritual: boolean;
    castingTime: SpellV3['castingTime'];
    range: SpellV3['range'];
    components: SpellV3['components'];
    duration: SpellV3['duration'];
    description: string;
    desc?: string;
    decisionTree?: { level: number; summary: string }[];
    higherLevelDescription?: string;
    school: SpellV3['school'];
};

export const CombatOverlay: React.FC = () => {
    const dispatch = useAppDispatch();
    const combatState = useAppSelector(state => state.combat);
    const { phase, casting } = combatState;

    if (phase !== 'resolving') return null;

    const spell = spells.find(s => s.name === casting.spellId) ||
        spells.find(s => s.name.toLowerCase() === casting.spellId?.toLowerCase());

    if (!spell) return null;

    // Adapter: legacy Spell -> enough of SpellV3 for ResolutionPanel.
    const rollsLower = (spell.rolls ?? '').toLowerCase();
    const requiresAttackRoll = rollsLower.includes('attack');
    const requiresSavingThrow = rollsLower.includes('save');

    const saveAbility = (() => {
        const r = spell.rolls ?? '';
        if (r.includes('STR')) return 'Strength';
        if (r.includes('DEX')) return 'Dexterity';
        if (r.includes('CON')) return 'Constitution';
        if (r.includes('INT')) return 'Intelligence';
        if (r.includes('WIS')) return 'Wisdom';
        if (r.includes('CHA')) return 'Charisma';
        return 'Dexterity';
    })();

    const firstDiceMatch = (spell.damage ?? '').match(/(\d+)\s*d\s*(\d+)/i);
    const damage =
        firstDiceMatch && Number(firstDiceMatch[1]) > 0 && Number(firstDiceMatch[2]) > 0
            ? [{
                count: Number(firstDiceMatch[1]),
                sides: Number(firstDiceMatch[2]),
                type: (spell.damageType || 'force').toLowerCase(),
                // Many wizard damage spells scale by +1 die per slot level.
                scaling: { type: 'per_slot_level' as const, diceIncreasePerLevel: 1 }
            }]
            : undefined;

    const spellV3: SpellAdapter = {
        id: spell.name,
        name: spell.name,
        level: spell.lvl,
        school: SCHOOL_MAP[spell.school] ?? 'Evocation',
        ritual: false,
        castingTime: mapCastingTime(spell.castTime),
        range: mapRange(spell.range),
        components: {
            verbal: spell.components?.includes('V') ?? false,
            somatic: spell.components?.includes('S') ?? false,
            material: spell.components?.includes('M') ? 'material component' : undefined,
        },
        duration: mapDuration(spell.duration),
        description: spell.effect || spell.desc || '',
        requiresAttackRoll,
        requiresSavingThrow,
        damage,
        savingThrowDetails: requiresSavingThrow ? {
            ability: saveAbility,
            onSuccess: damage ? 'half' : 'special',
            onFail: damage ? 'full' : 'special',
        } : undefined,
        // Extra fields used by the legacy UI plan
        desc: spell.desc,
        decisionTree: spell.decisionTree,
        higherLevelDescription: undefined,
    } as unknown as SpellAdapter;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
            <div className="w-full max-w-lg">
                <ResolutionPanel
                    spell={spellV3}
                    slotLevel={casting.slotLevel || spell.lvl}
                    onHit={() => {
                        // Logic to apply damage to target minion would go here
                        dispatch(castingCompletedWithSlot());
                    }}
                    onMiss={() => {
                        dispatch(castingCompletedWithSlot());
                    }}
                    onPass={() => {
                        dispatch(castingCompletedWithSlot());
                    }}
                    onFail={() => {
                        dispatch(castingCompletedWithSlot());
                    }}
                    onApply={() => {
                        dispatch(castingCompletedWithSlot());
                    }}
                    onCancel={() => {
                        dispatch(castingCancelled());
                    }}
                />
            </div>
        </div>
    );
};

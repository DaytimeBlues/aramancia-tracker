import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { castingCancelled, castingCompletedWithSlot } from '../../store/slices/combatSlice';
import { ResolutionPanel } from '../features/combat/ResolutionPanel';
import { spells } from '../../data/spells';
import type { SpellV3 } from '../../schemas/spellSchema';

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

    // Map legacy school abbreviations to full names
    const mapSchool = (school: string): 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation' => {
        const schoolUpper = school.toUpperCase();
        if (schoolUpper.includes('ABJ')) return 'Abjuration';
        if (schoolUpper.includes('CON')) return 'Conjuration';
        if (schoolUpper.includes('DIV')) return 'Divination';
        if (schoolUpper.includes('ENC')) return 'Enchantment';
        if (schoolUpper.includes('EVO')) return 'Evocation';
        if (schoolUpper.includes('ILL')) return 'Illusion';
        if (schoolUpper.includes('NEC')) return 'Necromancy';
        if (schoolUpper.includes('TRA')) return 'Transmutation';
        return 'Evocation'; // Default fallback
    };

    // Map casting time to valid schema value
    const mapCastingTime = (castTime: string): '1 action' | '1 bonus action' | '1 reaction' | '1 minute' | '10 minutes' | '1 hour' | '24 hours' | 'special' => {
        const ct = castTime.toLowerCase();
        if (ct.includes('bonus')) return '1 bonus action';
        if (ct.includes('reaction')) return '1 reaction';
        if (ct.includes('1 minute') || ct.includes('minute')) return '1 minute';
        if (ct.includes('10 minute')) return '10 minutes';
        if (ct.includes('1 hour') || ct.includes('hour')) return '1 hour';
        if (ct.includes('24 hour')) return '24 hours';
        if (ct.includes('1 action') || ct.includes('action')) return '1 action';
        return 'special';
    };

    // Map range to valid schema value
    const mapRange = (range: string): 'Self' | 'Touch' | '5 feet' | '10 feet' | '30 feet' | '60 feet' | '90 feet' | '100 feet' | '120 feet' | '150 feet' | '300 feet' | '1 mile' | 'Sight' | 'Unlimited' | 'Special' => {
        const r = range.toLowerCase();
        if (r.includes('self')) return 'Self';
        if (r.includes('touch')) return 'Touch';
        if (r.includes('5 feet') || r === '5') return '5 feet';
        if (r.includes('10 feet') || r === '10') return '10 feet';
        if (r.includes('30 feet') || r === '30') return '30 feet';
        if (r.includes('60 feet') || r === '60') return '60 feet';
        if (r.includes('90 feet') || r === '90') return '90 feet';
        if (r.includes('100 feet') || r === '100') return '100 feet';
        if (r.includes('120 feet') || r === '120') return '120 feet';
        if (r.includes('150 feet') || r === '150') return '150 feet';
        if (r.includes('300 feet') || r === '300') return '300 feet';
        if (r.includes('1 mile') || r.includes('mile')) return '1 mile';
        if (r.includes('sight')) return 'Sight';
        if (r.includes('unlimited')) return 'Unlimited';
        return 'Special';
    };

    // Parse components from legacy string format (e.g., "V, S, M (a bit of fur)")
    const parseComponents = (components: string) => {
        const c = components.toUpperCase();
        const hasVerbal = c.includes('V');
        const hasSomatic = c.includes('S');
        const hasMaterial = c.includes('M');
        
        // Extract material description if present
        const materialMatch = components.match(/M\s*\(([^)]+)\)/i);
        const materialDescription = materialMatch ? materialMatch[1] : undefined;

        return {
            verbal: hasVerbal,
            somatic: hasSomatic,
            material: hasMaterial ? materialDescription : undefined,
        };
    };

    // Creating a SpellV3 object for ResolutionPanel with all required fields
    const onSuccessValue: 'half' | 'special' = damage ? 'half' : 'special';
    const onFailValue: 'full' | 'special' = damage ? 'full' : 'special';
    
    const spellV3: SpellV3 & { desc?: string; decisionTree?: typeof spell.decisionTree } = {
        id: spell.name,
        name: spell.name,
        level: spell.lvl,
        school: mapSchool(spell.school),
        ritual: false,
        castingTime: mapCastingTime(spell.castTime),
        range: mapRange(spell.range),
        components: parseComponents(spell.components),
        duration: {
            type: 'instantaneous',
        },
        description: spell.desc || '',
        requiresAttackRoll,
        requiresSavingThrow,
        damage,
        savingThrowDetails: requiresSavingThrow ? {
            ability: saveAbility as 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma',
            onSuccess: onSuccessValue,
            onFail: onFailValue,
        } : undefined,
        higherLevelDescription: undefined,
        // Extra fields used by the legacy UI plan
        desc: spell.desc,
        decisionTree: spell.decisionTree,
    };

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

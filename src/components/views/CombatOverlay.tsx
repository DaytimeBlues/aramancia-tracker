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

    // Creating a SpellV3 object for ResolutionPanel with all required fields
    const onSuccessValue: 'half' | 'special' = damage ? 'half' : 'special';
    const onFailValue: 'full' | 'special' = damage ? 'full' : 'special';
    
    const spellV3: SpellV3 & { desc?: string; decisionTree?: typeof spell.decisionTree } = {
        id: spell.name,
        name: spell.name,
        level: spell.lvl,
        school: 'Evocation', // Default school, could be parsed from spell data if available
        ritual: false,
        castingTime: '1 action',
        range: 'Self',
        components: {
            verbal: true,
            somatic: true,
        },
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

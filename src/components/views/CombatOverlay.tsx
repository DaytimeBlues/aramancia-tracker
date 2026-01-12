import React, { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { castingCompleted, castingCancelled, concentrationStarted } from '../../store/slices/combatSlice';
import { slotExpended } from '../../store/slices/spellbookSlice';
import { ResolutionPanel } from '../features/combat/ResolutionPanel';
import { spells } from '../../data/spells';

export const CombatOverlay: React.FC = () => {
    const dispatch = useAppDispatch();
    const combatState = useAppSelector(state => state.combat);
    const { phase, casting } = combatState;

    // Find the spell being cast
    const spell = spells.find(s => s.name === casting.spellId) ||
        spells.find(s => s.name.toLowerCase() === casting.spellId?.toLowerCase());

    // Handle completing the cast - expend slot and track concentration
    const handleCastComplete = useCallback(() => {
        if (!spell) return;
        
        const slotLevel = casting.slotLevel || spell.lvl;
        
        // Only expend a slot if this is a leveled spell (not a cantrip)
        if (slotLevel > 0) {
            dispatch(slotExpended({ level: slotLevel }));
        }
        
        // If spell requires concentration, start tracking it
        if (spell.concentration) {
            dispatch(concentrationStarted({
                spellId: spell.name,
                spellName: spell.name,
                // Parse duration for max rounds if applicable
                maxDurationRounds: spell.duration.includes('min') 
                    ? parseInt(spell.duration) * 10 
                    : undefined
            }));
        }
        
        dispatch(castingCompleted());
    }, [dispatch, spell, casting.slotLevel]);

    // Handle cancellation - no slot expended
    const handleCancel = useCallback(() => {
        dispatch(castingCancelled());
    }, [dispatch]);

    if (phase !== 'resolving') return null;
    if (!spell) return null;

    // Convert legacy Spell to SpellV3 shape for ResolutionPanel
    // Parse damage dice from string format like "3d6" or "8d6"
    const parseDamage = (dmgStr: string) => {
        const match = dmgStr.match(/(\d+)d(\d+)/);
        if (!match) return { count: 0, sides: 0 };
        return { count: parseInt(match[1]), sides: parseInt(match[2]) };
    };
    
    const dmgParsed = parseDamage(spell.damage);
    
    // Build adapted spell object for ResolutionPanel
    const spellV3 = {
        ...spell,
        id: spell.name,
        level: spell.lvl,
        requiresAttackRoll: spell.rolls.toLowerCase().includes('attack'),
        requiresSavingThrow: spell.rolls.toLowerCase().includes('save'),
        damage: dmgParsed.sides > 0 ? [{
            count: dmgParsed.count,
            sides: dmgParsed.sides,
            type: spell.damageType,
            scaling: { type: 'per_slot_level', diceIncreasePerLevel: 1 }
        }] : [],
        savingThrowDetails: {
            ability: spell.rolls.includes('DEX') ? 'Dexterity' 
                   : spell.rolls.includes('WIS') ? 'Wisdom' 
                   : spell.rolls.includes('CON') ? 'Constitution'
                   : spell.rolls.includes('INT') ? 'Intelligence'
                   : spell.rolls.includes('CHA') ? 'Charisma'
                   : 'Constitution',
            onSuccess: spell.rolls.toLowerCase().includes('half') ? 'half' : 'negates'
        },
        // Pass through the original spell data for display
        description: spell.desc,
        decisionTree: spell.decisionTree
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
            <div className="w-full max-w-lg">
                <ResolutionPanel
                    spell={spellV3}
                    slotLevel={casting.slotLevel || spell.lvl}
                    onHit={handleCastComplete}
                    onMiss={() => {
                        // Miss still expends the slot
                        handleCastComplete();
                    }}
                    onPass={() => {
                        // Target passed save - spell still expended
                        handleCastComplete();
                    }}
                    onFail={handleCastComplete}
                    onApply={handleCastComplete}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};

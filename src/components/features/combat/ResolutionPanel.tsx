import React, { useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpellSaveDC, selectSpellAttackBonus } from '../../../store/slices/characterSlice';
import { SpellV3 } from '../../../schemas/spellSchema';
import { Crosshair, Shield, Sparkles, Check, X, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface DecisionTreeEntry {
    level: number;
    summary: string;
}

interface ExtendedSpellV3 extends SpellV3 {
    decisionTree?: DecisionTreeEntry[];
}

interface ResolutionPanelProps {
    spell: ExtendedSpellV3;
    slotLevel: number;
    onHit?: () => void;
    onMiss?: () => void;
    onPass?: () => void;
    onFail?: () => void;
    onApply?: () => void;
    onCancel: () => void;
}

/**
 * Central panel displaying the resolution flow based on spell mode.
 * 
 * Physical Dice Mode: Shows formulas for the user to roll, then records outcome.
 * 
 * SRD 5.1 Resolution Patterns:
 * - Attack: "make a spell attack" → d20 + spell attack bonus vs AC
 * - Save: "target makes a saving throw" → target rolls vs Spell Save DC
 * - Automatic: No attack/save mentioned → effect applies directly
 */
export const ResolutionPanel: React.FC<ResolutionPanelProps> = ({
    spell,
    slotLevel,
    onHit,
    onMiss,
    onPass,
    onFail,
    onApply,
    onCancel,
}) => {
    const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
    const spellSaveDC = useAppSelector(selectSpellSaveDC);
    const [showDetails, setShowDetails] = useState(false);

    // Determine resolution mode
    const isAttackMode = spell.requiresAttackRoll;
    const isSaveMode = spell.requiresSavingThrow;
    const isAutoMode = !isAttackMode && !isSaveMode;

    // Calculate scaled damage if applicable
    const getScaledDamage = (): string | null => {
        if (!spell.damage || spell.damage.length === 0) return null;

        const dmg = spell.damage[0];
        if (!dmg.count || !dmg.sides) return null;
        
        let diceCount = dmg.count;

        // Apply scaling for upcasting
        if (dmg.scaling?.type === 'per_slot_level' && dmg.scaling.diceIncreasePerLevel) {
            const extraDice = (slotLevel - spell.level) * dmg.scaling.diceIncreasePerLevel;
            diceCount += extraDice;
        }

        return `${diceCount}d${dmg.sides} ${dmg.type}`;
    };

    const scaledDamage = getScaledDamage();
    
    // Get relevant decision tree entries based on slot level
    const getRelevantDecisionTree = (): DecisionTreeEntry[] => {
        if (!spell.decisionTree) return [];
        return spell.decisionTree.filter(entry => entry.level <= slotLevel * 2 + 1);
    };
    
    const relevantDecisions = getRelevantDecisionTree();
    const currentTierDecision = relevantDecisions.length > 0 
        ? relevantDecisions[relevantDecisions.length - 1] 
        : null;

    return (
        <div className="card-parchment overflow-hidden shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-black/20">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-display tracking-wide text-parchment-light">{spell.name}</h3>
                    {slotLevel > 0 && slotLevel > spell.level && (
                        <span className="text-xs font-display uppercase tracking-wider px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400">
                            Upcast Lv{slotLevel}
                        </span>
                    )}
                </div>
                {slotLevel === 0 && (
                    <span className="text-xs text-muted uppercase tracking-wider">Cantrip</span>
                )}
            </div>

            {/* Resolution Mode Content */}
            <div className="p-4 space-y-4">

                {/* === ATTACK MODE === */}
                {isAttackMode && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-400">
                            <Crosshair className="w-5 h-5" />
                            <span className="text-sm font-display uppercase tracking-wider">Spell Attack</span>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-black/40 rounded-lg p-4 text-center border border-white/5">
                            <div className="text-xs text-muted uppercase tracking-wider mb-2 font-sans">Roll</div>
                            <div className="text-3xl font-mono font-bold text-parchment-light">
                                d20 + {spellAttackBonus}
                            </div>
                            <div className="text-sm text-muted mt-2 font-body">vs Target AC</div>
                        </div>

                        {scaledDamage && (
                            <div className="bg-black/30 rounded-lg p-3 text-center border border-red-900/30">
                                <div className="text-xs text-muted uppercase tracking-wider mb-1 font-sans">On Hit</div>
                                <div className="text-xl font-mono text-red-400">{scaledDamage}</div>
                            </div>
                        )}

                        {/* Outcome Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onHit}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-900/20 hover:bg-green-900/40 border border-green-800/50 rounded-lg text-green-400 font-display text-sm uppercase tracking-wider transition-all duration-200 ripple-effect"
                            >
                                <Check className="w-5 h-5" />
                                Hit
                            </button>
                            <button
                                onClick={onMiss}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-black/30 hover:bg-black/50 border border-white/10 rounded-lg text-muted font-display text-sm uppercase tracking-wider transition-all duration-200 ripple-effect"
                            >
                                <X className="w-5 h-5" />
                                Miss
                            </button>
                        </div>
                    </div>
                )}

                {/* === SAVE MODE === */}
                {isSaveMode && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-400">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm font-display uppercase tracking-wider">Saving Throw</span>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-black/40 rounded-lg p-4 text-center border border-white/5">
                            <div className="text-xs text-muted uppercase tracking-wider mb-2 font-sans">
                                Target rolls {spell.savingThrowDetails?.ability || 'DEX'} Save
                            </div>
                            <div className="text-3xl font-mono font-bold text-parchment-light">
                                DC {spellSaveDC}
                            </div>
                        </div>

                        {scaledDamage && (
                            <div className="flex gap-3">
                                <div className="flex-1 bg-red-950/30 border border-red-900/30 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted uppercase tracking-wider mb-1 font-sans">On Fail</div>
                                    <div className="text-lg font-mono text-red-400">{scaledDamage}</div>
                                </div>
                                <div className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-center">
                                    <div className="text-xs text-muted uppercase tracking-wider mb-1 font-sans">On Pass</div>
                                    <div className="text-lg font-mono text-muted">
                                        {spell.savingThrowDetails?.onSuccess === 'half' ? 'Half Damage' : 'No Effect'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Outcome Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onFail}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-800/50 rounded-lg text-red-400 font-display text-sm uppercase tracking-wider transition-all duration-200 ripple-effect"
                            >
                                <X className="w-5 h-5" />
                                Failed Save
                            </button>
                            <button
                                onClick={onPass}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-900/20 hover:bg-green-900/40 border border-green-800/50 rounded-lg text-green-400 font-display text-sm uppercase tracking-wider transition-all duration-200 ripple-effect"
                            >
                                <Check className="w-5 h-5" />
                                Passed Save
                            </button>
                        </div>
                    </div>
                )}

                {/* === AUTOMATIC MODE === */}
                {isAutoMode && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-purple-400">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-display uppercase tracking-wider">Automatic Effect</span>
                        </div>

                        <div className="bg-black/40 rounded-lg p-4 text-center border border-white/5">
                            <div className="text-xs text-muted uppercase tracking-wider mb-2 font-sans">No Roll Needed</div>
                            <div className="text-lg text-parchment font-body">
                                Effect applies automatically
                            </div>
                        </div>

                        {scaledDamage && (
                            <div className="bg-purple-950/30 border border-purple-900/30 rounded-lg p-3 text-center">
                                <div className="text-xs text-muted uppercase tracking-wider mb-1 font-sans">Damage</div>
                                <div className="text-xl font-mono text-purple-400">{scaledDamage}</div>
                            </div>
                        )}

                        <button
                            onClick={onApply}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/50 rounded-lg text-purple-300 font-display text-sm uppercase tracking-wider transition-all duration-200 ripple-effect"
                        >
                            <Sparkles className="w-5 h-5" />
                            Apply Effect
                        </button>
                    </div>
                )}
                
                {/* === SPELL DESCRIPTION & DECISION TREE === */}
                {(spell.description || currentTierDecision) && (
                    <div className="border-t border-white/10 pt-4">
                        <button 
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full flex items-center justify-between text-left text-muted hover:text-parchment transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-xs font-display uppercase tracking-wider">Spell Details</span>
                            </div>
                            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {showDetails && (
                            <div className="mt-3 space-y-3 animate-slide-down">
                                {/* Current Tier Info */}
                                {currentTierDecision && (
                                    <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-lg p-3">
                                        <div className="text-xs text-yellow-600 uppercase tracking-wider mb-1 font-sans">
                                            Current Tier (Level {currentTierDecision.level})
                                        </div>
                                        <p className="text-sm text-yellow-200/90 font-body leading-relaxed">
                                            {currentTierDecision.summary}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Full Description */}
                                {spell.description && (
                                    <div className="bg-black/20 rounded-lg p-3">
                                        <div className="text-xs text-muted uppercase tracking-wider mb-2 font-sans">
                                            Description
                                        </div>
                                        <p className="text-sm text-parchment/90 font-body leading-relaxed">
                                            {spell.description}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Upcast Options */}
                                {spell.decisionTree && spell.decisionTree.length > 1 && (
                                    <div className="bg-black/20 rounded-lg p-3">
                                        <div className="text-xs text-muted uppercase tracking-wider mb-2 font-sans">
                                            Scaling / Upcast
                                        </div>
                                        <div className="space-y-2">
                                            {spell.decisionTree.map((entry, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className={`text-xs font-body ${
                                                        entry.level <= slotLevel * 2 + 1 
                                                            ? 'text-parchment' 
                                                            : 'text-muted/60'
                                                    }`}
                                                >
                                                    <span className="font-display text-accent/70">Lv{entry.level}:</span>{' '}
                                                    {entry.summary}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Cancel */}
            <div className="px-4 py-3 border-t border-white/5 bg-black/30">
                <button
                    onClick={onCancel}
                    className="w-full text-center text-muted hover:text-parchment text-xs font-display uppercase tracking-wider transition-colors py-1"
                >
                    Cancel Cast
                </button>
            </div>
        </div>
    );
};

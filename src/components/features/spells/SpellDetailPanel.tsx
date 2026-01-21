/**
 * SpellDetailPanel.tsx
 * 
 * Renders the full, expanded details of a spell.
 * Displays SRD-compliant information including damage, saves, components, and tips.
 * 
 * Design: Necromancer Noir aesthetic with spectral borders and soul-green highlights for Necromancy.
 */
import React from 'react';
import { SpellV3 } from '../../../schemas/spellSchema';
import { Skull, Zap, Shield, Target, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface SpellDetailPanelProps {
    spell: SpellV3;
}

export const SpellDetailPanel: React.FC<SpellDetailPanelProps> = ({ spell }) => {
    const isNecromancy = spell.school === 'Necromancy';
    const accentColor = isNecromancy ? 'soul-green' : 'accent';

    return (
        <div className="animate-in slide-in-from-top-1 duration-200 mt-4 pt-4 border-t border-white/10 space-y-4">
            {/* Full Description */}
            <div className="space-y-2">
                <p className="text-sm text-phantom leading-relaxed">
                    {spell.description}
                </p>
            </div>

            {/* At Higher Levels */}
            {spell.higherLevelDescription && (
                <div className={`p-3 rounded-xl bg-${accentColor}/5 border border-${accentColor}/20`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className={`text-${accentColor}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-${accentColor}`}>
                            At Higher Levels
                        </span>
                    </div>
                    <p className="text-xs text-phantom leading-relaxed">
                        {spell.higherLevelDescription}
                    </p>
                </div>
            )}

            {/* Components */}
            <div className="flex flex-wrap gap-2">
                {spell.components.verbal && (
                    <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-phantom font-bold">
                        V
                    </div>
                )}
                {spell.components.somatic && (
                    <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-phantom font-bold">
                        S
                    </div>
                )}
                {spell.components.material && (
                    <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-phantom font-medium flex items-center gap-1.5">
                        <span className="font-bold">M</span>
                        <span className="text-muted italic">({spell.components.material})</span>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Damage */}
                {spell.damage && spell.damage.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-900/10 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-red-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                                Damage
                            </span>
                        </div>
                        <div className="space-y-1">
                            {spell.damage.map((d, i) => (
                                <div key={i} className="text-sm text-white font-display">
                                    {d.count}d{d.sides} <span className="text-red-300 capitalize">{d.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Healing */}
                {spell.healing && spell.healing.length > 0 && (
                    <div className="p-3 rounded-xl bg-soul-green/10 border border-soul-green/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Skull size={14} className="text-soul-green" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-soul-green">
                                Healing
                            </span>
                        </div>
                        <div className="space-y-1">
                            {spell.healing.map((h, i) => (
                                <div key={i} className="text-sm text-white font-display">
                                    {h.count}d{h.sides}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Saving Throw */}
                {spell.requiresSavingThrow && spell.savingThrowDetails && (
                    <div className="p-3 rounded-xl bg-blue-900/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={14} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                Saving Throw
                            </span>
                        </div>
                        <div className="text-sm text-white font-display">
                            {spell.savingThrowDetails.ability}
                        </div>
                        <div className="text-[10px] text-muted mt-1">
                            Success: <span className="text-blue-300 capitalize">{spell.savingThrowDetails.onSuccess}</span>
                        </div>
                    </div>
                )}

                {/* Attack Roll */}
                {spell.requiresAttackRoll && (
                    <div className="p-3 rounded-xl bg-orange-900/10 border border-orange-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={14} className="text-orange-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                                Attack Roll
                            </span>
                        </div>
                        <div className="text-sm text-white font-display capitalize">
                            {spell.attackRollDetails?.type || 'Spell'} Attack
                        </div>
                    </div>
                )}
            </div>

            {/* Reaction Trigger */}
            {spell.reactionTrigger && (
                <div className="p-3 rounded-xl bg-amber-900/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={14} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                            Reaction Trigger
                        </span>
                    </div>
                    <p className="text-xs text-phantom leading-relaxed">
                        {spell.reactionTrigger}
                    </p>
                </div>
            )}

            {/* Usage Tips */}
            {spell.usageTips && (
                <div className={`p-3 rounded-xl bg-${accentColor}/5 border border-${accentColor}/20`}>
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={14} className={`text-${accentColor}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-${accentColor}`}>
                            The Oracle's Whisper
                        </span>
                    </div>
                    <p className="text-xs text-phantom leading-relaxed italic">
                        {spell.usageTips}
                    </p>
                </div>
            )}

            {/* Tags */}
            {spell.tags && spell.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                    {spell.tags.map((tag, i) => (
                        <span
                            key={i}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 text-muted border border-white/5`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SpellDetailPanel;

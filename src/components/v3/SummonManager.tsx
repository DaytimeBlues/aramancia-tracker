/**
 * V3.0 Summon Manager Component
 * UI for tracking active spirit summons (Summon Undead)
 */

import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateSummonHp, removeSummon } from '../../store/slices/summonsSlice';
import { Skull, Heart, Shield, X, Ghost, ShieldAlert, Zap } from 'lucide-react';

export const SummonManager: React.FC = () => {
    const summons = useAppSelector((state) => state.summons.activeSummons);
    const dispatch = useAppDispatch();

    if (summons.length === 0) return null;

    return (
        <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-yellow-400" />
                <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Active Spirits</h3>
            </div>

            {summons.map((summon) => (
                <div
                    key={summon.id}
                    className={`card-parchment p-3 relative group overflow-hidden ${!summon.active ? 'opacity-50 grayscale' : ''}`}
                >
                    {/* Form Icon Overlay */}
                    <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none">
                        {summon.form === 'Ghostly' && <Ghost size={64} />}
                        {summon.form === 'Putrid' && <ShieldAlert size={64} />}
                        {summon.form === 'Skeletal' && <Skull size={64} />}
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <div className="text-sm font-display text-parchment-light flex items-center gap-2">
                                {summon.name}
                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                                    SL {summon.slotLevel}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                {/* HP */}
                                <div className="flex items-center gap-1.5">
                                    <Heart size={12} className="text-red-400" />
                                    <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                                            style={{ width: `${(summon.currentHp / summon.maxHp) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-white/70 tabular-nums">
                                        {summon.currentHp}/{summon.maxHp}
                                    </span>
                                </div>

                                {/* AC */}
                                <div className="flex items-center gap-1">
                                    <Shield size={12} className="text-blue-400" />
                                    <span className="text-[10px] text-white/70">{summon.ac}</span>
                                </div>

                                {/* Attacks */}
                                <div className="flex items-center gap-1">
                                    <Zap size={12} className="text-yellow-400" />
                                    <span className="text-[10px] text-white/70">{summon.attacks} {summon.attacks === 1 ? 'Attack' : 'Attacks'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            <button
                                onClick={() => dispatch(updateSummonHp({ id: summon.id, amount: -5 }))}
                                className="p-1.5 hover:bg-white/10 rounded transition-colors text-red-400/70 hover:text-red-400"
                                title="Sustain 5 damage"
                            >
                                <Heart size={14} />
                            </button>
                            <button
                                onClick={() => dispatch(removeSummon(summon.id))}
                                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
                                title="Dismiss spirit"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Turn Reminder */}
                    <div className="mt-2 text-[9px] text-muted italic flex items-center gap-1">
                        <Zap size={10} className="animate-pulse" />
                        Acts immediately after your turn ends. Commands cost NO ACTION.
                    </div>
                </div>
            ))}
        </div>
    );
};

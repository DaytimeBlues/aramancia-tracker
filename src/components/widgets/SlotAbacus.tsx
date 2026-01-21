import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSlots, slotUsed, slotRestored } from '../../store/slices/characterSlice';
import { RotateCcw, Skull, Wand2, Ghost } from 'lucide-react';
import { ArcaneRecoveryModal } from './ArcaneRecoveryModal';

interface SlotAbacusProps {
    compact?: boolean;
}

export const SlotAbacus: React.FC<SlotAbacusProps> = ({ compact = false }) => {
    const dispatch = useAppDispatch();
    const slots = useAppSelector(selectSlots);
    const level = useAppSelector(state => state.character.level);
    const arcaneRecoveryUsed = useAppSelector(state => state.character.arcaneRecoveryUsed);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);

    const activeSlotLevels = Object.entries(slots)
        .filter(([, slot]) => slot.max > 0)
        .sort(([a], [b]) => Number(a) - Number(b));

    const handleSlotClick = (slotLevel: number, isAvailable: boolean) => {
        if (isAvailable) {
            dispatch(slotUsed({ level: slotLevel }));
        } else {
            dispatch(slotRestored({ level: slotLevel }));
        }
    };

    const hasUsedSlots = Object.values(slots).some(s => s.used > 0);
    const canUseRecovery = !arcaneRecoveryUsed && hasUsedSlots;

    if (compact) {
        return (
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 animate-fade-in border-t border-white/5 pt-3">
                {activeSlotLevels.map(([levelStr, { used, max }]) => {
                    const slotLevel = Number(levelStr);
                    const available = max - used;
                    return (
                        <div key={slotLevel} className="flex items-center gap-2">
                            <span className="text-[10px] text-phantom font-black tracking-widest uppercase w-4 text-center">
                                {slotLevel === 0 ? 'C' : slotLevel}
                            </span>
                            <div className="flex gap-1">
                                {Array.from({ length: max }).map((_, i) => {
                                    const isAvailable = i < available;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleSlotClick(slotLevel, isAvailable)}
                                            className={`
                                                relative w-3 h-3 rounded-full transition-all duration-500 tap-feedback
                                                ${isAvailable
                                                    ? 'bg-soul-green shadow-[0_0_8px_rgba(16,185,129,0.5)] hover:bg-white'
                                                    : 'bg-white/[0.05] border border-white/10 hover:border-white/30'
                                                }
                                            `}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative group overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-soul-green/10 rounded-xl border border-soul-green/20">
                        <Skull size={18} className="text-soul-green" />
                    </div>
                    <div>
                        <h3 className="font-display text-base text-white tracking-[0.2em] uppercase leading-none mb-1">Soul Reservoirs</h3>
                        <p className="text-[9px] text-muted tracking-widest font-black uppercase">Arcane Matrix Status</p>
                    </div>
                </div>

                {/* Arcane Recovery Button */}
                <button
                    onClick={() => setShowRecoveryModal(true)}
                    disabled={!canUseRecovery}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest
                        transition-all duration-300 tap-feedback border
                        ${canUseRecovery
                            ? 'bg-soul-green/20 text-soul-green border-soul-green/40 hover:bg-soul-green/30 hover:scale-105'
                            : 'bg-black/20 text-muted border-white/5 cursor-not-allowed opacity-50'
                        }
                    `}
                >
                    <RotateCcw size={12} className={canUseRecovery ? 'animate-spin-slow' : ''} />
                    <span>Siphon</span>
                </button>
            </div>

            {/* Slot Matrix (Abacus Style) */}
            <div className="space-y-6 relative z-10">
                {activeSlotLevels.map(([levelStr, { used, max }]) => {
                    const slotLevel = Number(levelStr);
                    const available = max - used;

                    return (
                        <div key={slotLevel} className="flex items-center gap-5 group/row">
                            {/* Level Label */}
                            <div className="w-16 flex-shrink-0 flex items-center gap-2">
                                <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 group-hover/row:border-soul-green/40 transition-colors">
                                    <Wand2 size={12} className="text-muted group-hover/row:text-soul-green transition-colors" />
                                </div>
                                <span className="text-[10px] text-phantom font-black uppercase tracking-widest">
                                    {slotLevel === 0 ? 'Cant' : `Lvl ${slotLevel}`}
                                </span>
                            </div>

                            {/* Bead Matrix */}
                            <div className="flex-1 flex gap-3 flex-wrap items-center">
                                <div className="h-px bg-white/5 flex-1 max-w-[40px] hidden sm:block" />
                                <div className="flex gap-4 items-center">
                                    {Array.from({ length: max }).map((_, i) => {
                                        const isAvailable = i < available;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleSlotClick(slotLevel, isAvailable)}
                                                className={`
                                                    relative w-10 h-10 transition-all duration-500
                                                    tap-feedback group/bead flex items-center justify-center
                                                `}
                                                title={isAvailable ? 'Consume' : 'Restore'}
                                            >
                                                {/* The Bead visual */}
                                                <div className={`
                                                    w-7 h-7 rounded-2xl border-2 transition-all duration-700 relative
                                                    ${isAvailable
                                                        ? 'bg-soul-green border-white/40 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110 group-hover/bead:scale-125'
                                                        : 'bg-black/40 border-white/10 opacity-30 group-hover/bead:opacity-100'
                                                    }
                                                `}>
                                                    {/* Internal Glow for available slots */}
                                                    {isAvailable && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl opacity-50" />
                                                    )}
                                                </div>

                                                {/* Interaction Highlight */}
                                                <div className={`absolute inset-0 rounded-2xl bg-white/5 blur-md opacity-0 group-hover/bead:opacity-100 transition-opacity`} />
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="h-px bg-white/5 flex-1 hidden sm:block" />
                            </div>

                            {/* Resonance Level */}
                            <div className="text-[10px] text-phantom font-black uppercase tracking-widest tabular-nums min-w-[40px] text-right">
                                {available}<span className="opacity-20 mx-1">/</span>{max}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Background Suggestion */}
            <div className="absolute -bottom-8 -right-8 pointer-events-none opacity-[0.03]">
                <Ghost size={160} className="text-white" />
            </div>

            {/* Arcane Recovery Modal */}
            {showRecoveryModal && (
                <ArcaneRecoveryModal
                    onClose={() => setShowRecoveryModal(false)}
                    wizardLevel={level}
                />
            )}
        </div>
    );
};

export default SlotAbacus;

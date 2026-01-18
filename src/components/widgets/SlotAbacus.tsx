/**
 * SlotAbacus.tsx
 *
 * WHY: Kyoto-style abacus visual for spell slot tracking.
 * Replaces simple orb-based SpellSlotsWidget with a more
 * scholarly "bead" aesthetic per the Wizard App design guide.
 *
 * Design:
 * - Each level is a horizontal row of stone beads
 * - Available = Glowing indigo bead
 * - Used = Dark hollow bead
 * - Integrated Arcane Recovery button
 */
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSlots, slotUsed, slotRestored } from '../../store/slices/characterSlice';
import { Sparkles, RotateCcw } from 'lucide-react';
import { ArcaneRecoveryModal } from './ArcaneRecoveryModal';
import orbActive from '/assets/orb-active.png';
import orbEmpty from '/assets/orb-empty.png';

export const SlotAbacus: React.FC = () => {
    const dispatch = useAppDispatch();
    const slots = useAppSelector(selectSlots);
    const level = useAppSelector(state => state.character.level);
    const arcaneRecoveryUsed = useAppSelector(state => state.character.arcaneRecoveryUsed);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);

    // Filter to only show levels with max > 0
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

    // Check if any slots are used (for recovery eligibility)
    const hasUsedSlots = Object.values(slots).some(s => s.used > 0);
    const canUseRecovery = !arcaneRecoveryUsed && hasUsedSlots;

    return (
        <div className="card-parchment p-5 mb-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
                        <Sparkles size={18} className="text-indigo-400" />
                    </div>
                    <h3 className="font-display text-sm text-parchment tracking-wider uppercase">
                        Spell Slots
                    </h3>
                </div>

                {/* Arcane Recovery Button */}
                <button
                    onClick={() => setShowRecoveryModal(true)}
                    disabled={!canUseRecovery}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                        transition-all duration-200 tap-feedback
                        ${canUseRecovery
                            ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-800/50'
                            : 'bg-stone-900/40 text-stone-500 border border-stone-700/30 cursor-not-allowed'
                        }
                    `}
                    title={arcaneRecoveryUsed ? 'Already used today (resets on long rest)' : 'Recover spell slots'}
                >
                    <RotateCcw size={12} />
                    <span>Recover</span>
                </button>
            </div>

            {/* Slot Rows (Abacus Style) */}
            <div className="space-y-3">
                {activeSlotLevels.map(([levelStr, { used, max }]) => {
                    const slotLevel = Number(levelStr);
                    const available = max - used;

                    return (
                        <div key={slotLevel} className="flex items-center gap-3">
                            {/* Level Label */}
                            <div className="w-12 flex-shrink-0">
                                <span className="text-xs text-stone-400 font-display">
                                    {slotLevel === 0 ? 'C' : `L${slotLevel}`}
                                </span>
                            </div>

                            {/* Bead Row */}
                            <div className="flex gap-2 flex-wrap">
                                {Array.from({ length: max }).map((_, i) => {
                                    const isAvailable = i < available;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleSlotClick(slotLevel, isAvailable)}
                                            className={`
                                                relative w-8 h-8 transition-all duration-500
                                                tap-feedback group
                                                ${isAvailable ? 'hover:scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}
                                            `}
                                            title={isAvailable ? 'Use slot' : 'Restore slot'}
                                        >
                                             <img
                                                 src={isAvailable ? orbActive : orbEmpty}
                                                 alt={isAvailable ? "Active Slot" : "Empty Slot"}
                                                className={`
                                                    w-full h-full object-contain transition-all duration-700
                                                    ${isAvailable
                                                        ? 'drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(129,140,248,0.8)]'
                                                        : 'grayscale-[0.5] contrast-[0.8]'
                                                    }
                                                `}
                                            />

                                            {/* Selection Flare */}
                                            {isAvailable && (
                                                <div className="absolute inset-0 rounded-full bg-indigo-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Count */}
                            <div className="text-xs text-stone-500 font-mono min-w-[32px] text-right">
                                {available}/{max}
                            </div>
                        </div>
                    );
                })}
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

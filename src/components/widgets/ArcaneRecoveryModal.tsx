/**
 * ArcaneRecoveryModal.tsx
 *
 * WHY: Modal for selecting which spell slots to recover via Arcane Recovery.
 * Implements SRD 5.1 rules:
 * - Sum of selected slot levels <= ceil(wizardLevel / 2)
 * - No slot can be 6th level or higher
 *
 * Design: Checkbox selection with running total validation.
 */
import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSlots, arcaneRecoveryActivated } from '../../store/slices/characterSlice';
import { RotateCcw, X, AlertTriangle, Check } from 'lucide-react';

interface ArcaneRecoveryModalProps {
    onClose: () => void;
    wizardLevel: number;
}

interface SlotSelection {
    level: number;
    count: number;
}

export const ArcaneRecoveryModal: React.FC<ArcaneRecoveryModalProps> = ({
    onClose,
    wizardLevel,
}) => {
    const dispatch = useAppDispatch();
    const slots = useAppSelector(selectSlots);

    // Calculate max recovery points
    const maxPoints = Math.ceil(wizardLevel / 2);

    // Initialize selection state (only for levels 1-5 that have used slots)
    const [selection, setSelection] = useState<Record<number, number>>(() => {
        const initial: Record<number, number> = {};
        for (let lvl = 1; lvl <= 5; lvl++) {
            initial[lvl] = 0;
        }
        return initial;
    });

    // Get usable slots (levels 1-5 with used > 0)
    const recoverableSlots = useMemo(() => {
        return Object.entries(slots)
            .filter(([lvlStr, slot]) => {
                const lvl = Number(lvlStr);
                return lvl >= 1 && lvl <= 5 && slot.used > 0;
            })
            .map(([lvlStr, slot]) => ({
                level: Number(lvlStr),
                used: slot.used,
                max: slot.max,
            }));
    }, [slots]);

    // Calculate current total
    const currentTotal = useMemo(() => {
        return Object.entries(selection).reduce(
            (sum, [lvlStr, count]) => sum + Number(lvlStr) * count,
            0
        );
    }, [selection]);

    const isValid = currentTotal > 0 && currentTotal <= maxPoints;
    const remaining = maxPoints - currentTotal;

    const handleIncrement = (level: number) => {
        const maxRecoverable = slots[level]?.used || 0;
        const current = selection[level] || 0;
        const costIfIncremented = currentTotal + level;

        if (current < maxRecoverable && costIfIncremented <= maxPoints) {
            setSelection(prev => ({ ...prev, [level]: current + 1 }));
        }
    };

    const handleDecrement = (level: number) => {
        const current = selection[level] || 0;
        if (current > 0) {
            setSelection(prev => ({ ...prev, [level]: current - 1 }));
        }
    };

    const handleConfirm = () => {
        const slotsToRecover: SlotSelection[] = Object.entries(selection)
            .filter(([, count]) => count > 0)
            .map(([lvlStr, count]) => ({ level: Number(lvlStr), count }));

        dispatch(arcaneRecoveryActivated({ slotsToRecover }));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-6 max-w-md mx-4 w-full shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center">
                            <RotateCcw size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-display text-parchment-light">Arcane Recovery</h3>
                            <p className="text-xs text-stone-400">Recover spell slots (Short Rest)</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-stone-800 transition-colors"
                    >
                        <X size={18} className="text-stone-400" />
                    </button>
                </div>

                {/* Rules Reminder */}
                <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-indigo-900/20 border border-indigo-500/20">
                    <AlertTriangle size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-300">
                        Select up to <strong>{maxPoints} levels</strong> of spell slots to recover.
                        Slots must be 5th level or lower.
                    </p>
                </div>

                {/* Slot Selection */}
                {recoverableSlots.length === 0 ? (
                    <p className="text-center text-stone-500 py-4">No spell slots to recover.</p>
                ) : (
                    <div className="space-y-3 mb-6">
                        {recoverableSlots.map(({ level, used }) => {
                            const selected = selection[level] || 0;
                            const canIncrement = selected < used && currentTotal + level <= maxPoints;

                            return (
                                <div key={level} className="flex items-center justify-between p-3 rounded-lg bg-stone-900/50 border border-stone-800">
                                    <div>
                                        <span className="font-display text-parchment">Level {level}</span>
                                        <span className="text-xs text-stone-500 ml-2">({used} used)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecrement(level)}
                                            disabled={selected <= 0}
                                            className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center font-mono text-parchment-light">
                                            {selected}
                                        </span>
                                        <button
                                            onClick={() => handleIncrement(level)}
                                            disabled={!canIncrement}
                                            className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            +
                                        </button>
                                        <span className="text-xs text-stone-500 ml-1 w-12">
                                            = {level * selected} pts
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                    <div className="text-sm">
                        <span className={currentTotal > maxPoints ? 'text-red-400' : 'text-stone-400'}>
                            Total: <strong className="text-parchment-light">{currentTotal}</strong> / {maxPoints}
                        </span>
                        {remaining > 0 && currentTotal > 0 && (
                            <span className="text-stone-500 ml-2">({remaining} remaining)</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!isValid}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                                ${isValid
                                    ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-800/60'
                                    : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                                }
                            `}
                        >
                            <Check size={16} />
                            Recover
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArcaneRecoveryModal;

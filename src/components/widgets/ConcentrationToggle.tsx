/**
 * ConcentrationToggle.tsx
 *
 * WHY: Prominent toggle for concentration spells with confirmation dialog.
 * Per the design guide, if a user casts a NEW concentration spell while
 * already concentrating, warn them they will drop the previous spell.
 *
 * Design Rationale:
 * - Wizards rely heavily on concentration (Haste, Wall of Force, etc.)
 * - Must be easy to tap and clearly visible
 * - Confirmation dialog prevents accidental loss
 */
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { concentrationSet, selectConcentration } from '../../store/slices/characterSlice';
import { Brain, X, AlertTriangle } from 'lucide-react';

interface ConcentrationToggleProps {
    className?: string;
}

export const ConcentrationToggle: React.FC<ConcentrationToggleProps> = ({ className = '' }) => {
    const dispatch = useAppDispatch();
    const concentration = useAppSelector(selectConcentration);
    const [showDropConfirm, setShowDropConfirm] = useState(false);

    const handleDropConcentration = () => {
        dispatch(concentrationSet(null));
        setShowDropConfirm(false);
    };

    if (!concentration) {
        // Not concentrating - show inactive state as a simple bubble
        return (
            <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-stone-900/60 border border-stone-700/50 text-stone-500/40 ${className}`}
                title="Not Concentrating"
            >
                <Brain size={24} />
            </div>
        );
    }

    return (
        <>
            {/* Active Concentration Display - 56x56 Bubble */}
            <button
                onClick={() => setShowDropConfirm(true)}
                className={`
                    group w-14 h-14 rounded-2xl flex items-center justify-center
                    bg-orange-950/40 border border-orange-500/30
                    shadow-[0_0_20px_rgba(251,146,60,0.3)]
                    hover:scale-105 active:scale-95 transition-all
                    tap-feedback ${className}
                `}
                title={`Concentrating on: ${concentration} (Click to drop)`}
            >
                <div className="relative">
                    <Brain size={26} className="text-orange-400 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                </div>
            </button>

            {/* Drop Confirmation Dialog */}
            {showDropConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-stone-950 border border-stone-800 rounded-xl p-6 max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-display text-parchment-light">Drop Concentration?</h3>
                                <p className="text-xs text-stone-400">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-sm text-stone-300 mb-6">
                            You are currently concentrating on <strong className="text-purple-300">{concentration}</strong>.
                            Dropping concentration will end its effects immediately.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDropConfirm(false)}
                                className="flex-1 px-4 py-2 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDropConcentration}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-900/40 text-red-300 border border-red-700/50 hover:bg-red-800/50 transition-colors"
                            >
                                Drop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConcentrationToggle;

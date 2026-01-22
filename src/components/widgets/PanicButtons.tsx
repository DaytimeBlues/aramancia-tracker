/**
 * PanicButtons.tsx
 *
 * WHY: Implements "Thumb Zones" per Fitts's Law - emergency reaction spells
 * placed at the bottom screen edge for quick access during combat.
 *
 * Design Rationale (from Design Guide):
 * - Fitts's Law states edges/corners are "infinite" targets (can't overshoot).
 * - Panic buttons are positioned at the BOTTOM LEFT corner for right-handed
 *   thumb access on phones.
 *
 * Spells Included:
 * - Shield (Reaction): +5 AC until start of next turn
 * - Absorb Elements (Reaction): Halve damage, add to next attack
 * - Counterspell (Reaction): Attempt to stop enemy spell
 */
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { shieldToggled, slotUsed, toastShown, selectSlots } from '../../store/slices/characterSlice';
import { Shield, Zap, XCircle, ChevronUp } from 'lucide-react';
import { useWizardMode } from '../../context/WizardModeContext';

interface PanicButtonConfig {
    id: string;
    name: string;
    icon: React.ElementType;
    level: number;
    color: string;
    bgColor: string;
    description: string;
}

const PANIC_BUTTONS: PanicButtonConfig[] = [
    {
        id: 'shield',
        name: 'Shield',
        icon: Shield,
        level: 1,
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/40 border-blue-500/30',
        description: '+5 AC until start of next turn',
    },
    {
        id: 'absorb-elements',
        name: 'Absorb',
        icon: Zap,
        level: 1,
        color: 'text-orange-400',
        bgColor: 'bg-orange-900/40 border-orange-500/30',
        description: 'Halve incoming damage, add 1d6 to next attack',
    },
    {
        id: 'counterspell',
        name: 'Counter',
        icon: XCircle,
        level: 3,
        color: 'text-purple-400',
        bgColor: 'bg-purple-900/40 border-purple-500/30',
        description: 'Attempt to stop enemy spell',
    },
];

export const PanicButtons: React.FC = () => {
    const dispatch = useAppDispatch();
    const slots = useAppSelector(selectSlots);
    const { isExecutionMode } = useWizardMode();
    const [isExpanded, setIsExpanded] = useState(false);

    // Only show in Execution (Combat) mode
    if (!isExecutionMode) return null;

    const hasSlotForLevel = (level: number): boolean => {
        // Check if any slot >= level has remaining uses
        return Object.entries(slots).some(([lvl, slot]) =>
            Number(lvl) >= level && slot.max - slot.used > 0
        );
    };

    const getLowestAvailableSlot = (minLevel: number): number | null => {
        for (let lvl = minLevel; lvl <= 9; lvl++) {
            if (slots[lvl] && slots[lvl].max - slots[lvl].used > 0) {
                return lvl;
            }
        }
        return null;
    };

    const handlePanicCast = (button: PanicButtonConfig) => {
        const slotLevel = getLowestAvailableSlot(button.level);
        if (!slotLevel) {
            dispatch(toastShown(`No slots available for ${button.name}!`));
            return;
        }

        dispatch(slotUsed({ level: slotLevel }));

        // Special handling for Shield spell
        if (button.id === 'shield') {
            dispatch(shieldToggled());
            dispatch(toastShown('Shield! +5 AC until your next turn'));
        } else {
            dispatch(toastShown(`${button.name} cast at level ${slotLevel}!`));
        }
    };

    return (
        <div className="flex flex-col-reverse items-center gap-2">
            {/* Expand/Collapse Toggle - 56x56 Bubble */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center
                    transition-all duration-300 ease-out
                    border-2 ${isExpanded ? 'border-red-400 bg-red-800/50' : 'border-red-500/30 bg-red-950/40'}
                    hover:scale-110 active:scale-95
                    shadow-[0_0_20px_rgba(239,68,68,0.4)]
                    tap-feedback
                `}
                aria-label="Toggle Panic Buttons"
                title="Emergency Reactions"
            >
                {/* Emergency Shield Icon when collapsed, Chevron when expanded */}
                {isExpanded ? (
                    <ChevronUp
                        size={28}
                        className="text-red-300 rotate-180"
                    />
                ) : (
                    <Shield
                        size={24}
                        className="text-red-300 animate-pulse"
                    />
                )}
            </button>

            {/* Panic Buttons - Expanded State */}
            {isExpanded && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-200">
                    {PANIC_BUTTONS.map((button) => {
                        const Icon = button.icon;
                        const available = hasSlotForLevel(button.level);

                        return (
                            <button
                                key={button.id}
                                onClick={() => handlePanicCast(button)}
                                disabled={!available}
                                title={button.description}
                                className={`
                                    group relative flex items-center gap-2 px-3 py-2 rounded-full
                                    backdrop-blur-md border transition-all duration-200
                                    ${available
                                        ? `${button.bgColor} hover:scale-105 active:scale-95`
                                        : 'bg-stone-900/60 border-stone-700/50 opacity-50 cursor-not-allowed'
                                    }
                                    tap-feedback
                                `}
                            >
                                <Icon
                                    size={18}
                                    className={available ? button.color : 'text-stone-500'}
                                />
                                <span className={`text-xs font-medium ${available ? button.color : 'text-stone-500'}`}>
                                    {button.name}
                                </span>

                                {/* Tooltip on hover */}
                                <span className="absolute left-full ml-2 px-2 py-1 rounded bg-black/90 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {button.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PanicButtons;

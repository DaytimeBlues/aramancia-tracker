/**
 * ModeToggle.tsx
 *
 * WHY: Provides a visual toggle for switching between "Preparation" (Study)
 * and "Execution" (Combat) modes. Follows Fitts's Law by being placed in
 * an easy-to-reach location.
 *
 * Design: Kyoto-style minimalist toggle with clear visual feedback.
 */
import React from 'react';
import { useWizardMode } from '../../context/WizardModeContext';
import { BookOpen, Swords } from 'lucide-react';

export const ModeToggle: React.FC = () => {
    const { toggleMode, isPreparationMode, isExecutionMode } = useWizardMode();

    return (
        <div className="flex items-center gap-2 p-1 rounded-full bg-stone-900/80 backdrop-blur-sm border border-stone-800">
            <button
                onClick={toggleMode}
                aria-pressed={isPreparationMode}
                aria-label="Preparation Mode"
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-300 ease-out
                    ${isPreparationMode
                        ? 'bg-amber-900/40 text-amber-400 border border-amber-700/50 shadow-inner'
                        : 'text-stone-500 hover:text-stone-300'
                    }
                `}
            >
                <BookOpen size={14} />
                <span className="hidden sm:inline">Study</span>
            </button>
            <button
                onClick={toggleMode}
                aria-pressed={isExecutionMode}
                aria-label="Execution Mode"
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all duration-300 ease-out
                    ${isExecutionMode
                        ? 'bg-red-900/40 text-red-400 border border-red-700/50 shadow-inner'
                        : 'text-stone-500 hover:text-stone-300'
                    }
                `}
            >
                <Swords size={14} />
                <span className="hidden sm:inline">Combat</span>
            </button>
        </div>
    );
};

export default ModeToggle;

/**
 * PreparedSpellsBar.tsx
 * 
 * Displays the current vs max prepared spells with a progress bar.
 * Follows SRD 5.1: "You can prepare a number of wizard spells equal to your
 * Intelligence modifier + your wizard level (minimum of one spell)."
 * 
 * Design: Necromancer Noir with spectral violet fill and warning glow at capacity.
 */
import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectCharacter } from '../../../store/slices/characterSlice';
import { Book, AlertTriangle } from 'lucide-react';

interface PreparedSpellsBarProps {
    currentCount: number;
}

export const PreparedSpellsBar: React.FC<PreparedSpellsBarProps> = ({ currentCount }) => {
    const character = useAppSelector(selectCharacter);

    // SRD 5.1: INT mod + Wizard Level (minimum 1)
    const maxPreparedSpells = Math.max(1, character.level + character.abilityMods.int);

    const percentage = Math.min(100, (currentCount / maxPreparedSpells) * 100);
    const isAtCapacity = currentCount >= maxPreparedSpells;
    const isOverCapacity = currentCount > maxPreparedSpells;

    return (
        <div className={`
            relative p-4 rounded-2xl border transition-all duration-500
            ${isAtCapacity
                ? 'bg-accent/5 border-accent/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                : 'bg-white/[0.02] border-white/10'}
        `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Book size={16} className={isAtCapacity ? 'text-accent' : 'text-phantom'} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-phantom">
                        Daily Grimoire
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isOverCapacity && (
                        <AlertTriangle size={14} className="text-amber-400 animate-pulse" />
                    )}
                    <span className={`font-display text-lg tracking-wider ${isAtCapacity ? 'text-accent' : 'text-white'}`}>
                        {currentCount}
                        <span className="text-phantom"> / </span>
                        {maxPreparedSpells}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                    className={`
                        h-full rounded-full transition-all duration-500 ease-out
                        ${isOverCapacity
                            ? 'bg-gradient-to-r from-amber-500 to-red-500'
                            : isAtCapacity
                                ? 'bg-gradient-to-r from-accent to-accent-glow shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                                : 'bg-gradient-to-r from-accent/60 to-accent'}
                    `}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Subtitle */}
            <p className="text-[10px] text-muted mt-2">
                {isAtCapacity
                    ? 'Grimoire at capacity. Long rest to reconfigure.'
                    : `${maxPreparedSpells - currentCount} slot${maxPreparedSpells - currentCount !== 1 ? 's' : ''} remaining`}
            </p>
        </div>
    );
};

export default PreparedSpellsBar;

import { Skull } from 'lucide-react';
import { Minion } from '../../types';

interface MinionBubbleProps {
    minions: Minion[];
    onClick: () => void;
}

export function MinionBubble({ minions, onClick }: MinionBubbleProps) {
    if (minions.length === 0) {
        console.log("[MinionBubble] No active minions, hiding bubble.");
        return null;
    }

    // Calculate health status
    const totalHp = minions.reduce((sum, m) => sum + m.hp, 0);
    const totalMaxHp = minions.reduce((sum, m) => sum + m.maxHp, 0);
    const healthPercent = (totalHp / totalMaxHp) * 100;

    // Check if any minion is critical (< 25%)
    const hasCriticalMinion = minions.some(m => (m.hp / m.maxHp) < 0.25);

    // Determine ring color
    const getRingColor = () => {
        if (healthPercent > 70) return 'stroke-green-500';
        if (healthPercent > 30) return 'stroke-yellow-500';
        return 'stroke-red-500';
    };

    // SVG Circumference for the ring
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (healthPercent / 100) * circumference;

    return (
        <button
            onClick={() => {
                console.log(`[MinionBubble] Bubble clicked with ${minions.length} minions.`);
                onClick();
            }}
            className={`
                relative w-14 h-14 rounded-full flex items-center justify-center 
                bg-bg-dark/60 backdrop-blur-xl border border-white/10 
                hover:scale-105 active:scale-95 transition-all shadow-2xl tap-feedback
                ${hasCriticalMinion ? 'animate-pulse' : ''}
            `}
            aria-label="Manage Minions"
        >
            {/* Dynamic Health Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    className="stroke-white/5"
                    strokeWidth="3"
                    fill="transparent"
                />
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    className={`transition-all duration-500 ease-out ${getRingColor()}`}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Inner Content */}
            <div className="relative z-10 flex items-center justify-center">
                <Skull
                    size={24}
                    className={`
                        transition-colors duration-300
                        ${healthPercent < 30 ? 'text-red-400' : 'text-parchment'}
                    `}
                />

                {/* Count Badge */}
                <span className="absolute -top-3 -right-3 bg-accent text-bg-dark text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-bg-dark shadow-sm">
                    {minions.length}
                </span>
            </div>

            {/* Critical Indicator Dot */}
            {hasCriticalMinion && (
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-bg-dark animate-ping" />
            )}
        </button>
    );
}

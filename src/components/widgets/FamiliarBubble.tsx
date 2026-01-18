import type { ComponentType } from 'react';
import type { Familiar } from '../../types';
import { Bird, Cat, Bug, Feather, EyeOff, Fish, Rat, Skull, X } from 'lucide-react';

interface FamiliarBubbleProps {
    familiar: Familiar | null;
    onClick: () => void;
}

const FORM_ICONS: Record<Familiar['form'], ComponentType<{ size?: number; className?: string }>> = {
    owl: Bird,
    cat: Cat,
    raven: Bird,
    bat: Bug,
    hawk: Bird,
    lizard: Bug,
    snake: Bug,
    octopus: Bug,
    spider: Bug,
    frog: Bug,
    crab: Bug,
    seahorse: Fish,
    fish: Fish,
    rat: Rat,
    weasel: Bug
};

export function FamiliarBubble({ familiar, onClick }: FamiliarBubbleProps) {
    if (!familiar) {
        return (
            <button
                onClick={onClick}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-blue-300 border-blue-500/30 hover:bg-blue-900/40 hover:scale-105 active:scale-95 transition-all shadow-lg pointer-events-auto"
                title="Find Familiar"
            >
                <Feather size={20} />
            </button>
        );
    }

    const Icon = familiar.isActive ? (FORM_ICONS[familiar.form] || PawPrint) : Skull;
    const hpPercentage = (familiar.hp / familiar.maxHp) * 100;

    return (
        <button
            onClick={onClick}
            className={`group relative w-12 h-12 rounded-full glass-card flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg pointer-events-auto ${!familiar.isActive ? 'text-red-400 grayscale' : 'text-blue-300'
                }`}
            title={`${familiar.name} (${familiar.form})`}
        >
            {/* Health Ring */}
            {familiar.isActive && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="24"
                        cy="24"
                        r="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={138}
                        strokeDashoffset={138 - (138 * hpPercentage) / 100}
                        className="opacity-50 transition-all duration-500"
                    />
                </svg>
            )}

            {/* In Pocket Indicator */}
            {familiar.isInPocket && familiar.isActive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center">
                    <EyeOff size={10} className="text-white" />
                </div>
            )}

            <Icon size={20} className={familiar.isActive ? 'group-hover:animate-pulse' : ''} />
        </button>
    );
}

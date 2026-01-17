import React from 'react';
import { Button } from '../../ui/Button';
import { X, Droplets, EyeOff, EarOff, HeartCrack, HandMetal, PersonStanding, Moon, Skull } from 'lucide-react';

interface ConditionManagerProps {
    isOpen: boolean;
    onClose: () => void;
    activeConditions: string[];
    onToggle: (condition: string) => void;
    actorName: string;
}

const CONDITIONS = [
    { name: 'Blinded', icon: EyeOff, color: 'text-stone-400' },
    { name: 'Charmed', icon: HeartCrack, color: 'text-pink-400' },
    { name: 'Deafened', icon: EarOff, color: 'text-stone-400' },
    { name: 'Frightened', icon: Skull, color: 'text-purple-400' },
    { name: 'Grappled', icon: HandMetal, color: 'text-orange-400' },
    { name: 'Incapacitated', icon: X, color: 'text-red-500' },
    { name: 'Invisible', icon: Moon, color: 'text-blue-200' },
    { name: 'Paralyzed', icon: PersonStanding, color: 'text-yellow-400' },
    { name: 'Petrified', icon: PersonStanding, color: 'text-stone-500' },
    { name: 'Poisoned', icon: Droplets, color: 'text-green-500' },
    { name: 'Prone', icon: PersonStanding, color: 'text-stone-300' },
    { name: 'Restrained', icon: HandMetal, color: 'text-amber-500' },
    { name: 'Stunned', icon: Zap, color: 'text-yellow-300' },
    { name: 'Unconscious', icon: Moon, color: 'text-stone-600' },
];

import { Zap } from 'lucide-react';

export const ConditionManager: React.FC<ConditionManagerProps> = ({
    isOpen,
    onClose,
    activeConditions,
    onToggle,
    actorName
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-md bg-stone-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                    <div>
                        <h3 className="font-display text-lg text-parchment-light">Conditions</h3>
                        <p className="text-xs text-muted">Managing: <span className="text-white">{actorName}</span></p>
                    </div>
                    <button onClick={onClose} className="text-muted hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {CONDITIONS.map((cond) => {
                        const isActive = activeConditions.includes(cond.name);
                        const Icon = cond.icon;

                        return (
                            <button
                                key={cond.name}
                                onClick={() => onToggle(cond.name)}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left
                                    ${isActive
                                        ? 'bg-accent/10 border-accent shadow-[0_0_10px_rgba(212,177,58,0.15)]'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-muted'
                                    }
                                `}
                            >
                                <div className={`p-2 rounded-md ${isActive ? 'bg-accent/20' : 'bg-black/30'}`}>
                                    <Icon size={18} className={isActive ? cond.color : 'text-stone-500'} />
                                </div>
                                <div>
                                    <div className={`font-display text-sm ${isActive ? 'text-white' : 'text-stone-400'}`}>
                                        {cond.name}
                                    </div>
                                    {isActive && (
                                        <div className="text-[10px] text-accent uppercase tracking-wider font-bold">Active</div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end">
                    <Button variant="ghost" onClick={onClose}>Done</Button>
                </div>
            </div>
        </div>
    );
};

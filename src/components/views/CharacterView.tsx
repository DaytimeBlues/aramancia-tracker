import type { CharacterData } from '../../types';
import { Brain, Target } from 'lucide-react';

interface CharacterViewProps {
    data: CharacterData;
}

export function CharacterView({ data }: CharacterViewProps) {
    if (!data) return null;

    return (
        <div className="pb-20">
            {/* Abilities Grid */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Brain size={18} className="text-accent" />
                    <h3 className="font-display text-lg text-parchment-light tracking-wider">Abilities</h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(data.abilities || {}).map(([key, ability]) => (
                        <div key={key} className="card-parchment p-3 text-center">
                            <div className="relative z-10">
                                <div className="text-[10px] text-muted uppercase tracking-wider mb-1">{key}</div>
                                <div className={`text-xl font-display ${(ability?.mod ?? 0) >= 0 ? 'text-accent' : 'text-red-400'}`}>
                                    {(ability?.mod ?? 0) >= 0 ? '+' : ''}{ability?.mod}
                                </div>
                                <div className="text-[10px] text-muted/50">{ability?.score}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Card */}
            <div className="card-parchment overflow-hidden">
                <div className="p-3 border-b border-parchment-dark/20 flex justify-between items-center bg-card-elevated/50 relative z-10">
                    <div className="flex items-center gap-2">
                        <Target size={16} className="text-accent" />
                        <span className="font-display text-base text-parchment-light tracking-wider">Skills</span>
                    </div>
                    <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                        Prof +{data.profBonus}
                    </span>
                </div>

                <div className="divide-y divide-parchment-dark/10 relative z-10">
                    {Object.entries(data.skills || {}).map(([key, skill]) => {
                        if (!skill) return null;
                        const abilityMod = data.abilities?.[skill.attr]?.mod || 0;
                        const totalMod = abilityMod + (skill.prof ? data.profBonus : 0);

                        return (
                            <div key={key} className={`flex justify-between items-center p-3 ${skill.prof ? 'bg-accent/5' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${skill.prof ? 'bg-accent shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-parchment-dark/30'}`} />
                                    <span className={`text-sm ${skill.prof ? 'text-parchment-light font-display' : 'text-muted'}`}>
                                        {skill.name}
                                    </span>
                                    <span className="text-[9px] text-muted/50 uppercase tracking-wider">
                                        {skill.attr}
                                    </span>
                                </div>
                                <span className={`font-display text-sm ${skill.prof ? 'text-accent' : 'text-muted'}`}>
                                    {totalMod >= 0 ? '+' : ''}{totalMod}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

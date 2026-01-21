import { Shield, Ghost, Activity } from 'lucide-react';
import type { CharacterData } from '../../types';

interface SavingThrowsWidgetProps {
    abilityMods: CharacterData['abilityMods'];
    profBonus: number;
    savingThrowProficiencies: ('str' | 'dex' | 'con' | 'int' | 'wis' | 'cha')[];
}

export function SavingThrowsWidget({ abilityMods, profBonus, savingThrowProficiencies }: SavingThrowsWidgetProps) {
    const saves: { key: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'; label: string }[] = [
        { key: 'str', label: 'Strength' },
        { key: 'dex', label: 'Dexterity' },
        { key: 'con', label: 'Constitution' },
        { key: 'int', label: 'Intelligence' },
        { key: 'wis', label: 'Wisdom' },
        { key: 'cha', label: 'Charisma' },
    ];

    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-soul-green/10 rounded-lg border border-soul-green/20">
                        <Shield size={18} className="text-soul-green" />
                    </div>
                    <h3 className="font-display text-base text-white tracking-[0.2em] uppercase">Saving Throws</h3>
                </div>
                <Ghost size={16} className="text-muted/20" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 relative z-10">
                {saves.map(({ key, label }) => {
                    const isProficient = savingThrowProficiencies.includes(key);
                    const abilityMod = abilityMods[key] || 0;
                    const total = abilityMod + (isProficient ? profBonus : 0);

                    return (
                        <div
                            key={key}
                            className={`p-4 rounded-xl border transition-all duration-500 tap-feedback flex flex-col items-center justify-center gap-1
                                ${isProficient
                                    ? 'bg-soul-green/10 border-soul-green/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {isProficient && <div className="w-1 h-1 rounded-full bg-soul-green animate-ping" />}
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isProficient ? 'text-soul-green' : 'text-muted'}`}>
                                    {label.slice(0, 3)}
                                </span>
                            </div>
                            <span className={`font-display text-2xl tabular-nums ${isProficient ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]' : 'text-phantom'}`}>
                                {total >= 0 ? '+' : ''}{total}
                            </span>
                            {isProficient && (
                                <span className="text-[8px] text-soul-green/60 font-bold tracking-tighter uppercase">Mastered</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                <Activity size={10} className="text-muted/40" />
                <p className="text-[9px] text-muted/50 uppercase tracking-[0.2em] font-black">
                    Shield of the Soul • Automatic Calculation
                </p>
            </div>
        </div>
    );
}

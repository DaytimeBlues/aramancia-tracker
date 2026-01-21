import { Dices, Ghost, Bone, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { HitDice } from '../../types';

interface HitDiceWidgetProps {
    hitDice: HitDice;
    conMod: number;
    currentHP: number;
    maxHP: number;
    onSpend: (healed: number, diceSpent: number) => void;
}

export function HitDiceWidget({ hitDice, conMod, currentHP, maxHP, onSpend }: HitDiceWidgetProps) {
    const [lastRoll, setLastRoll] = useState<{ roll: number; total: number } | null>(null);
    const canSpend = hitDice.current > 0 && currentHP < maxHP;

    const rollHitDie = () => {
        if (!canSpend) return;
        const roll = Math.floor(Math.random() * hitDice.size) + 1;
        const healing = Math.max(0, roll + conMod);
        const actualHealing = Math.min(healing, maxHP - currentHP);

        setLastRoll({ roll, total: healing });
        onSpend(actualHealing, 1);
        setTimeout(() => setLastRoll(null), 4000);
    };

    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-soul-green/10 rounded-xl border border-soul-green/20">
                        <Dices size={18} className="text-soul-green" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Hit Dice</h3>
                        <p className="text-[9px] text-muted tracking-widest font-bold uppercase">Restoration Reservoir</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-500
                    ${hitDice.current === 0
                        ? 'bg-hp-critical/10 border-hp-critical/40 text-hp-critical'
                        : 'bg-soul-green/10 border-soul-green/40 text-soul-green'}`}>
                    {hitDice.current} / {hitDice.max} d{hitDice.size}
                </div>
            </div>

            {/* Visual Hit Dice */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6 relative z-10">
                {Array.from({ length: hitDice.max }).map((_, i) => {
                    const isAvailable = i < hitDice.current;
                    const isNext = i === hitDice.current - 1;
                    return (
                        <div
                            key={i}
                            className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-[10px] font-black uppercase transition-all duration-500
                                ${isAvailable
                                    ? `bg-black/40 border-soul-green/30 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)] ${isNext ? 'animate-pulse border-soul-green' : ''}`
                                    : 'bg-transparent border-white/5 text-muted opacity-40'
                                }`}
                        >
                            d{hitDice.size}
                        </div>
                    );
                })}
            </div>

            {/* Roll Result */}
            <div className={`transition-all duration-700 overflow-hidden ${lastRoll ? 'max-h-24 mb-6 translate-y-0 opacity-100' : 'max-h-0 translate-y-4 opacity-0'}`}>
                {lastRoll && (
                    <div className="bg-soul-green/5 border border-soul-green/20 rounded-2xl p-4 relative overflow-hidden group/roll">
                        <div className="absolute inset-0 bg-gradient-to-r from-soul-green/10 via-transparent to-soul-green/10 animate-pulse" />
                        <div className="flex items-center justify-around relative z-10">
                            <div className="text-center">
                                <span className="text-[9px] text-muted font-black uppercase tracking-widest block">Force</span>
                                <span className="font-display text-2xl text-white">{lastRoll.roll}</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="text-center">
                                <span className="text-[9px] text-muted font-black uppercase tracking-widest block">Vitality</span>
                                <span className="font-display text-2xl text-soul-green">+{conMod}</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <div className="text-center">
                                <span className="text-[9px] text-soul-green font-black uppercase tracking-widest block">Restored</span>
                                <div className="flex items-center gap-2 justify-center">
                                    <Sparkles size={14} className="text-soul-green animate-bounce" />
                                    <span className="font-display text-3xl text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{lastRoll.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Spend Button */}
            <button
                onClick={rollHitDie}
                disabled={!canSpend}
                className={`w-full py-4 rounded-2xl border transition-all duration-500 flex items-center justify-center gap-3 group/btn tap-feedback relative z-10
                    ${!canSpend
                        ? 'bg-white/[0.02] border-white/5 text-muted cursor-not-allowed'
                        : 'bg-soul-green/10 border-soul-green/30 text-soul-green hover:bg-soul-green/20 hover:border-soul-green/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}
            >
                <Bone size={18} className={`transition-transform duration-500 ${canSpend ? 'group-hover/btn:rotate-12' : ''}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                    {currentHP >= maxHP ? 'Vitality Saturated' : hitDice.current === 0 ? 'Reserves Depleted' : 'Tap Life Reserve'}
                </span>
            </button>

            <div className="mt-4 flex items-center gap-2 justify-center opacity-40">
                <Ghost size={10} className="text-muted" />
                <p className="text-[9px] text-muted uppercase tracking-widest font-black">
                    d{hitDice.size} + {conMod} Resilience Affinity
                </p>
            </div>
        </div>
    );
}

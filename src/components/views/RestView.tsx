import { useState } from 'react';
import { Tent, Moon, Sun, Sparkles, ChevronRight, X, Heart } from 'lucide-react';
import { HitDiceWidget } from '../widgets/HitDiceWidget';
import type { HitDice } from '../../types';

interface RestViewProps {
    hitDice: HitDice;
    conMod: number;
    currentHP: number;
    maxHP: number;
    onSpendHitDie: (healed: number, diceSpent: number) => void;
    onLongRest: () => void;
}

export function RestView({ hitDice, conMod, currentHP, maxHP, onSpendHitDie, onLongRest }: RestViewProps) {
    const [showShortRest, setShowShortRest] = useState(false);

    if (showShortRest) {
        return (
            <div className="pb-24 animate-fade-in relative z-20">
                {/* Header - Glassmorphism Sticky */}
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-bg/60 backdrop-blur-xl p-3 -mx-2 rounded-2xl border border-white/10 shadow-2xl z-40">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-500/20 to-transparent rounded-lg border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                            <Sun size={20} className="text-amber-200" />
                        </div>
                        <div>
                            <h2 className="font-display text-xl text-parchment-light tracking-wider leading-none">Short Rest</h2>
                            <p className="text-[10px] text-muted font-sans uppercase tracking-widest mt-0.5">Recovery Phase</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowShortRest(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-muted hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* HP Status - Glass Card */}
                <div className="glass-card p-5 mb-8 shadow-2xl relative overflow-hidden group elevation-2 rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-2">
                            <Heart size={16} className="text-red-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted">Health Status</span>
                        </div>
                        <span className="font-display text-2xl text-white drop-shadow-md">
                            {currentHP} <span className="text-muted text-lg">/ {maxHP}</span>
                        </span>
                    </div>

                    <div className="relative h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 shadow-inner">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-800 via-red-600 to-red-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                            style={{ width: `${(currentHP / maxHP) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20" />
                            <div className="absolute top-0 right-0 h-full w-2 bg-white/30 blur-sm" />
                        </div>
                    </div>
                </div>

                {/* Hit Dice Widget */}
                <div className="relative z-10">
                    <HitDiceWidget
                        hitDice={hitDice}
                        conMod={conMod}
                        currentHP={currentHP}
                        maxHP={maxHP}
                        onSpend={onSpendHitDie}
                    />
                </div>

                <div className="mt-8 p-4 rounded-xl bg-gradient-to-b from-transparent to-black/20 text-center border-t border-white/5">
                    <p className="text-xs text-muted/70 italic">
                        "A moment of respite to bind wounds and clear the mind."
                    </p>
                    <p className="text-[10px] text-muted/40 uppercase tracking-widest mt-1">
                        Takes 1 Hour
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 flex flex-col items-center justify-center min-h-[75vh] animate-fade-in">
            <div className="text-center mb-16 relative">
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-[-20px] bg-accent/20 blur-[40px] rounded-full animate-pulse-glow" />
                    <div className="relative z-10 p-6 glass-card rounded-full border-accent/20 shadow-2xl">
                        <Tent size={72} className="text-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                    </div>
                    <Sparkles size={28} className="text-white absolute -top-1 -right-1 animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,1)]" />
                </div>
                <h2 className="font-display text-5xl text-parchment-light tracking-widest mb-4 drop-shadow-2xl">Rest & Recovery</h2>
                <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto mb-4" />
                <p className="text-base text-muted max-w-sm mx-auto leading-relaxed italic">
                    "The weary traveler finds strength in repose. Choose your respite wisely."
                </p>
            </div>

            <div className="w-full space-y-6 max-w-sm px-4">
                {/* Short Rest */}
                <button
                    onClick={() => setShowShortRest(true)}
                    className="w-full glass-card p-0 text-left group transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:-translate-y-2 border-white/10 hover:border-accent/50 tap-feedback elevation-2 rounded-3xl overflow-hidden"
                >
                    <div className="p-6 flex items-center gap-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-4 bg-gradient-to-br from-amber-900/40 to-amber-950/60 rounded-2xl border border-amber-500/30 group-hover:border-amber-400/50 group-hover:scale-110 transition-all shadow-2xl">
                            <Sun size={32} className="text-amber-200 group-hover:text-amber-50 animate-pulse-glow" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="font-display text-2xl text-parchment-light group-hover:text-white transition-colors tracking-widest mb-1.5 uppercase">
                                Short Rest
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-amber-200/60 font-medium tracking-wide">
                                <span className="text-amber-300 font-bold">{hitDice.current}/{hitDice.max}</span> Dice Available
                            </div>
                        </div>
                        <ChevronRight size={24} className="text-muted/30 group-hover:text-amber-300 group-hover:translate-x-2 transition-all" />
                    </div>
                </button>

                {/* Long Rest */}
                <button
                    onClick={() => {
                        if (confirm("Take a Long Rest? This will reset HP, Spell Slots, and recover Hit Dice.")) {
                            onLongRest();
                        }
                    }}
                    className="w-full glass-card p-0 text-left group transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:-translate-y-2 border-white/10 hover:border-purple-500/50 tap-feedback elevation-2 rounded-3xl overflow-hidden"
                >
                    <div className="p-6 flex items-center gap-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-4 bg-gradient-to-br from-purple-900/40 to-purple-950/60 rounded-2xl border border-purple-500/30 group-hover:border-purple-400/50 group-hover:scale-110 transition-all shadow-2xl">
                            <Moon size={32} className="text-purple-200 group-hover:text-purple-50" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="font-display text-2xl text-parchment-light group-hover:text-white transition-colors tracking-widest mb-1.5 uppercase">
                                Long Rest
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-purple-200/60 font-medium tracking-wide">
                                Full Restoration
                            </div>
                        </div>
                        <ChevronRight size={24} className="text-muted/30 group-hover:text-purple-300 group-hover:translate-x-2 transition-all" />
                    </div>
                </button>
            </div>
        </div>
    );
}

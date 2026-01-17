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
            <div className="pb-20 animate-fade-in relative z-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-bg-dark/80 backdrop-blur-md p-2 -mx-2 rounded-xl border border-white/5 z-30">
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

                {/* HP Status */}
                <div className="card-parchment p-4 mb-6 shadow-xl relative overflow-hidden group">
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
        <div className="pb-20 flex flex-col items-center justify-center h-full min-h-[70vh] animate-fade-in">
            <div className="text-center mb-12 relative">
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    <Tent size={64} className="text-parchment relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                    <Sparkles size={24} className="text-white absolute -top-2 -right-2 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
                <h2 className="font-display text-4xl text-parchment-light tracking-wide mb-3 drop-shadow-lg">Rest & Recovery</h2>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-3" />
                <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
                    The weary traveler finds strength in repose. Choose your respite wisely.
                </p>
            </div>

            <div className="w-full space-y-5 max-w-sm">
                {/* Short Rest */}
                <button
                    onClick={() => setShowShortRest(true)}
                    className="w-full card-parchment p-0 text-left group transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,177,58,0.15)] hover:-translate-y-1 border-white/10 hover:border-accent/30 tap-feedback"
                >
                    <div className="p-5 flex items-center gap-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 group-hover:border-amber-500/30 group-hover:bg-amber-900/20 transition-all shadow-inner">
                            <Sun size={28} className="text-parchment group-hover:text-amber-200 transition-colors" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="font-display text-xl text-parchment-light group-hover:text-amber-100 transition-colors tracking-wide mb-1">
                                Short Rest
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted group-hover:text-amber-200/60 transition-colors">
                                <span className="font-bold">{hitDice.current}/{hitDice.max}</span> Hit Dice Available
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-muted/50 group-hover:text-amber-200 group-hover:translate-x-1 transition-all" />
                    </div>
                </button>

                {/* Long Rest */}
                <button
                    onClick={() => {
                        if (confirm("Take a Long Rest? This will reset HP, Spell Slots, and recover Hit Dice.")) {
                            onLongRest();
                        }
                    }}
                    className="w-full card-parchment p-0 text-left group transition-all duration-300 hover:shadow-[0_0_25px_rgba(147,51,234,0.15)] hover:-translate-y-1 border-white/10 hover:border-purple-500/30 tap-feedback"
                >
                    <div className="p-5 flex items-center gap-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 group-hover:border-purple-500/30 group-hover:bg-purple-900/20 transition-all shadow-inner">
                            <Moon size={28} className="text-parchment group-hover:text-purple-200 transition-colors" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <h3 className="font-display text-xl text-parchment-light group-hover:text-purple-100 transition-colors tracking-wide mb-1">
                                Long Rest
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted group-hover:text-purple-200/60 transition-colors">
                                Restore HP & Spell Slots
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-muted/50 group-hover:text-purple-200 group-hover:translate-x-1 transition-all" />
                    </div>
                </button>
            </div>
        </div>
    );
}

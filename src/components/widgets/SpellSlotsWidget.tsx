import { Wand2, RotateCcw } from 'lucide-react';

interface SpellSlotsWidgetProps {
    slots: { [level: number]: { used: number; max: number } };
    onChange: (level: number, used: number) => void;
    spellSaveDC?: number;
}

export function SpellSlotsWidget({ slots, onChange, spellSaveDC = 14 }: SpellSlotsWidgetProps) {
    return (
        <div className="card-parchment p-5 mb-4 relative overflow-visible">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
                        <Wand2 size={18} className="text-secondary" />
                    </div>
                    <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Spellcasting</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Save DC</span>
                    <span className="text-white font-display text-xl leading-none">{spellSaveDC}</span>
                </div>
            </div>

            <div className="space-y-5">
                {Object.entries(slots).map(([levelStr, { used, max }]) => {
                    const level = Number(levelStr);

                    return (
                        <div key={level} className="relative group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-display text-lg text-parchment-light">{level === 0 ? 'Cantrips' : `Level ${level}`}</span>
                                    <span className="text-xs text-muted"> slots</span>
                                </div>
                                <div className="text-xs text-muted flex items-center gap-1">
                                    <span className={used < max ? "text-accent" : "text-muted"}>{max - used}</span>
                                    <span className="opacity-40">/</span>
                                    <span>{max}</span>
                                </div>
                            </div>

                            {/* Orb Container - Fitts's Law: spacing for easy tapping */}
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-wrap gap-5 items-center justify-center relative backdrop-blur-md shadow-inner">
                                {Array.from({ length: max }).map((_, i) => {
                                    const isAvailable = i >= used;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                const newUsed = i < used ? i : i + 1;
                                                onChange(level, newUsed);
                                            }}
                                            className={`
                                                relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform tap-feedback
                                                ${isAvailable
                                                    ? 'scale-100 shadow-[0_0_20px_rgba(212,177,58,0.3)] hover:shadow-[0_0_25px_rgba(212,177,58,0.5)] hover:scale-110 cursor-pointer'
                                                    : 'scale-90 opacity-20 hover:opacity-100 hover:scale-100 cursor-alias'
                                                }
                                            `}
                                            title={isAvailable ? 'Cast Spell' : 'Restore Slot'}
                                        >
                                            {/* Inner Orb Gradient */}
                                            <div className={`
                                                absolute inset-0 rounded-full transition-all duration-700
                                                ${isAvailable
                                                    ? 'bg-gradient-to-br from-[#e5c158] via-[#d4af37] to-[#b38f2a] opacity-100'
                                                    : 'bg-stone-950 border border-white/10 opacity-50'
                                                }
                                            `}></div>

                                            {/* Ornate Frame for active orbs */}
                                            {isAvailable && (
                                                <div className="absolute inset-[-2px] border border-accent/20 rounded-full animate-spin-slow pointer-events-none"></div>
                                            )}

                                            {/* Shine Effect */}
                                            {isAvailable && <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-white/50 blur-[1px] rounded-full"></div>}

                                            {/* Core Glow when active */}
                                            {isAvailable && (
                                                <div className="absolute inset-0 rounded-full animate-pulse-glow opacity-40"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Quick Restore Button (visible if any used) */}
                            {used > 0 && (
                                <button
                                    onClick={() => onChange(level, 0)}
                                    className="absolute -right-2 -top-2 p-1.5 rounded-full bg-card-elevated border border-white/10 text-muted hover:text-green-400 hover:border-green-500/50 shadow-lg transition-all active:scale-90 animate-scale-in z-10"
                                    title="Restore All"
                                >
                                    <RotateCcw size={12} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

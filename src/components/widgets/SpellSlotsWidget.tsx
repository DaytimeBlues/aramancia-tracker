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

                            {/* Orb Container */}
                            <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex flex-wrap gap-3 items-center justify-center relative backdrop-blur-sm">
                                {Array.from({ length: max }).map((_, i) => {
                                    const isAvailable = i >= used;
                                    // Reverse index for clicking behavior (click rightmost available to use it)
                                    // Actually, let's keep simple index logic: click specific orb toggles state up to that point?
                                    // Standard: click 1st orb -> 1 used. Click 3rd orb -> 3 used.
                                    // Proposed: Click an AVAILABLE orb to consume it (turn it off). Click an USED orb to restore it?
                                    // Current logic: `const newUsed = i < used ? i : i + 1;` 
                                    // If i < used (clicking a used slot), it restores up to i (making i the first used index? No, `newUsed = i` means slots 0..i-1 are used? No. `used` is count of used slots.
                                    // If used=2 (slots 0,1 are used/empty), slots 2,3,4 are avail.
                                    // Click slot 0 (used): i=0 < used=2. newUsed=0. USED becomes 0. RESTORED ALL?
                                    // Click slot 1 (used): i=1 < used=2. newUsed=1. USED becomes 1. One slot used.
                                    // Click slot 2 (avail): i=2 >= used=2. newUsed=3. USED becomes 3. Slot 2 is now used.

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                const newUsed = i < used ? i : i + 1;
                                                onChange(level, newUsed);
                                            }}
                                            className={`
                                                relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform
                                                ${isAvailable
                                                    ? 'scale-100 shadow-[0_0_15px_rgba(212,177,58,0.4)] hover:shadow-[0_0_20px_rgba(212,177,58,0.6)] hover:scale-110 cursor-pointer'
                                                    : 'scale-90 opacity-40 hover:opacity-100 hover:scale-100 cursor-alias'
                                                }
                                                active:scale-95 tap-feedback
                                            `}
                                            title={isAvailable ? 'Cast Spell' : 'Restore Slot'}
                                        >
                                            {/* Inner Orb Gradient */}
                                            <div className={`
                                                absolute inset-0 rounded-full transition-all duration-500
                                                ${isAvailable
                                                    ? 'bg-gradient-to-br from-accent-glow via-accent to-accent-dark opacity-100'
                                                    : 'bg-stone-800 border border-white/10 opacity-50'
                                                }
                                            `}></div>

                                            {/* Shine Effect */}
                                            {isAvailable && <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 blur-[1px] rounded-full"></div>}

                                            {/* Particle/Glow when active */}
                                            {isAvailable && (
                                                <div className="absolute inset-0 rounded-full animate-pulse-glow opacity-50"></div>
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

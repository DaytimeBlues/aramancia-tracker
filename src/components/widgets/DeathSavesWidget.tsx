import { Heart, Skull, Activity, Ghost } from 'lucide-react';

interface DeathSavesWidgetProps {
    successes: number;
    failures: number;
    onChange: (type: 'successes' | 'failures', value: number) => void;
}

export function DeathSavesWidget({ successes, failures, onChange }: DeathSavesWidgetProps) {
    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-hp-critical/10 rounded-xl border border-hp-critical/20">
                        <Activity size={18} className="text-hp-critical animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Mortal Brink</h3>
                        <p className="text-[9px] text-muted tracking-widest font-bold uppercase">Death Saving Throws</p>
                    </div>
                </div>
                <Ghost size={16} className="text-muted/20" />
            </div>

            <div className="flex justify-between items-center gap-8 relative z-10">
                {/* Successes - Soul Connection */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Heart size={14} className="text-soul-green" />
                        <span className="text-[10px] text-soul-green font-black uppercase tracking-widest">Defiance</span>
                    </div>
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <button
                                key={i}
                                onClick={() => onChange('successes', i === successes ? i - 1 : i)}
                                className={`w-10 h-10 rounded-xl border-2 transition-all duration-500 tap-feedback flex items-center justify-center
                                    ${i <= successes
                                        ? 'bg-soul-green/20 border-soul-green shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110'
                                        : 'bg-white/[0.02] border-white/10 hover:border-soul-green/40 hover:bg-soul-green/5'
                                    }`}
                            >
                                {i <= successes && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spectral Boundary */}
                <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* Failures - Abyss Pull */}
                <div className="flex-1 space-y-4 text-right">
                    <div className="flex items-center gap-2 px-1 justify-end">
                        <span className="text-[10px] text-hp-critical font-black uppercase tracking-widest">Surrender</span>
                        <Skull size={14} className="text-hp-critical" />
                    </div>
                    <div className="flex gap-4 justify-end">
                        {[1, 2, 3].map((i) => (
                            <button
                                key={i}
                                onClick={() => onChange('failures', i === failures ? i - 1 : i)}
                                className={`w-10 h-10 rounded-xl border-2 transition-all duration-500 tap-feedback flex items-center justify-center
                                    ${i <= failures
                                        ? 'bg-hp-critical/20 border-hp-critical shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-110'
                                        : 'bg-white/[0.02] border-white/10 hover:border-hp-critical/40 hover:bg-hp-critical/5'
                                    }`}
                            >
                                {i <= failures && <Skull size={14} className="text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-center">
                <p className="text-[9px] text-muted italic uppercase tracking-widest font-black opacity-40">
                    The Ferryman waits for three.
                </p>
            </div>
        </div>
    );
}

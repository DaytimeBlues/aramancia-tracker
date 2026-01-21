import { Award, Ghost } from 'lucide-react';

interface ProficiencyWidgetProps {
    profBonus: number;
    level: number;
}

export function ProficiencyWidget({ profBonus, level }: ProficiencyWidgetProps) {
    return (
        <div className="glass-card p-6 border-white/5 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/10 blur-3xl rounded-full" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                    <Award size={18} className="text-accent" />
                </div>
                <div>
                    <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Proficiency</h3>
                    <p className="text-[9px] text-muted tracking-widest font-bold uppercase">Ascension Tier</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-6 relative z-10">
                {/* Circular Display */}
                <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
                    <div className="w-20 h-20 rounded-full border-2 border-accent/30 flex items-center justify-center bg-black/40 backdrop-blur-md relative z-10 shadow-2xl">
                        <div className="text-center">
                            <span className="font-display text-3xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                                +{profBonus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Level Info */}
                <div className="flex-1 text-right">
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 mb-2">
                        <Ghost size={10} className="text-muted" />
                        <span className="text-[10px] text-phantom font-black uppercase tracking-widest">Wiz Lvl {level}</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted leading-relaxed italic">
                            The weave bends to your shadow.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

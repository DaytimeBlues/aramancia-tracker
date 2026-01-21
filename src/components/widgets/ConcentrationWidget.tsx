import { X, Brain, Sparkles, Activity, Ghost } from 'lucide-react';

interface ConcentrationWidgetProps {
    spell: string | null;
    suggestions?: string[];
    onClear: () => void;
    onSet: (spell: string) => void;
}

const CONCENTRATION_SPELLS = [
    'Bless', 'Hex', 'Hunter\'s Mark', 'Haste', 'Fly',
    'Invisibility', 'Hold Person', 'Animate Dead', 'Spirit Guardians'
];

export function ConcentrationWidget({ spell, suggestions = CONCENTRATION_SPELLS, onClear, onSet }: ConcentrationWidgetProps) {
    return (
        <div className={`glass-card p-0 rounded-2xl overflow-hidden transition-all duration-700 elevation-2 border-white/5 shadow-2xl
            ${spell ? 'border-accent/40 shadow-[0_0_40px_rgba(139,92,246,0.15)] translate-y-[-2px]' : ''}`}>

            {/* Header */}
            <div className={`p-4 border-b border-white/5 flex items-center justify-between transition-colors ${spell ? 'bg-accent/10' : 'bg-black/20'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border transition-colors ${spell ? 'bg-accent/20 border-accent/40 shadow-lg' : 'bg-white/5 border-white/10'}`}>
                        <Brain size={16} className={spell ? 'text-accent-glow' : 'text-muted'} />
                    </div>
                    <div>
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${spell ? 'text-white' : 'text-muted'}`}>Neural Concentration</h3>
                        <p className={`text-[8px] font-bold uppercase tracking-widest ${spell ? 'text-accent-glow' : 'text-muted/40'}`}>
                            {spell ? 'Connection Established' : 'Void State'}
                        </p>
                    </div>
                </div>
                {spell && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-glow shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                        <span className="text-[9px] text-accent-glow font-black uppercase tracking-widest">Active Link</span>
                    </div>
                )}
            </div>

            <div className="p-6">
                {spell ? (
                    <div className="animate-fade-in space-y-5">
                        <div className="bg-gradient-to-r from-accent/20 to-transparent border border-accent/30 rounded-2xl p-5 flex items-center justify-between shadow-xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center border border-accent/40 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                    <Sparkles size={20} className="text-accent-glow animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-xl font-display text-white tracking-wider uppercase leading-none mb-1">{spell}</div>
                                    <div className="text-[9px] text-accent font-black tracking-[0.2em] uppercase opacity-80">Maintaining Weave</div>
                                </div>
                            </div>
                            <button
                                onClick={onClear}
                                className="p-3 bg-black/40 hover:bg-hp-critical/20 border border-white/10 hover:border-hp-critical/40 rounded-xl text-muted hover:text-hp-critical transition-all active:scale-90 relative z-10"
                                aria-label="End Concentration"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-3 py-2 px-4 bg-hp-critical/10 border border-hp-critical/20 rounded-xl max-w-fit mx-auto shadow-inner">
                            <Activity size={12} className="text-hp-critical animate-pulse" />
                            <span className="text-[9px] text-hp-critical font-black uppercase tracking-[0.1em]">Save DC: 10 or half damage</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5 text-center">
                        <div className="opacity-20 py-4">
                            <Ghost size={32} className="mx-auto text-muted mb-2" />
                            <p className="text-[10px] text-muted uppercase tracking-[0.3em] font-black">Memory Reserves Idle</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {suggestions.slice(0, 8).map(s => (
                                <button
                                    key={s}
                                    onClick={() => onSet(s)}
                                    className="text-[9px] px-3.5 py-2 bg-black/40 border border-white/5 rounded-xl text-phantom font-black uppercase tracking-widest hover:text-white hover:border-accent/40 hover:bg-accent/10 transition-all active:scale-95 tap-feedback shadow-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

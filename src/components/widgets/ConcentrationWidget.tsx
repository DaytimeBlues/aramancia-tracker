import { X, Brain, Sparkles } from 'lucide-react';

interface ConcentrationWidgetProps {
    spell: string | null;
    suggestions?: string[];
    onClear: () => void;
    onSet: (spell: string) => void;
}

// Common concentration spells for quick selection
const CONCENTRATION_SPELLS = [
    'Bless', 'Hex', 'Hunter\'s Mark', 'Haste', 'Fly',
    'Invisibility', 'Hold Person', 'Animate Dead', 'Spirit Guardians'
];

export function ConcentrationWidget({ spell, suggestions = CONCENTRATION_SPELLS, onClear, onSet }: ConcentrationWidgetProps) {
    return (
        <div className={`glass-card p-0 rounded-2xl overflow-hidden transition-all duration-700 elevation-2 ${spell ? 'shadow-[0_0_30px_rgba(168,85,247,0.2)] border-purple-500/40 translate-y-[-2px]' : ''}`}>
            {/* Header */}
            <div className={`p-3 border-b border-white/5 flex items-center justify-between transition-colors ${spell ? 'bg-purple-900/20' : 'bg-black/20'}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded border transition-colors ${spell ? 'bg-purple-500/20 border-purple-400/30' : 'bg-white/5 border-white/10'}`}>
                        <Brain size={14} className={spell ? 'text-purple-300' : 'text-muted'} />
                    </div>
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${spell ? 'text-purple-200' : 'text-muted'}`}>Concentration</h3>
                </div>
                {spell && (
                    <div className="flex items-center gap-1 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span className="text-[10px] text-purple-300 font-bold uppercase">Active</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                {spell ? (
                    <div className="animate-fade-in py-2">
                        <div className="bg-gradient-to-r from-purple-950/60 to-purple-900/20 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between mb-3 shadow-lg relative group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <Sparkles size={18} className="text-purple-300 animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-base font-display text-white tracking-wide uppercase">{spell}</div>
                                    <div className="text-[10px] text-purple-300 font-bold tracking-widest uppercase opacity-80">Concentrating</div>
                                </div>
                            </div>
                            <button
                                onClick={onClear}
                                className="p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-full text-white/40 hover:text-red-400 transition-all active:scale-90 relative z-10"
                                aria-label="End Concentration"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-2 py-1 px-3 bg-red-950/20 border border-red-500/20 rounded-lg max-w-fit mx-auto">
                            <Brain size={12} className="text-red-400" />
                            <span className="text-[10px] text-red-300 font-bold uppercase tracking-tighter">CON Save DC: 10 or half damage</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-muted/70 text-center">Select a spell to track concentration</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {suggestions.slice(0, 6).map(s => (
                                <button
                                    key={s}
                                    onClick={() => onSet(s)}
                                    className="text-[10px] px-2.5 py-1.5 bg-black/20 border border-white/10 rounded-full text-muted hover:text-white hover:border-white/30 hover:bg-white/5 transition-all active:scale-95 tap-feedback"
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

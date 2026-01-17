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
        <div className={`card-parchment p-0 overflow-hidden transition-all duration-500 ${spell ? 'shadow-[0_0_20px_rgba(200,100,255,0.15)] border-purple-500/30' : ''}`}>
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
                    <div className="animate-fade-in">
                        <div className="bg-gradient-to-r from-purple-900/40 to-transparent border border-purple-500/30 rounded-lg p-3 flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                    <Sparkles size={14} className="text-purple-300 animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-sm font-display text-white">{spell}</div>
                                    <div className="text-[10px] text-purple-300/70">Check CON on damage</div>
                                </div>
                            </div>
                            <button
                                onClick={onClear}
                                className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
                                aria-label="End Concentration"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className="text-[10px] text-muted text-center italic opacity-60">
                            "Focus is the essence of power."
                        </p>
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

import { Gem, Plus, X, Ghost, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface AttunementWidgetProps {
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
}

const MAX_ATTUNEMENT = 3;

const COMMON_ITEMS = [
    'Cloak of Protection',
    'Ring of Protection',
    'Amulet of Health',
    'Gauntlets of Ogre Power',
    'Headband of Intellect',
    'Belt of Giant Strength'
];

export function AttunementWidget({ items, onAdd, onRemove }: AttunementWidgetProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const slotsUsed = items.length;
    const canAdd = slotsUsed < MAX_ATTUNEMENT;

    const handleAdd = (item: string) => {
        if (canAdd && item.trim()) {
            onAdd(item.trim());
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-xl border border-accent/30">
                        <Gem size={18} className="text-accent-glow" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Attunement</h3>
                        <p className="text-[9px] text-muted tracking-widest font-bold uppercase">Soul Harmonization</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-500
                    ${slotsUsed >= MAX_ATTUNEMENT
                        ? 'bg-hp-critical/10 border-hp-critical/40 text-hp-critical'
                        : 'bg-white/5 border-white/10 text-phantom'}`}>
                    {slotsUsed} / {MAX_ATTUNEMENT}
                </div>
            </div>

            {/* Attuned Items */}
            <div className="space-y-3 mb-6 relative z-10">
                {items.length === 0 ? (
                    <div className="text-center py-6 opacity-20 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Void of Attunement</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl p-4 group/item hover:bg-white/[0.06] hover:border-accent/20 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles size={14} className="text-accent animate-pulse" />
                                <span className="text-sm font-display text-white tracking-wide">{item}</span>
                            </div>
                            <button
                                onClick={() => onRemove(index)}
                                className="p-1.5 rounded-lg text-muted hover:text-hp-critical hover:bg-hp-critical/10 transition-all opacity-0 group-hover/item:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Item */}
            {canAdd && (
                <div className="border-t border-white/5 pt-5 relative z-10">
                    <div className="flex gap-3">
                        <div className="relative flex-1 group">
                            <Plus size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Bind magic item..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all"
                            />
                        </div>
                    </div>

                    {/* Quick Suggestions */}
                    {showSuggestions && (
                        <div className="flex flex-wrap gap-2 mt-4 animate-slide-up">
                            {COMMON_ITEMS.filter(i => !items.includes(i)).slice(0, 4).map(item => (
                                <button
                                    key={item}
                                    onClick={() => handleAdd(item)}
                                    className="text-[9px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-phantom font-black uppercase tracking-widest hover:text-white hover:border-accent/40 hover:bg-accent/10 transition-all"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!canAdd && (
                <div className="flex items-center gap-2 justify-center py-4 bg-hp-critical/5 rounded-2xl border border-hp-critical/10 text-hp-critical animate-pulse">
                    <Ghost size={12} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Soul Capacity Reached</span>
                </div>
            )}
        </div>
    );
}

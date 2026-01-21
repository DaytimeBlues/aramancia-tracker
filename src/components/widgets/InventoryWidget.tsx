import { Backpack, Plus, X, Wand2, Package } from 'lucide-react';
import { useState } from 'react';
import type { InventoryItem } from '../../types';

interface InventoryWidgetProps {
    items: InventoryItem[];
    onAdd: (item: InventoryItem) => void;
    onRemove: (index: number) => void;
    onCastSpell?: (spellName: string) => void;
}

function parseInventoryInput(input: string): InventoryItem {
    const trimmed = input.trim();
    const wandPrefixMatch = trimmed.match(/^wand\s*:\s*(.+)$/i);
    if (wandPrefixMatch) {
        const spells = wandPrefixMatch[1]
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        return {
            name: `Wand (${spells.join(', ')})`,
            spells: spells.length > 0 ? spells.map(s => ({ name: s, cost: 1 })) : undefined
        };
    }

    const wandOfMatch = trimmed.match(/^wand of\s+(.+)$/i);
    if (wandOfMatch) {
        const spellName = wandOfMatch[1].trim();
        return {
            name: trimmed,
            spells: spellName ? [{ name: spellName, cost: 1 }] : undefined
        };
    }

    return { name: trimmed };
}

export function InventoryWidget({ items, onAdd, onRemove, onCastSpell }: InventoryWidgetProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = (raw: string) => {
        if (raw.trim()) {
            onAdd(parseInventoryInput(raw));
            setInputValue('');
        }
    };

    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-xl border border-accent/30">
                        <Backpack size={18} className="text-accent-glow" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Inventory</h3>
                        <p className="text-[9px] text-muted tracking-widest font-bold uppercase">Relics & Curios</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    <span className="text-[10px] text-phantom font-black uppercase tracking-widest">{items.length} Slot{items.length !== 1 ? 's' : ''} filled</span>
                </div>
            </div>

            {/* Inventory Items - Scrollable */}
            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {items.length === 0 ? (
                    <div className="text-center py-10 space-y-3 opacity-30">
                        <Package size={32} className="mx-auto text-muted" />
                        <p className="text-xs text-muted uppercase tracking-widest font-bold">Backpack is Empty</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 group/item hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent transition-colors" />
                                    <span className="text-sm font-display text-phantom group-hover/item:text-white transition-colors tracking-wide">{item.name}</span>
                                </div>
                                <button
                                    onClick={() => onRemove(index)}
                                    className="p-1.5 rounded-lg text-muted hover:text-hp-critical hover:bg-hp-critical/10 transition-all opacity-0 group-hover/item:opacity-100"
                                    aria-label="Remove item"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {item.spells && item.spells.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                                    {item.spells.map((spell) => (
                                        <button
                                            key={spell.name}
                                            onClick={() => onCastSpell?.(spell.name)}
                                            className="px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent-glow hover:bg-accent/20 hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                                            title={`Cast ${spell.name} (${spell.cost} charge${spell.cost > 1 ? 's' : ''})`}
                                        >
                                            <Wand2 size={12} className="animate-pulse" />
                                            Activate {spell.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add New Item */}
            <div className="relative z-10">
                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <Plus size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAdd(inputValue);
                            }}
                            placeholder="Register new relic..."
                            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-muted/50 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all"
                        />
                    </div>
                </div>
                <p className="text-[9px] text-muted/30 uppercase tracking-[0.2em] font-black mt-3 text-center">
                    Type "Wand: Spell" for magic item binding
                </p>
            </div>
        </div>
    );
}

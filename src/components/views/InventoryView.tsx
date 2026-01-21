import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { inventoryItemAdded, inventoryItemRemoved, itemChargeConsumed } from '../../store/slices/characterSlice';
import { InventoryItem } from '../../types';
import { Backpack, Trash2, Plus, Zap, Ghost, Skull, Package, PlusCircle, Wand2, Activity } from 'lucide-react';

export const InventoryView: React.FC = () => {
    const dispatch = useAppDispatch();
    const inventory = useAppSelector(state => state.character.inventory);
    const [isAdding, setIsAdding] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemMaxCharges, setNewItemMaxCharges] = useState<number | ''>('');

    const handleAddItem = () => {
        if (!newItemName.trim()) return;

        const item: InventoryItem = {
            name: newItemName,
            description: newItemDesc,
            spells: [],
        };

        if (newItemMaxCharges && typeof newItemMaxCharges === 'number') {
            item.charges = { current: newItemMaxCharges, max: newItemMaxCharges };
        }

        dispatch(inventoryItemAdded(item));
        setIsAdding(false);
        setNewItemName('');
        setNewItemDesc('');
        setNewItemMaxCharges('');
    };

    const handleUseCharge = (index: number) => {
        dispatch(itemChargeConsumed({ index }));
    };

    const handleDelete = (index: number) => {
        if (window.confirm('Dissolve this item back into the ether?')) {
            dispatch(inventoryItemRemoved(index));
        }
    };

    return (
        <div className="pb-24 space-y-10 animate-fade-in relative z-10 px-1">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8 group">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="absolute inset-[-15px] bg-accent/20 blur-2xl rounded-full group-hover:bg-accent/30 transition-all duration-700" />
                        <div className="p-4 glass-card rounded-2xl border-accent/40 shadow-2xl relative z-10 elevation-2">
                            <Backpack className="text-accent-glow" size={28} />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-display text-4xl text-white tracking-widest leading-none">Vault</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-px w-8 bg-accent/40" />
                            <p className="text-[10px] text-accent font-black uppercase tracking-[0.3em] font-sans">Arcane Belongings</p>
                        </div>
                    </div>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-3 px-5 py-3 bg-accent/20 hover:bg-accent/30 rounded-2xl border border-accent/30 text-white transition-all hover:scale-105 active:scale-95 shadow-lg group/btn"
                    >
                        <PlusCircle size={20} className="text-accent-glow" />
                        <span className="text-xs font-black uppercase tracking-widest font-sans">Forge Item</span>
                    </button>
                )}
            </div>

            {/* Add Item Modal-like Section */}
            {isAdding && (
                <div className="glass-card border-accent/30 p-8 rounded-3xl animate-slide-up elevation-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Wand2 size={80} className="text-white" />
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-2 bg-accent/20 rounded-xl border border-accent/30">
                            <Plus size={20} className="text-accent" />
                        </div>
                        <h3 className="font-display text-xl text-white tracking-widest uppercase">item manifest</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1 opacity-60">Designation</label>
                            <input
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-phantom/30 focus:border-accent/50 focus:bg-black/60 focus:outline-none transition-all font-display text-lg tracking-wider"
                                placeholder="Ancient Soul Jar..."
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1 opacity-60">Imprint (Description)</label>
                            <textarea
                                value={newItemDesc}
                                onChange={e => setNewItemDesc(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-phantom placeholder-phantom/30 focus:border-accent/50 focus:bg-black/60 focus:outline-none transition-all min-h-[100px] resize-none"
                                placeholder="A crystal containining the whispers of..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1 opacity-60">Spectral Charges (Optional)</label>
                            <input
                                type="number"
                                value={newItemMaxCharges}
                                onChange={e => setNewItemMaxCharges(parseInt(e.target.value) || '')}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-accent/50 focus:bg-black/60 focus:outline-none transition-all font-display text-lg tracking-wider"
                                placeholder="7"
                            />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-3 text-[10px] font-black text-phantom hover:text-white uppercase tracking-widest transition-colors"
                            >
                                Abandon
                            </button>
                            <button
                                onClick={handleAddItem}
                                disabled={!newItemName.trim()}
                                className="px-8 py-3 bg-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                            >
                                Forge Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory List */}
            <div className="grid gap-6">
                {inventory.length === 0 && !isAdding && (
                    <div className="glass-card py-20 border-white/5 rounded-[2rem] flex flex-col items-center justify-center opacity-40">
                        <Ghost size={64} className="text-phantom mb-6 animate-soul-drift" />
                        <p className="text-xl font-display text-phantom tracking-[0.2em] uppercase">The vault remains silent</p>
                        <p className="text-[10px] text-phantom/60 font-black uppercase tracking-widest mt-2">No items imprinted yet</p>
                    </div>
                )}

                {inventory.map((item, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-[2rem] flex items-center justify-between border-white/5 hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-500 group relative overflow-hidden elevation-1 hover:elevation-2 stagger-item">
                        <div className="flex-1 flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-all duration-500 group-hover:scale-110">
                                {item.charges ? (
                                    <Activity size={24} className="text-soul-green/40 group-hover:text-soul-green animate-pulse" />
                                ) : (
                                    <Package size={24} className="text-phantom/30 group-hover:text-accent transition-colors" />
                                )}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-4">
                                    <h3 className="font-display text-xl text-white tracking-widest uppercase group-hover:text-white transition-colors">
                                        {item.name}
                                    </h3>
                                    {item.charges && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-soul-green/10 rounded-xl border border-soul-green/30 shadow-lg">
                                            <span className="text-[11px] font-display text-soul-green tracking-widest tabular-nums">
                                                {item.charges.current} <span className="opacity-40">/</span> {item.charges.max}
                                            </span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-soul-green shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                {item.description && (
                                    <p className="text-sm text-phantom font-medium leading-relaxed max-w-lg opacity-80 group-hover:opacity-100 transition-opacity italic">
                                        "{item.description}"
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 relative z-20">
                            {item.charges && item.charges.current > 0 && (
                                <button
                                    onClick={() => handleUseCharge(idx)}
                                    title="Expend Essence"
                                    className="p-4 bg-soul-green/10 hover:bg-soul-green/20 border border-soul-green/30 rounded-2xl text-soul-green transition-all hover:scale-110 active:scale-90 shadow-xl"
                                >
                                    <Zap size={20} />
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(idx)}
                                title="Dissolve"
                                className="p-4 bg-hp-critical/10 hover:bg-hp-critical/20 border border-hp-critical/30 rounded-2xl text-hp-critical/60 hover:text-hp-critical transition-all hover:scale-110 active:scale-90 shadow-xl"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        {/* Thematic Background Accent */}
                        <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none">
                            <Skull size={150} className="text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

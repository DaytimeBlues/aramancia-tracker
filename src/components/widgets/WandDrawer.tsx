import { X, Zap, ChevronRight, Wand2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    itemChargeConsumed,
    concentrationSet,
    selectCharacter
} from '../../store/slices/characterSlice';
import { spells as allSpells } from '../../data/spells';

interface WandDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WandDrawer({ isOpen, onClose }: WandDrawerProps) {
    const dispatch = useAppDispatch();
    const character = useAppSelector(selectCharacter);

    // Find Inventory Item with charges (Assume first wand-like item or item named "Wand")
    // Or check inventory for any item with charges.
    // For now, look for "Wand" specifically as per user request context
    const wandItemIndex = character.inventory.findIndex(i =>
        i.name.toLowerCase().includes('wand') || (i.charges && i.charges.max > 0)
    );
    const wand = character.inventory[wandItemIndex];

    const handleCast = (spellName: string) => {
        if (!wand || !wand.charges || wand.charges.current <= 0) return;

        // Consume Charge
        dispatch(itemChargeConsumed(wandItemIndex));

        // Check if spell requires concentration
        const spellData = allSpells.find(s => s.name === spellName);
        if (spellData?.concentration) {
            dispatch(concentrationSet(`${spellName} (Wand)`));
        }
    };

    if (!wand) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-card border-t border-white/20 rounded-t-3xl z-50 transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    } h-[60vh] flex flex-col shadow-2xl shadow-white/5`}
            >
                {/* Header */}
                <div className="p-5 border-b border-white/10 shrink-0">
                    <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Wand2 size={24} className="text-purple-400" />
                            <div>
                                <h2 className="font-display text-lg text-parchment-light tracking-wider">{wand.name}</h2>
                                <p className="text-xs text-muted">{wand.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
                        >
                            <X size={20} className="text-white/60" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-8">

                    {/* Charges Status */}
                    <div className="flex items-center justify-center py-6 bg-purple-900/10 border border-purple-500/20 rounded-2xl">
                        <div className="text-center">
                            <div className="text-4xl font-display text-purple-200 mb-1">
                                {wand.charges?.current} <span className="text-lg text-white/30">/ {wand.charges?.max}</span>
                            </div>
                            <div className="text-xs text-purple-300 uppercase tracking-widest">Charges Remaining</div>
                        </div>
                    </div>

                    {/* Spells List */}
                    <div className="space-y-3">
                        <h3 className="font-display text-sm text-muted uppercase tracking-wider mb-2">Imbued Spells</h3>
                        {wand.spells?.map((spellName) => {
                            const spellData = allSpells.find(s => s.name === spellName);
                            const isConcentration = spellData?.concentration;
                            const canCast = (wand.charges?.current || 0) > 0;

                            return (
                                <button
                                    key={spellName}
                                    onClick={() => handleCast(spellName)}
                                    disabled={!canCast}
                                    className="w-full flex items-center justify-between bg-card-elevated hover:bg-white/5 border border-white/10 p-4 rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors`}>
                                            <Zap size={20} className={canCast ? "animate-pulse" : ""} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-display text-white group-hover:text-purple-200 transition-colors">
                                                {spellName}
                                            </div>
                                            {isConcentration && (
                                                <div className="text-xs text-orange-300 flex items-center gap-1">
                                                    <span className="w-1 h-1 bg-orange-400 rounded-full" />
                                                    Concentration
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-white/20 group-hover:text-white/60" />
                                </button>
                            );
                        })}
                        {(!wand.spells || wand.spells.length === 0) && (
                            <div className="text-center text-muted italic p-4">
                                No spells imbued.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

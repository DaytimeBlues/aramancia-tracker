import { useMemo, useState } from 'react';
import { Minus, Plus, Zap, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSlots, slotUsed, toastShown } from '../../store/slices/characterSlice';
import { minionAdded, selectAllMinions } from '../../store/slices/combatSlice';
import { SUMMON_PROTOTYPES } from '../../data/summonPrototypes';
import type { Minion, SummonPrototype } from '../../types';

interface SummonManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SummonManager({ isOpen, onClose }: SummonManagerProps) {
    const dispatch = useAppDispatch();
    const slots = useAppSelector(selectSlots);
    const currentRound = useAppSelector(state => state.combat.currentRound);
    const existingSummons = useAppSelector(selectAllMinions);
    const [selectedPrototype, setSelectedPrototype] = useState<SummonPrototype | null>(null);
    const [count, setCount] = useState(1);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const availablePrototypes = useMemo(() => {
        return SUMMON_PROTOTYPES.filter((prototype) => {
            for (let level = prototype.spellLevel; level <= 9; level += 1) {
                if (slots[level] && slots[level].max - slots[level].used > 0) {
                    return true;
                }
            }
            return false;
        });
    }, [slots]);

    const existingCount = useMemo(() => {
        if (!selectedPrototype) return 0;
        return existingSummons.filter(minion => minion.name.startsWith(selectedPrototype.name)).length;
    }, [existingSummons, selectedPrototype]);

    const handleSummon = () => {
        if (!selectedPrototype || !selectedSlot) return;

        dispatch(slotUsed({ level: selectedSlot }));

        for (let i = 0; i < count; i += 1) {
            const summon: Minion = {
                id: `summon-${selectedPrototype.name}-${Date.now()}-${i}`,
                name: `${selectedPrototype.name} ${existingCount + i + 1}`,
                type: 'undead_spirit', // Generic type for summon
                hp: selectedPrototype.hp,
                maxHp: selectedPrototype.hp,
                ac: selectedPrototype.ac,
                speed: selectedPrototype.speed,
                attacks: selectedPrototype.attacks,
                conditions: [],
                controlExpiresRound: currentRound + selectedPrototype.duration,
                notes: selectedPrototype.abilities?.join(', ') || '',
            };
            dispatch(minionAdded(summon));
        }

        dispatch(toastShown(`Summoned ${count}x ${selectedPrototype.name}!`));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg glass-card p-6 rounded-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-400" />
                        Summon Creatures
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {availablePrototypes.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => {
                                setSelectedPrototype(p);
                                setSelectedSlot(p.spellLevel);
                                setCount(1);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${selectedPrototype?.name === p.name
                                ? 'bg-yellow-500/20 border-yellow-500 shadow-yellow-500/20 shadow-lg'
                                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-xs text-slate-400 mt-1 flex justify-between">
                                <span>CR {p.cr}</span>
                                <span>Level {p.spellLevel}+</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 ring-1 ring-red-500/20">
                                    HP {p.hp}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400 ring-1 ring-blue-500/20">
                                    AC {p.ac}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {selectedPrototype && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                            <div>
                                <div className="text-white font-bold">Summon Count</div>
                                <div className="text-xs text-slate-400">Max {selectedPrototype.maxCount} (per rule)</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setCount(Math.max(1, count - 1))}
                                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-slate-800"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="text-2xl font-bold text-white w-8 text-center">{count}</span>
                                <button
                                    onClick={() => setCount(Math.min(selectedPrototype.maxCount, count + 1))}
                                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-slate-800"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {[3, 4, 5, 6, 7, 8, 9].map(level => {
                                const isAvailable = slots[level] && slots[level].max - slots[level].used > 0;
                                const isTooLow = level < selectedPrototype.spellLevel;
                                return (
                                    <button
                                        key={level}
                                        disabled={!isAvailable || isTooLow}
                                        onClick={() => setSelectedSlot(level)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${selectedSlot === level
                                            ? 'bg-yellow-500 text-black'
                                            : isAvailable && !isTooLow
                                                ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-700/50 hover:bg-yellow-900/40'
                                                : 'bg-slate-900/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                                            }`}
                                    >
                                        L{level}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleSummon}
                            disabled={!selectedSlot}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-700 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Zap size={20} />
                            Summon {count}x {selectedPrototype.name}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { X, Trash2, Skull, Biohazard, Minus, Plus, Ghost, Play } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { minionAdded, minionRemoved, minionUpdated, allMinionsCleared, concentrationSet, slotUsed } from '../../store/slices/characterSlice';
import { selectCharacter, selectSpellAttackBonus } from '../../store/slices/characterSlice';
import { createAnimateDead, createSummonUndead } from '../../utils/necromancy';

interface MinionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MinionDrawer({ isOpen, onClose }: MinionDrawerProps) {
    const dispatch = useAppDispatch();
    const minions = useAppSelector(state => state.character.minions);
    const character = useAppSelector(selectCharacter);
    const spellAttackMod = useAppSelector(selectSpellAttackBonus);

    // UI State
    const [mode, setMode] = useState<'animate' | 'summon'>('animate');
    const [summonLevel, setSummonLevel] = useState<number>(3);
    const [consumeSlot, setConsumeSlot] = useState<boolean>(true);

    // --- HANDLERS ---

    const handleAnimateDead = (type: 'skeleton' | 'zombie') => {
        const hasUndeadThralls = character.level >= 6;
        const minion = createAnimateDead(type, character.level, character.profBonus, hasUndeadThralls);

        if (minion) {
            // Identifier for duplicate names
            const count = minions.filter(m => m.type === type).length + 1;
            minion.name = `${minion.name} ${count}`;
            dispatch(minionAdded(minion));

            // Animate Dead consumes a slot effectively (usually cast previously, but we can track it)
            // But usually it's cast on multiple targets. 
            // We won't auto-consume slot for Animate Dead simple button press as it handles 1 minion at a time
            // and the spell handles multiple.
        }
    };

    const handleSummonUndead = (form: 'ghostly' | 'putrid' | 'skeletal') => {
        const minion = createSummonUndead(summonLevel, form, spellAttackMod);
        if (minion) {
            dispatch(minionAdded(minion));

            // Set Concentration
            dispatch(concentrationSet(`Summon Undead (Lvl ${summonLevel})`));

            // Consume Slot
            if (consumeSlot) {
                dispatch(slotUsed({ level: summonLevel }));
            }

            // Close drawer after successful summon? Optional.
            // onClose(); 
        }
    };

    const handleUpdateMinion = (id: string, hp: number) => {
        dispatch(minionUpdated({ id, hp }));
    };

    const handleRemoveMinion = (id: string) => {
        dispatch(minionRemoved(id));
    };

    const handleClearMinions = () => {
        if (confirm("Dismiss all undead servants?")) {
            dispatch(allMinionsCleared());
        }
    };

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
                    } h-[85vh] flex flex-col shadow-2xl shadow-white/5`}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 shrink-0">
                    <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skull size={20} className="text-white" />
                            <h2 className="font-display text-lg text-parchment-light tracking-wider">Necromancy</h2>
                            <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full border border-white/20 font-display">
                                {minions.length} Active
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {minions.length > 0 && (
                                <button
                                    onClick={handleClearMinions}
                                    className="text-xs text-red-400 hover:text-red-300 uppercase font-display px-3 py-1.5 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-all"
                                >
                                    Dismiss All
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
                            >
                                <X size={20} className="text-white/60" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Casting Interface */}
                    <div className="bg-card-elevated/40 rounded-xl p-1 border border-white/10 flex mb-4">
                        <button
                            className={`flex-1 py-2 rounded-lg font-display text-sm transition-all ${mode === 'animate' ? 'bg-white/10 text-white shadow-sm' : 'text-muted hover:text-white/80'}`}
                            onClick={() => setMode('animate')}
                        >
                            Animate Dead
                        </button>
                        <button
                            className={`flex-1 py-2 rounded-lg font-display text-sm transition-all ${mode === 'summon' ? 'bg-white/10 text-white shadow-sm' : 'text-muted hover:text-white/80'}`}
                            onClick={() => setMode('summon')}
                        >
                            Summon Undead
                        </button>
                    </div>

                    {mode === 'animate' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleAnimateDead('skeleton')}
                                    className="flex flex-col items-center justify-center gap-2 bg-card-elevated hover:bg-white/5 border border-white/10 hover:border-white/30 p-4 rounded-xl transition-all"
                                >
                                    <Skull size={24} className="text-parchment" />
                                    <span className="font-display text-sm text-parchment-light">Raise Skeleton</span>
                                    <span className="text-xs text-muted">AC 13 • HP {character.level >= 6 ? 13 + character.level : 13}</span>
                                </button>
                                <button
                                    onClick={() => handleAnimateDead('zombie')}
                                    className="flex flex-col items-center justify-center gap-2 bg-card-elevated hover:bg-white/5 border border-white/10 hover:border-white/30 p-4 rounded-xl transition-all"
                                >
                                    <Biohazard size={24} className="text-moss" />
                                    <span className="font-display text-sm text-parchment-light">Raise Zombie</span>
                                    <span className="text-xs text-muted">AC 8 • HP {character.level >= 6 ? 22 + character.level : 22}</span>
                                </button>
                            </div>
                            <div className="text-center">
                                <span className={`text-xs ${character.level >= 6 ? 'text-accent' : 'text-muted'}`}>
                                    {character.level >= 6 ? '✨ Undead Thralls Active (+HP, +Dmg)' : 'Requires Level 6 for Undead Thralls'}
                                </span>
                            </div>
                        </div>
                    )}

                    {mode === 'summon' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-card-elevated p-4 rounded-xl border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-display text-muted">Slot Level</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSummonLevel(Math.max(3, summonLevel - 1))}
                                            className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center disabled:opacity-50"
                                            disabled={summonLevel <= 3}
                                        >
                                            <Minus size={14} className="text-white" />
                                        </button>
                                        <span className="font-display text-xl text-accent w-4 text-center">{summonLevel}</span>
                                        <button
                                            onClick={() => setSummonLevel(Math.min(9, summonLevel + 1))}
                                            className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center"
                                        >
                                            <Plus size={14} className="text-white" />
                                        </button>
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-white transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={consumeSlot}
                                        onChange={e => setConsumeSlot(e.target.checked)}
                                        className="rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                                    />
                                    Use Level {summonLevel} Slot & Set Concentration
                                </label>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => handleSummonUndead('ghostly')}
                                    className="flex items-center justify-between bg-card-elevated hover:bg-white/5 border border-white/10 p-3 rounded-lg group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Ghost size={18} className="text-cyan-400" />
                                        <div className="text-left">
                                            <div className="font-display text-sm text-white group-hover:text-accent">Ghostly Spirit</div>
                                            <div className="text-xs text-muted">{30 + (summonLevel - 3) * 10} HP • Fly/Hover • AC {11 + summonLevel}</div>
                                        </div>
                                    </div>
                                    <Play size={16} className="text-white/20 group-hover:text-accent" fill="currentColor" />
                                </button>

                                <button
                                    onClick={() => handleSummonUndead('putrid')}
                                    className="flex items-center justify-between bg-card-elevated hover:bg-white/5 border border-white/10 p-3 rounded-lg group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Biohazard size={18} className="text-green-500" />
                                        <div className="text-left">
                                            <div className="font-display text-sm text-white group-hover:text-accent">Putrid Spirit</div>
                                            <div className="text-xs text-muted">{30 + (summonLevel - 3) * 10} HP • Poison Aura • AC {11 + summonLevel}</div>
                                        </div>
                                    </div>
                                    <Play size={16} className="text-white/20 group-hover:text-accent" fill="currentColor" />
                                </button>

                                <button
                                    onClick={() => handleSummonUndead('skeletal')}
                                    className="flex items-center justify-between bg-card-elevated hover:bg-white/5 border border-white/10 p-3 rounded-lg group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Skull size={18} className="text-yellow-100" />
                                        <div className="text-left">
                                            <div className="font-display text-sm text-white group-hover:text-accent">Skeletal Spirit</div>
                                            <div className="text-xs text-muted">{20 + (summonLevel - 3) * 10} HP • Ranged • AC {11 + summonLevel}</div>
                                        </div>
                                    </div>
                                    <Play size={16} className="text-white/20 group-hover:text-accent" fill="currentColor" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Active Minions List */}
                    <div className="mt-8 space-y-3 pb-8">
                        <h3 className="font-display text-sm text-muted uppercase tracking-wider mb-2">Active Servants</h3>
                        {minions.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl text-muted/50 italic font-display">
                                No undead raised
                            </div>
                        ) : (
                            minions.map((minion) => (
                                <div
                                    key={minion.id}
                                    className="bg-card-elevated/60 border border-white/10 rounded-xl p-3 animate-in fade-in slide-in-from-bottom-2"
                                >
                                    {/* Minion Header */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {minion.type === 'undead_spirit' ? (
                                                <Ghost size={14} className="text-accent" />
                                            ) : minion.type === 'skeleton' ? (
                                                <Skull size={14} className="text-white" />
                                            ) : (
                                                <Biohazard size={14} className="text-moss" />
                                            )}
                                            <span className="font-display text-white">{minion.name}</span>
                                        </div>
                                        <span className="text-xs text-muted font-mono">AC {minion.ac}</span>
                                    </div>

                                    {/* HP Controls */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <button
                                                onClick={() => handleUpdateMinion(minion.id, Math.max(0, minion.hp - 1))}
                                                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-muted hover:text-red-400 rounded-lg transition-colors border border-white/10"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <div className="flex-1 text-center">
                                                <div className={`font-display text-lg ${minion.hp < minion.maxHp / 2 ? 'text-red-400' : 'text-white'}`}>
                                                    {minion.hp}
                                                </div>
                                                <div className="text-[10px] text-muted uppercase tracking-wider">
                                                    / {minion.maxHp} HP
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUpdateMinion(minion.id, Math.min(minion.maxHp, minion.hp + 1))}
                                                className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/20 text-muted hover:text-white rounded-lg transition-colors border border-white/10"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveMinion(minion.id)}
                                            className="p-2 hover:bg-red-500/10 text-muted hover:text-red-400 rounded-lg transition-colors ml-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Attacks Summary (Optional - mostly for reference) */}
                                    {minion.attacks.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-white/5 space-y-1">
                                            {minion.attacks.map((atk, i) => (
                                                <div key={i} className="flex justify-between text-xs text-muted/70">
                                                    <span>{atk.name}</span>
                                                    <span className="text-parchment-light">+{atk.toHit} ({atk.damage})</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

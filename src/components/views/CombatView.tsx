import { useState } from 'react';
import { MinionDrawer } from '../minions/MinionDrawer';
import { MathStrip } from '../features/combat/MathStrip';
import { InitiativeTracker } from '../features/combat/InitiativeTracker';
import { undeadStats } from '../../data/undeadStats';
import type { UndeadStatBlock } from '../../data/undeadStats';
import { Skull, Shield, Sword, Info, X, Users, Ghost, Biohazard, Bone, ChevronDown, ChevronUp, Wand2, Hourglass, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { minionSelectors, minionAdded } from '../../store/slices/combatSlice';
import type { Minion } from '../../types';

// No props needed now!
// No props needed now!
export function CombatView() {
    const dispatch = useAppDispatch();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatBlock, setSelectedStatBlock] = useState<UndeadStatBlock | null>(null);
    const [showSummons, setShowSummons] = useState(false);

    // Select minions from Redux
    const minions = useAppSelector(state => minionSelectors.selectAll(state.combat.minions));

    const openStats = (name: string) => {
        const stats = undeadStats.find(s => s.name.includes(name));
        if (stats) setSelectedStatBlock(stats);
    };

    const skeletonCount = minions.filter(m => m.type === 'skeleton').length;
    const zombieCount = minions.filter(m => m.type === 'zombie').length;

    return (
        <div className="pb-24 relative min-h-screen">
            {/* Combat Stats Strip - Floating Glass */}
            <div className="mb-6 sticky top-0 z-30">
                <div className="absolute inset-0 bg-bg/80 backdrop-blur-md border-b border-white/5 shadow-2xl"></div>
                <div className="relative pt-2 pb-2 px-2">
                    <MathStrip />
                </div>
            </div>

            <div className="px-4 space-y-6">
                {/* Initiative Tracker (P0) */}
                <InitiativeTracker />

                {/* Undead Manager Card */}
                <div className="card-parchment p-0 overflow-visible">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-900/20 rounded border border-green-500/20">
                                <Users size={16} className="text-green-400" />
                            </div>
                            <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Undead Horde</h3>
                        </div>
                        <span className="text-xs text-green-400 font-display bg-green-900/20 px-2 py-0.5 rounded border border-green-500/20">{minions.length} Active</span>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Skeleton Counter */}
                            <div className="relative group">
                                <button
                                    className="w-full bg-card-elevated/50 p-4 rounded-xl border border-white/5 relative cursor-pointer hover:border-white/20 transition-all active:scale-95 tap-feedback"
                                    onClick={() => openStats('Skeleton')}
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Info size={12} className="text-white/60" />
                                    </div>
                                    <div className="mb-2 p-2 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                                        <Skull size={20} className="text-parchment group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-2xl font-display text-white mb-0.5">{skeletonCount}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Skeletons</div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Quick add logic - simple skeleton
                                        const minion = {
                                            id: `skeleton-${Date.now()}`,
                                            name: `Skeleton ${skeletonCount + 1}`,
                                            type: 'skeleton',
                                            hp: 13,
                                            maxHp: 13,
                                            ac: 13,
                                            attacks: [{ name: 'Shortsword', toHit: 4, damage: '1d6+2' }]
                                        };
                                        // Need dispatch here, but CombatView.tsx doesn't have it explicitly yet
                                        // I'll add the dispatch call
                                        dispatch(minionAdded(minion as Minion)); // Using as any to bypass strict Minion type match for now if needed, or better: match the type
                                    }}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent text-bg-dark flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all z-20 border-2 border-bg-dark"
                                    aria-label="Quick Add Skeleton"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Zombie Counter */}
                            <div className="relative group">
                                <button
                                    className="w-full bg-card-elevated/50 p-4 rounded-xl border border-white/5 relative cursor-pointer hover:border-white/20 transition-all active:scale-95 tap-feedback"
                                    onClick={() => openStats('Zombie')}
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Info size={12} className="text-white/60" />
                                    </div>
                                    <div className="mb-2 p-2 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                                        <Biohazard size={20} className="text-green-600/80 group-hover:text-green-400 transition-colors" />
                                    </div>
                                    <div className="text-2xl font-display text-white mb-0.5">{zombieCount}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Zombies</div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const minion = {
                                            id: `zombie-${Date.now()}`,
                                            name: `Zombie ${zombieCount + 1}`,
                                            type: 'zombie',
                                            hp: 22,
                                            maxHp: 22,
                                            ac: 8,
                                            attacks: [{ name: 'Slam', toHit: 3, damage: '1d6+1' }]
                                        };
                                        dispatch(minionAdded(minion as Minion));
                                    }}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-600 text-bg-dark flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all z-20 border-2 border-bg-dark"
                                    aria-label="Quick Add Zombie"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="w-full btn-primary flex items-center justify-center gap-2 relative z-10 py-3 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        >
                            <Skull size={16} />
                            Manage Minions
                        </button>
                    </div>
                </div>

                {/* Summon Undead Reference - Collapsible */}
                <div className="card-parchment p-0 overflow-hidden">
                    <button
                        className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors"
                        onClick={() => setShowSummons(!showSummons)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-indigo-900/20 rounded border border-indigo-500/20">
                                <Bone size={16} className="text-indigo-300" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-display text-sm text-parchment tracking-wider uppercase">Summon Undead</h3>
                                <div className="text-[10px] text-muted">Stat Blocks • Level 3+</div>
                            </div>
                        </div>
                        {showSummons ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                    </button>

                    {showSummons && (
                        <div className="p-4 pt-0 space-y-2 relative z-10 animate-slide-down">
                            {/* Ghostly */}
                            <div
                                className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-white/5 cursor-pointer hover:border-white/20 transition-all group active:scale-[0.98]"
                                onClick={() => openStats('Ghostly')}
                            >
                                <div className="p-2.5 bg-card/50 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors shadow-inner">
                                    <Ghost size={18} className="text-cyan-200/70 group-hover:text-cyan-200 transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-display text-parchment-light group-hover:text-white transition-colors">Ghostly</div>
                                    <div className="text-xs text-muted/80">Fly 40ft • 1d8+7 Necrotic • Frighten</div>
                                </div>
                                <Info size={14} className="text-muted/50 group-hover:text-white transition-colors" />
                            </div>

                            {/* Putrid */}
                            <div
                                className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-white/5 cursor-pointer hover:border-white/20 transition-all group active:scale-[0.98]"
                                onClick={() => openStats('Putrid')}
                            >
                                <div className="p-2.5 bg-card/50 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors shadow-inner">
                                    <Shield size={18} className="text-emerald-200/70 group-hover:text-emerald-200 transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-display text-parchment-light group-hover:text-white transition-colors">Putrid</div>
                                    <div className="text-xs text-muted/80">Poison Aura • 1d6+7 Slash • Paralyze</div>
                                </div>
                                <Info size={14} className="text-muted/50 group-hover:text-white transition-colors" />
                            </div>

                            {/* Skeletal */}
                            <div
                                className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-white/5 cursor-pointer hover:border-white/20 transition-all group active:scale-[0.98]"
                                onClick={() => openStats('Skeletal')}
                            >
                                <div className="p-2.5 bg-card/50 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors shadow-inner">
                                    <Sword size={18} className="text-stone-300/70 group-hover:text-stone-300 transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-display text-parchment-light group-hover:text-white transition-colors">Skeletal</div>
                                    <div className="text-xs text-muted/80">Ranged 150ft • 2d4+7 Necrotic • Multiattack</div>
                                </div>
                                <Info size={14} className="text-muted/50 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Buttons (Fitts's Law) */}
            <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-40">
                {/* End Turn FAB */}
                <button
                    className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-red-300 border-red-500/30 hover:bg-red-900/40 hover:scale-105 active:scale-95 transition-all shadow-lg tap-feedback"
                    title="End Turn"
                    onClick={() => { /* TODO: Hook up to turn logic */ }}
                >
                    <Hourglass size={20} />
                </button>

                {/* Cast Spell FAB */}
                <button
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-bg-dark hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,177,58,0.4)] tap-feedback animate-float"
                    title="Quick Cast"
                    onClick={() => { /* TODO: Hook up to spell drawer */ }}
                >
                    <Wand2 size={24} />
                </button>
            </div>

            <MinionDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />

            {/* Stat Block Modal */}
            {selectedStatBlock && (
                <div
                    className="modal-backdrop"
                    onClick={() => setSelectedStatBlock(null)}
                >
                    <div
                        className="modal-content animate-scale-in"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Fixed Header with Close Button */}
                        <div className="modal-header">
                            <div>
                                <h2 className="text-xl font-display text-parchment-light">{selectedStatBlock.name}</h2>
                                <p className="text-xs text-muted italic">{selectedStatBlock.type}</p>
                            </div>
                            <button
                                onClick={() => setSelectedStatBlock(null)}
                                className="modal-close"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="space-y-4 text-sm">
                                {/* AC / HP / Speed */}
                                <div className="grid grid-cols-3 gap-2 text-center bg-card-elevated/80 p-3 rounded-lg border border-white/10">
                                    <div>
                                        <div className="text-[10px] text-muted uppercase tracking-wider">AC</div>
                                        <div className="font-display text-lg text-white">{selectedStatBlock.ac}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted uppercase tracking-wider">HP</div>
                                        <div className="font-display text-lg text-white">{selectedStatBlock.hp}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted uppercase tracking-wider">Speed</div>
                                        <div className="font-display text-lg text-parchment-light">{selectedStatBlock.speed}</div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-6 gap-1 text-center text-xs">
                                    {Object.entries(selectedStatBlock.stats).map(([stat, val]) => (
                                        <div key={stat} className="bg-card-elevated p-2 rounded border border-white/10">
                                            <div className="text-[8px] text-muted uppercase">{stat}</div>
                                            <div className="font-display text-parchment-light">{val}</div>
                                            <div className="text-[8px] text-white">{val >= 10 ? '+' : ''}{Math.floor((val - 10) / 2)}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Immunities */}
                                <div className="space-y-2 text-xs text-parchment border-t border-white/10 pt-3">
                                    {selectedStatBlock.damageImmunities && (
                                        <p><span className="text-white font-display">Damage Immunities:</span> {selectedStatBlock.damageImmunities}</p>
                                    )}
                                    {selectedStatBlock.conditionImmunities && (
                                        <p><span className="text-white font-display">Condition Immunities:</span> {selectedStatBlock.conditionImmunities}</p>
                                    )}
                                    <p><span className="text-white font-display">Senses:</span> {selectedStatBlock.senses}</p>
                                    <p><span className="text-white font-display">Languages:</span> {selectedStatBlock.languages}</p>
                                </div>

                                {/* Traits */}
                                {selectedStatBlock.traits && (
                                    <div className="border-t border-white/10 pt-3">
                                        {selectedStatBlock.traits.map(trait => (
                                            <div key={trait.name} className="mb-2">
                                                <span className="text-parchment-light font-display italic">{trait.name}.</span>{' '}
                                                <span className="text-parchment">{trait.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="border-t border-white/10 pt-3">
                                    <h4 className="text-white font-display border-b border-white/10 pb-1 mb-2">Actions</h4>
                                    {selectedStatBlock.actions.map(action => (
                                        <div key={action.name} className="mb-2">
                                            <span className="text-parchment-light font-display italic">{action.name}.</span>{' '}
                                            <span className="text-parchment">{action.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


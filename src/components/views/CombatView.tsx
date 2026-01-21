import { useState } from 'react';
import { MinionDrawer } from '../minions/MinionDrawer';
import { MathStrip } from '../features/combat/MathStrip';
import { undeadStats } from '../../data/undeadStats';
import type { UndeadStatBlock } from '../../data/undeadStats';
import { Skull, Shield, Sword, Info, X, Users, Ghost, Biohazard, Bone, ChevronDown, ChevronUp, Wand2, Hourglass, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { minionSelectors, minionAdded, turnAdvanced, startCombatWithInitiative } from '../../store/slices/combatSlice';
import { selectCharacter } from '../../store/slices/characterSlice';
import type { Minion } from '../../types';
import { SlotAbacus } from '../widgets/SlotAbacus';

export function CombatView() {
    const dispatch = useAppDispatch();
    const character = useAppSelector(selectCharacter);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatBlock, setSelectedStatBlock] = useState<UndeadStatBlock | null>(null);
    const [showSummons, setShowSummons] = useState(false);
    const [showCastDrawer, setShowCastDrawer] = useState(false);

    const minions = useAppSelector(state => minionSelectors.selectAll(state.combat.minions));
    const activeActorId = useAppSelector(state => state.combat.currentActorId);
    const currentRound = useAppSelector(state => state.combat.currentRound);
    const initiativeOrder = useAppSelector(state => state.combat.initiativeOrder);
    const isCombatActive = initiativeOrder.length > 0;

    const openStats = (name: string) => {
        const stats = undeadStats.find(s => s.name.includes(name));
        if (stats) setSelectedStatBlock(stats);
    };

    const skeletonCount = minions.filter(m => m.type === 'skeleton').length;
    const zombieCount = minions.filter(m => m.type === 'zombie').length;

    return (
        <div className="pb-24 relative min-h-screen">
            {/* Combat Stats Strip - Premium Floating Glass */}
            <div className="sticky top-0 z-40 transition-all duration-300">
                <div className="absolute inset-0 bg-bg/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"></div>
                <div className="relative pt-3 pb-3 px-4 flex flex-col gap-2">
                    <div className="flex-1 max-w-2xl mx-auto">
                        <MathStrip />
                    </div>
                    {/* Compact Spell Abacus Integrated */}
                    <div className="pb-1 max-w-2xl mx-auto w-full flex items-center gap-4">
                        <div className="flex-1">
                            <SlotAbacus compact />
                        </div>
                        {isCombatActive && (
                            <div className="flex flex-col items-end px-2 border-l border-white/10">
                                <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Round</span>
                                <span className="text-xl font-display text-accent leading-none">{currentRound}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6 pt-4">

                {/* Undead Manager Card - Necromancer Noir Style */}
                <div className="glass-card p-0 overflow-visible elevation-2 rounded-2xl animate-slide-up stagger-2">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-accent/10 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-900/30 rounded-lg border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                <Users size={18} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-display text-base text-white tracking-widest uppercase">Undead Horde</h3>
                                <div className="text-[10px] text-muted uppercase tracking-widest">Spectral Legion</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isCombatActive ? (
                                <button
                                    onClick={() => dispatch(startCombatWithInitiative(20))} // Default player initiative for now
                                    className="text-[10px] bg-accent/20 text-accent px-3 py-1 rounded-full border border-accent/30 hover:bg-accent/30 transition-colors uppercase tracking-widest font-bold"
                                >
                                    Start Combat
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30 shadow-inner">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs text-green-300 font-bold uppercase tracking-wider">{minions.length} Active</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Skeleton Counter */}
                            <div className="relative group">
                                <button
                                    className={`w-full bg-card-elevated/50 p-4 rounded-xl border relative cursor-pointer hover:border-white/20 transition-all active:scale-95 tap-feedback ${isCombatActive && (activeActorId === 'player' || activeActorId?.startsWith('skeleton'))
                                        ? 'border-accent shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                        : 'border-white/5'
                                        }`}
                                    onClick={() => openStats('Skeleton')}
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Info size={12} className="text-white/60" />
                                    </div>
                                    <div className="mb-2 p-2 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                                        <Skull size={20} className={`transition-colors ${isCombatActive && (activeActorId === 'player' || activeActorId?.startsWith('skeleton')) ? 'text-accent' : 'text-parchment group-hover:text-white'}`} />
                                    </div>
                                    <div className="text-2xl font-display text-white mb-0.5">{skeletonCount}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Skeletons</div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Necromancy: Undead Thralls (Level 6+)
                                        // Max HP increased by Wizard Level
                                        // Weapon Damage increased by Proficiency Bonus
                                        const isThrall = character.level >= 6;
                                        const hpBonus = isThrall ? character.level : 0;
                                        const dmgBonus = isThrall ? character.profBonus : 0;
                                        const baseDmg = 2; // Dex (+2)

                                        const minion = {
                                            id: `skeleton-${Date.now()}`,
                                            name: `Skeleton ${skeletonCount + 1}`,
                                            type: 'skeleton',
                                            hp: 13 + hpBonus,
                                            maxHp: 13 + hpBonus,
                                            ac: 13,
                                            attacks: [{
                                                name: 'Shortsword',
                                                toHit: 4,
                                                damage: `1d6 + ${baseDmg + dmgBonus}`
                                            }]
                                        };
                                        dispatch(minionAdded(minion as Minion));
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
                                    className={`w-full bg-card-elevated/50 p-4 rounded-xl border relative cursor-pointer hover:border-white/20 transition-all active:scale-95 tap-feedback ${isCombatActive && activeActorId?.startsWith('zombie')
                                        ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                        : 'border-white/5'
                                        }`}
                                    onClick={() => openStats('Zombie')}
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Info size={12} className="text-white/60" />
                                    </div>
                                    <div className="mb-2 p-2 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                                        <Biohazard size={20} className={`transition-colors ${isCombatActive && activeActorId?.startsWith('zombie') ? 'text-green-400' : 'text-green-600/80 group-hover:text-green-400'}`} />
                                    </div>
                                    <div className="text-2xl font-display text-white mb-0.5">{zombieCount}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Zombies</div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const isThrall = character.level >= 6;
                                        const hpBonus = isThrall ? character.level : 0;
                                        const dmgBonus = isThrall ? character.profBonus : 0;
                                        const baseDmg = 1; // Str (+1)

                                        const minion = {
                                            id: `zombie-${Date.now()}`,
                                            name: `Zombie ${zombieCount + 1}`,
                                            type: 'zombie',
                                            hp: 22 + hpBonus,
                                            maxHp: 22 + hpBonus,
                                            ac: 8,
                                            attacks: [{
                                                name: 'Slam',
                                                toHit: 3,
                                                damage: `1d6 + ${baseDmg + dmgBonus}`
                                            }]
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
                                <h3 className="font-display text-sm text-white tracking-wider uppercase">Summon Undead</h3>
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

            {/* Fixed Navigation/Action Zone - Fitts's Law Optimized */}
            <div className="fixed bottom-20 right-4 z-50 pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-3 items-end">
                    {/* End Turn FAB - Edge Positioning */}
                    <button
                        className={`w-14 h-14 rounded-2xl glass-card flex items-center justify-center transition-all shadow-xl tap-feedback elevation-3 ${isCombatActive
                            ? 'text-red-400 border-red-500/40 hover:bg-red-950/40 hover:scale-105 active:scale-95'
                            : 'opacity-20 cursor-not-allowed text-muted border-white/5'
                            }`}
                        title="End Turn"
                        disabled={!isCombatActive}
                        onClick={() => dispatch(turnAdvanced())}
                    >
                        <Hourglass size={24} className={isCombatActive ? "animate-spin-slow-once" : ""} />
                    </button>

                    {/* Cast Spell FAB - Primary Action at Edge */}
                    <button
                        className="w-18 h-18 rounded-3xl bg-gradient-to-br from-accent-glow via-accent to-accent-dark flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)] tap-feedback elevation-3 group"
                        title="Quick Cast"
                        onClick={() => setShowCastDrawer(true)}
                    >
                        <Wand2 size={32} className="group-hover:rotate-12 transition-transform duration-500" />
                        {/* Visual flare */}
                        <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <MinionDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />

            {/* Quick Cast Drawer */}
            {showCastDrawer && (
                <div
                    className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowCastDrawer(false)}
                >
                    <div
                        className="fixed bottom-0 left-0 right-0 bg-card-elevated border-t border-white/10 rounded-t-2xl max-h-[70vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-display text-lg text-parchment">Quick Cast</h3>
                            <button
                                onClick={() => setShowCastDrawer(false)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} className="text-muted" />
                            </button>
                        </div>
                        <div className="p-4 text-center text-muted text-sm">
                            <Wand2 size={32} className="mx-auto mb-2 text-accent opacity-50" />
                            <p>Spell casting drawer coming soon!</p>
                            <p className="text-xs mt-1">Go to the Spells tab to cast spells</p>
                        </div>
                    </div>
                </div>
            )}

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


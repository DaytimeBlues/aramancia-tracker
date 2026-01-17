import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    initiativeSet,
    turnAdvanced,
    initiativeCleared,
    selectAllMinions
} from '../../../store/slices/combatSlice';
import { selectCharacter } from '../../../store/slices/characterSlice';
import { Zap, RotateCcw, User, Skull, ChevronRight } from 'lucide-react';

export const InitiativeTracker: React.FC = () => {
    const dispatch = useAppDispatch();
    const { initiativeOrder, currentTurnIndex, currentRound, initiatives } = useAppSelector(state => state.combat);
    const minions = useAppSelector(selectAllMinions);
    const character = useAppSelector(selectCharacter);

    const handleRollPlayer = () => {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + character.abilityMods.dex;
        dispatch(initiativeSet({ id: 'player', value: total }));
    };

    const handleNextTurn = () => {
        dispatch(turnAdvanced());
    };

    const handleReset = () => {
        if (confirm("Reset combat initiative?")) {
            dispatch(initiativeCleared());
        }
    };

    const getActorName = (id: string) => {
        if (id === 'player') return 'Aramancia';
        const minion = minions.find(m => m.id === id);
        return minion?.name || 'Unknown';
    };

    const isPlayerSet = initiatives['player'] !== undefined;

    return (
        <div className="card-parchment p-0 overflow-hidden shadow-2xl animate-scale-in border-accent/20">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-accent animate-pulse" />
                    <h3 className="font-display text-sm text-parchment tracking-widest uppercase">Initiative</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10">
                        Round {currentRound}
                    </span>
                    <button
                        onClick={handleReset}
                        className="p-1.5 hover:bg-white/10 rounded-full text-muted transition-colors"
                        title="Reset Initiative"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {initiativeOrder.length === 0 ? (
                    <div className="py-8 text-center space-y-4">
                        <p className="text-xs text-muted italic font-display">No initiative set</p>
                        {!isPlayerSet && (
                            <button
                                onClick={handleRollPlayer}
                                className="btn-primary py-2 px-6 text-xs mx-auto"
                            >
                                Roll for Aramancia
                            </button>
                        )}
                    </div>
                ) : (
                    initiativeOrder.map((id, index) => {
                        const isActive = index === currentTurnIndex;
                        const name = getActorName(id);
                        const value = initiatives[id];
                        const isPlayer = id === 'player';

                        return (
                            <div
                                key={id}
                                className={`
                                    flex items-center justify-between p-3 rounded-xl border transition-all duration-300
                                    ${isActive
                                        ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(212,177,58,0.2)] scale-[1.02] z-10'
                                        : 'bg-black/20 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center border
                                        ${isPlayer ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-stone-800 border-white/10'}
                                    `}>
                                        {isPlayer ? <User size={14} className="text-indigo-300" /> : <Skull size={14} className="text-parchment" />}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-display ${isActive ? 'text-white' : 'text-parchment-light'}`}>
                                            {name}
                                        </div>
                                        <div className="text-[10px] text-muted font-mono">
                                            Roll: {value}
                                        </div>
                                    </div>
                                </div>

                                {isActive && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] uppercase tracking-widest text-accent font-bold animate-pulse">Your Turn</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Controls */}
            {initiativeOrder.length > 0 && (
                <div className="p-3 bg-black/40 border-t border-white/10">
                    <button
                        onClick={handleNextTurn}
                        className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 group"
                    >
                        <span className="text-xs uppercase tracking-widest">Next Turn</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {!isPlayerSet && initiativeOrder.length > 0 && (
                <div className="p-2 text-center">
                    <button
                        onClick={handleRollPlayer}
                        className="text-[10px] text-accent hover:underline uppercase tracking-tighter"
                    >
                        + Add Aramancia to Order
                    </button>
                </div>
            )}
        </div>
    );
};

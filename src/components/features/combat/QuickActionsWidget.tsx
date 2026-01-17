import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    concentrationCheckRequired,
    concentrationCheckResolved,
    concentrationBroken
} from '../../../store/slices/combatSlice';
import { slotsRestored } from '../../../store/slices/spellbookSlice';
import { Button } from '../../ui/Button';
import { Brain, Moon, Sun, AlertTriangle, Check, X, ChevronRight } from 'lucide-react';
import { concentrationSet } from '../../../store/slices/characterSlice';
import { spells as allSpells } from '../../../data/spells';

/**
 * Global quick actions widget providing:
 * - Concentration Check (when damage is taken)
 * - Death Save tracking
 * - Short Rest / Long Rest triggers
 * 
 * SRD Reference:
 * - Concentration check DC = max(10, damage/2) (SRD 5.1, Concentration, pp. 101-102)
 */
export const QuickActionsWidget: React.FC = () => {
    const dispatch = useAppDispatch();
    const activeConcentration = useAppSelector(state => state.combat.activeConcentration);
    const concentrationCheckDC = useAppSelector(state => state.combat.concentrationCheckDC);

    const [showDamageInput, setShowDamageInput] = useState(false);
    const [damageInput, setDamageInput] = useState('');

    // CON modifier for concentration check (from character)
    const { conMod, profBonus } = useAppSelector(state => ({
        conMod: Math.floor((state.character.abilities.con - 10) / 2),
        profBonus: state.character.profBonus
    }));
    const [showConcentrationPicker, setShowConcentrationPicker] = useState(false);

    // Select prepared spells that require concentration
    const preparedConcentrationSpells = useAppSelector(state => {
        const prepared = state.character.preparedSpells;
        // Filter against full spell list
        // Note: In a real app we'd map names to spell objects first. 
        // For now, assume we import 'spells' to check metadata.
        // We'll need to import 'spells' at top of file.
        return prepared.filter(name => {
            // Dynamic import or passed prop would be better, but we can import the data file directly
            // See imports below
            const spellData = allSpells.find(s => s.name === name);
            return spellData?.concentration;
        });
    });

    const handleSetConcentration = (spellName: string) => {
        dispatch(concentrationSet(spellName));
        setShowConcentrationPicker(false);
    };


    // War Caster feat gives advantage on concentration checks
    // TODO: Add feats support to CharacterState when needed
    // const hasWarCaster = false; // Reserved for future implementation

    const handleTriggerConcentrationCheck = () => {
        const damage = parseInt(damageInput, 10);
        if (!isNaN(damage) && damage > 0) {
            dispatch(concentrationCheckRequired({ damage }));
            setDamageInput('');
            setShowDamageInput(false);
        }
    };

    const handleConcentrationPassed = () => {
        dispatch(concentrationCheckResolved({ passed: true }));
    };

    const handleConcentrationFailed = () => {
        dispatch(concentrationCheckResolved({ passed: false }));
    };

    const handleDropConcentration = () => {
        if (confirm(`Drop concentration on ${activeConcentration?.spellName}?`)) {
            dispatch(concentrationBroken());
        }
    };

    const handleShortRest = () => {
        // Short rest doesn't restore spell slots for Wizard (only hit dice, etc.)
        alert('Short Rest: Recover HP with Hit Dice. Spell slots are NOT restored until Long Rest.');
    };

    const handleLongRest = () => {
        if (confirm('Take a Long Rest? This will restore all spell slots.')) {
            dispatch(slotsRestored());
            alert('Long Rest complete. All spell slots restored!');
        }
    };

    return (
        <div className="space-y-4">
            {/* Active Concentration Display */}
            {activeConcentration && (
                <div className="bg-purple-950/30 border border-purple-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                            <span className="text-sm text-purple-300">
                                Concentrating on <strong>{activeConcentration.spellName}</strong>
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDropConcentration}
                            className="text-stone-500 hover:text-red-400"
                        >
                            Drop
                        </Button>
                    </div>
                </div>
            )}

            {/* Concentration Check Modal */}
            {concentrationCheckDC !== null && (
                <div className="bg-orange-950/30 border border-orange-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-orange-300">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                        <span className="font-bold">Concentration Check Required!</span>
                    </div>

                    <div className="bg-stone-950 rounded-lg p-4 text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-2">Roll Constitution Save</div>
                        <div className="text-3xl font-mono font-bold text-white mb-2">
                            DC {concentrationCheckDC}
                        </div>
                        <div className="text-sm text-stone-400">
                            Your modifier: d20 + {conMod + profBonus} (CON {conMod >= 0 ? `+${conMod}` : conMod} + Prof +{profBonus})
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="fantasy"
                            onClick={handleConcentrationPassed}
                            className="bg-green-900/30 hover:bg-green-900/50 border-green-800 text-green-400"
                            icon={<Check className="w-4 h-4" />}
                        >
                            Passed
                        </Button>
                        <Button
                            variant="fantasy"
                            onClick={handleConcentrationFailed}
                            className="bg-red-900/30 hover:bg-red-900/50 border-red-800 text-red-400"
                            icon={<X className="w-4 h-4" />}
                        >
                            Failed
                        </Button>
                    </div>
                </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                {/* Concentration Check Trigger */}
                {activeConcentration && !concentrationCheckDC && (
                    <div className="col-span-2">
                        {showDamageInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={damageInput}
                                    onChange={(e) => setDamageInput(e.target.value)}
                                    placeholder="Damage taken"
                                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded text-white placeholder:text-stone-600"
                                    autoFocus
                                />
                                <Button
                                    variant="fantasy"
                                    onClick={handleTriggerConcentrationCheck}
                                    className="bg-orange-900/30 hover:bg-orange-900/50 border-orange-800 text-orange-400"
                                >
                                    Check
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDamageInput(false)}
                                    className="text-stone-500 hover:text-stone-300"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="fantasy"
                                onClick={() => setShowDamageInput(true)}
                                className="w-full bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300"
                                icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}
                            >
                                Took Damage (Concentration Check)
                            </Button>
                        )}
                    </div>
                )}

                {/* Set Concentration Button */}
                {!activeConcentration && (
                    <Button
                        variant="primary"
                        onClick={() => setShowConcentrationPicker(true)}
                        className="col-span-2 bg-purple-900/20 hover:bg-purple-900/30 border-purple-500/30 text-purple-300"
                        icon={<Brain className="w-4 h-4" />}
                    >
                        Set Concentration
                    </Button>
                )}

                {/* Rest Buttons */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShortRest}
                    className="bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-400"
                    icon={<Moon className="w-4 h-4" />}
                >
                    Short Rest
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLongRest}
                    className="bg-yellow-900/20 hover:bg-yellow-900/30 border-yellow-900/30 text-yellow-500"
                    icon={<Sun className="w-4 h-4" />}
                >
                    Long Rest
                </Button>
            </div>

            {/* Concentration Picker Modal */}
            {showConcentrationPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-sm border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-display text-lg text-parchment-light">Concentrate On...</h3>
                            <button onClick={() => setShowConcentrationPicker(false)} className="text-muted hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                            {preparedConcentrationSpells.length === 0 ? (
                                <p className="text-center text-muted italic py-4">No concentration spells prepared.</p>
                            ) : (
                                preparedConcentrationSpells.map(spellName => (
                                    <button
                                        key={spellName}
                                        onClick={() => handleSetConcentration(spellName)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg bg-card-elevated hover:bg-white/5 border border-white/10 group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-900/40 text-purple-300 flex items-center justify-center border border-purple-500/30">
                                                <Brain size={16} />
                                            </div>
                                            <span className="font-display text-white group-hover:text-purple-200">{spellName}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-white/20 group-hover:text-white/50" />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


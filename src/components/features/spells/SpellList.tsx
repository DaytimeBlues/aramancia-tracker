import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { initialSpellsV3 } from '../../../data/spellsV3';
import { SpellCard } from './SpellCard';
import { spellPrepared, spellUnprepared } from '../../../store/slices/spellbookSlice';
import { selectSlots, concentrationSet } from '../../../store/slices/characterSlice';
import { castingStarted, slotConfirmed } from '../../../store/slices/combatSlice';
import { CastModal } from './CastModal';
import { SpellV3 } from '../../../schemas/spellSchema';
import { useWizardMode } from '../../../context/WizardModeContext';

export const SpellList: React.FC = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const preparedSpells = useAppSelector(state => state.spellbook.preparedSpellIds);
    // Use character slots (Source of Truth) instead of spellbook
    const characterSlots = useAppSelector(selectSlots);

    // Derived available slots for UI compatibility
    const availableSlots = useMemo(() => {
        const avail: Record<number, number> = {};
        Object.keys(characterSlots).forEach(key => {
            const level = Number(key);
            const slot = characterSlots[level];
            avail[level] = Math.max(0, slot.max - slot.used);
        });
        return avail;
    }, [characterSlots]);

    // UI State
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
    const [filterSchool, setFilterSchool] = useState<string>('all');
    const [filterDamage, setFilterDamage] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPreparedOnly, setShowPreparedOnly] = useState(false);
    const [castingSpell, setCastingSpell] = useState<SpellV3 | null>(null);

    // Wizard Mode Context
    const { isExecutionMode } = useWizardMode();

    // Grouping Logic
    const groupedSpells = useMemo(() => {
        let spells = initialSpellsV3;

        // EXECUTION MODE: Always filter to prepared spells only
        if (isExecutionMode) {
            spells = spells.filter(s => preparedSpells.includes(s.id));
        } else if (showPreparedOnly) {
            // PREPARATION MODE with prepared filter
            spells = spells.filter(s => preparedSpells.includes(s.id));
        }

        if (filterLevel !== 'all') {
            spells = spells.filter(s => s.level === filterLevel);
        }

        if (filterSchool !== 'all') {
            spells = spells.filter(s => s.school === filterSchool);
        }

        if (filterDamage !== 'all') {
            spells = spells.filter(s => s.damage?.some(d => d.type === filterDamage));
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            spells = spells.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.school.toLowerCase().includes(query) ||
                s.tags?.some(t => t.toLowerCase().includes(query))
            );
        }

        // Group by level
        const groups: Record<number, typeof spells> = {};
        spells.forEach(spell => {
            if (!groups[spell.level]) {
                groups[spell.level] = [];
            }
            groups[spell.level].push(spell);
        });

        return groups;
    }, [filterLevel, filterSchool, filterDamage, searchQuery, showPreparedOnly, preparedSpells, isExecutionMode]);

    const handlePrepareToggle = (spellId: string) => {
        if (preparedSpells.includes(spellId)) {
            dispatch(spellUnprepared(spellId));
        } else {
            dispatch(spellPrepared(spellId));
        }
    };

    const handleCastConfirm = (slotLevel: number) => {
        if (castingSpell) {
            // Determine resolution mode

            const resolutionMode: 'attack' | 'save' | 'automatic' =
                castingSpell.requiresAttackRoll ? 'attack' :
                    castingSpell.requiresSavingThrow ? 'save' : 'automatic';

            // 1. Start Combat/Casting Flow
            dispatch(castingStarted({ spellId: castingSpell.id }));

            // 2. Confirm Slot & Mode (Trigger Resolution Panel)
            dispatch(slotConfirmed({ slotLevel, resolutionMode }));

            // 3. Set Concentration if needed
            if (castingSpell.duration.type === 'concentration') {
                dispatch(concentrationSet(castingSpell.name));
            }

            setCastingSpell(null);
        }
    };

    // Helper to check if currently concentrating (for the warning in CastModal)
    const currentConcentration = useAppSelector(state => state.character.concentration);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 p-4 rounded-lg bg-stone-950 border border-stone-900 sticky top-0 z-10 shadow-xl backdrop-blur-md bg-stone-950/90">

                {/* Search & Toggles Row */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search spells..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-sm text-parchment focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 uppercase tracking-wider font-bold">Show:</span>
                        <button
                            onClick={() => setShowPreparedOnly(!showPreparedOnly)}
                            className={`px-3 py-1 text-xs rounded border transition-colors ${showPreparedOnly
                                ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/50'
                                : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'
                                }`}
                        >
                            Prepared Only
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Row */}
                <div className="hidden sm:flex flex-wrap items-center gap-4 text-xs">
                    <select
                        value={filterSchool}
                        onChange={(e) => setFilterSchool(e.target.value)}
                        className="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-stone-400 focus:outline-none focus:border-stone-700"
                    >
                        <option value="all">All Schools</option>
                        <option value="Abjuration">Abjuration</option>
                        <option value="Conjuration">Conjuration</option>
                        <option value="Divination">Divination</option>
                        <option value="Enchantment">Enchantment</option>
                        <option value="Evocation">Evocation</option>
                        <option value="Illusion">Illusion</option>
                        <option value="Necromancy">Necromancy</option>
                        <option value="Transmutation">Transmutation</option>
                    </select>

                    <select
                        value={filterDamage}
                        onChange={(e) => setFilterDamage(e.target.value)}
                        className="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-stone-400 focus:outline-none focus:border-stone-700"
                    >
                        <option value="all">All Damage</option>
                        <option value="acid">Acid</option>
                        <option value="bludgeoning">Bludgeoning</option>
                        <option value="cold">Cold</option>
                        <option value="fire">Fire</option>
                        <option value="force">Force</option>
                        <option value="lightning">Lightning</option>
                        <option value="necrotic">Necrotic</option>
                        <option value="piercing">Piercing</option>
                        <option value="poison">Poison</option>
                        <option value="psychic">Psychic</option>
                        <option value="radiant">Radiant</option>
                        <option value="slashing">Slashing</option>
                        <option value="thunder">Thunder</option>
                    </select>
                </div>

                <div className="h-px w-full bg-stone-800/50" />

                {/* Level Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-r">
                    <button
                        onClick={() => setFilterLevel('all')}
                        className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${filterLevel === 'all' ? 'text-white font-bold' : 'text-stone-500 hover:text-stone-300'
                            }`}
                    >
                        All
                    </button>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                        <button
                            key={level}
                            onClick={() => setFilterLevel(level)}
                            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${filterLevel === level
                                ? 'bg-stone-800 text-white'
                                : 'text-stone-500 hover:text-stone-300'
                                }`}
                        >
                            {level === 0 ? 'Cantrip' : `Lvl ${level}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spell List */}
            <div className="space-y-8 pb-20">
                {Object.entries(groupedSpells).sort(([a], [b]) => Number(a) - Number(b)).map(([level, spells]) => (
                    <div key={level} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-stone-500 font-cinzel border-b border-stone-800 pb-2 mb-6 flex justify-between items-end max-w-7xl mx-auto">
                            <span>{Number(level) === 0 ? 'Cantrips' : `Level ${level} Spells`}</span>
                            {Number(level) > 0 && (
                                <span className="text-xs font-sans text-stone-600 font-bold tracking-widest uppercase">
                                    {availableSlots[Number(level)] || 0} Slots Available
                                </span>
                            )}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {spells.map(spell => (
                                <SpellCard
                                    key={spell.id}
                                    spell={spell}
                                    isPrepared={preparedSpells.includes(spell.id)}
                                    // Logic: Can cast if Cantrip OR (Not Cantrip AND has slots >= spell level)
                                    slotsAvailable={spell.level === 0 || Object.entries(availableSlots).some(([lvl, count]) => Number(lvl) >= spell.level && count > 0)}
                                    onPrepare={() => handlePrepareToggle(spell.id)}
                                    onCast={() => setCastingSpell(spell)}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {Object.keys(groupedSpells).length === 0 && (
                    <div className="text-center py-12 text-stone-600 italic">
                        No spells found matching your criteria.
                    </div>
                )}
            </div>

            {/* Cast Modal */}
            {castingSpell && (
                <CastModal
                    spell={castingSpell}
                    availableSlots={availableSlots}
                    onConfirm={handleCastConfirm}
                    onCancel={() => setCastingSpell(null)}
                    isConcentrating={!!currentConcentration}
                />
            )}
        </div>
    );
};

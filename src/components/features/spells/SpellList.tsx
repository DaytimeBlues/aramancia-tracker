import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { initialSpellsV3 } from '../../../data/spellsV3';
import { SpellCard } from './SpellCard';
import { spellPrepared, spellUnprepared } from '../../../store/slices/spellbookSlice';
import { selectSlots, concentrationSet, selectCharacter, toastShown } from '../../../store/slices/characterSlice';
import { castingStarted, slotConfirmed } from '../../../store/slices/combatSlice';
import { CastModal } from './CastModal';
import { SpellV3 } from '../../../schemas/spellSchema';
import { useWizardMode } from '../../../context/WizardModeContext';
import { Search, Filter, Book, Zap, Skull } from 'lucide-react';
import { PreparedSpellsBar } from './PreparedSpellsBar';

export const SpellList: React.FC = () => {
    const dispatch = useAppDispatch();

    // Selectors
    const preparedSpells = useAppSelector(state => state.spellbook.preparedSpellIds);
    const characterSlots = useAppSelector(selectSlots);
    const character = useAppSelector(selectCharacter);

    // SRD 5.1: Max prepared spells = INT mod + Wizard level (min 1)
    const maxPreparedSpells = Math.max(1, character.level + character.abilityMods.int);

    // Derived available slots
    const availableSlots = useMemo(() => {
        const avail: Record<number, number> = {};
        Object.keys(characterSlots).forEach(key => {
            const level = Number(key);
            const slot = characterSlots[level];
            avail[level] = Math.max(0, (slot.max || 0) - (slot.used || 0));
        });
        return avail;
    }, [characterSlots]);

    // UI State
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
    const [filterSchool, setFilterSchool] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPreparedOnly, setShowPreparedOnly] = useState(false);
    const [castingSpell, setCastingSpell] = useState<SpellV3 | null>(null);

    // Wizard Mode Context
    const { isExecutionMode } = useWizardMode();

    // Filtering Logic
    const groupedSpells = useMemo(() => {
        let spells = initialSpellsV3;

        if (isExecutionMode || showPreparedOnly) {
            spells = spells.filter(s => preparedSpells.includes(s.id));
        }

        if (filterLevel !== 'all') {
            spells = spells.filter(s => s.level === filterLevel);
        }

        if (filterSchool !== 'all') {
            spells = spells.filter(s => s.school === filterSchool);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            spells = spells.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.school.toLowerCase().includes(query)
            );
        }

        const groups: Record<number, typeof spells> = {};
        spells.forEach(spell => {
            if (!groups[spell.level]) {
                groups[spell.level] = [];
            }
            groups[spell.level].push(spell);
        });

        return groups;
    }, [filterLevel, filterSchool, searchQuery, showPreparedOnly, preparedSpells, isExecutionMode]);

    const handlePrepareToggle = (spellId: string) => {
        if (preparedSpells.includes(spellId)) {
            dispatch(spellUnprepared(spellId));
        } else {
            // Enforce preparation limit
            if (preparedSpells.length >= maxPreparedSpells) {
                dispatch(toastShown(`Grimoire at capacity! (${maxPreparedSpells} spells max)`));
                return;
            }
            dispatch(spellPrepared(spellId));
        }
    };

    const handleCastConfirm = (slotLevel: number) => {
        if (castingSpell) {
            const resolutionMode: 'attack' | 'save' | 'automatic' =
                castingSpell.requiresAttackRoll ? 'attack' :
                    castingSpell.requiresSavingThrow ? 'save' : 'automatic';

            dispatch(castingStarted({ spellId: castingSpell.id }));
            dispatch(slotConfirmed({ slotLevel, resolutionMode }));

            if (castingSpell.duration.type === 'concentration') {
                dispatch(concentrationSet(castingSpell.name));
            }

            setCastingSpell(null);
        }
    };

    const currentConcentration = useAppSelector(state => state.character.concentration);

    return (
        <div className="space-y-8 pb-24">
            {/* Prepared Spells Counter */}
            <div className="px-4 pt-4">
                <PreparedSpellsBar currentCount={preparedSpells.length} />
            </div>

            {/* Header / Search Controls */}
            <div className="sticky top-0 z-40">
                <div className="absolute inset-0 bg-bg/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl" />
                <div className="relative px-4 py-4 space-y-4 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Grimoire..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all"
                            />
                        </div>

                        {/* Filter Toggles */}
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1">
                            <button
                                onClick={() => setShowPreparedOnly(!showPreparedOnly)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap
                                    ${showPreparedOnly
                                        ? 'bg-accent/20 border-accent/40 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                                        : 'bg-white/5 border-white/10 text-muted hover:border-white/20'}`}
                            >
                                <Book size={14} />
                                Prepared Only
                            </button>

                            <select
                                value={filterSchool}
                                onChange={(e) => setFilterSchool(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs font-bold text-phantom uppercase tracking-widest focus:outline-none focus:border-accent/40"
                            >
                                <option value="all">All Schools</option>
                                <option value="Necromancy">Necromancy</option>
                                <option value="Evocation">Evocation</option>
                                <option value="Abjuration">Abjuration</option>
                                <option value="Conjuration">Conjuration</option>
                                <option value="Divination">Divination</option>
                                <option value="Enchantment">Enchantment</option>
                                <option value="Illusion">Illusion</option>
                                <option value="Transmutation">Transmutation</option>
                            </select>
                        </div>
                    </div>

                    {/* Level Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
                        <button
                            onClick={() => setFilterLevel('all')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
                                ${filterLevel === 'all' ? 'bg-white/10 text-white border border-white/20' : 'text-muted hover:text-phantom'}`}
                        >
                            <Filter size={12} />
                            All Levels
                        </button>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                            <button
                                key={level}
                                onClick={() => setFilterLevel(level)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap
                                    ${filterLevel === level
                                        ? 'bg-accent/30 text-white border border-accent/40 shadow-lg'
                                        : 'bg-white/5 text-muted border border-white/5 hover:border-white/20'}`}
                            >
                                {level === 0 ? 'Cantrips' : `Level ${level}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Spell Grid Sections */}
            <div className="px-4 space-y-12">
                {Object.entries(groupedSpells).sort(([a], [b]) => Number(a) - Number(b)).map(([level, spells]) => (
                    <div key={level} className="animate-slide-up">
                        <div className="flex items-center justify-between mb-6 border-l-2 border-accent/40 pl-4 py-1">
                            <div>
                                <h3 className="font-display text-2xl text-white tracking-widest uppercase">
                                    {Number(level) === 0 ? 'Cantrips' : `Circle ${level}`}
                                </h3>
                                <p className="text-[10px] text-muted uppercase tracking-[0.3em] font-bold">
                                    {Number(level) === 0 ? 'Words of Infinite Power' : 'Threads of the Weave'}
                                </p>
                            </div>
                            {Number(level) > 0 && (
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Zap size={10} className="text-accent" />
                                        <span className="text-sm font-display text-white">{availableSlots[Number(level)] || 0}</span>
                                    </div>
                                    <div className="text-[9px] text-muted uppercase tracking-widest font-black">Slots Ready</div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spells.map(spell => (
                                <SpellCard
                                    key={spell.id}
                                    spell={spell}
                                    isPrepared={preparedSpells.includes(spell.id)}
                                    slotsAvailable={spell.level === 0 || Object.entries(availableSlots).some(([lvl, count]) => Number(lvl) >= spell.level && count > 0)}
                                    onPrepare={() => handlePrepareToggle(spell.id)}
                                    onCast={() => setCastingSpell(spell)}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {Object.keys(groupedSpells).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                        <div className="p-6 bg-white/5 rounded-full border border-white/10 animate-pulse">
                            <Skull size={48} className="text-muted/20" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-display text-xl text-phantom tracking-widest uppercase">The Void Gapes back</h4>
                            <p className="text-sm text-muted">No spells found in the current circle of focus.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Cast Modal Overlay */}
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

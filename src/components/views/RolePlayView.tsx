import { useState } from 'react';
import { Book, Users, Sparkles, Skull, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { selectCharacter } from '../../store/slices/characterSlice';

/**
 * RolePlayView - Reference dashboard for non-combat gameplay.
 * 
 * WHY: Krug's scannability principles applied. This view is designed
 * for slower-paced exploration and social encounters. Content is formatted
 * for easy scanning: bullet lists, short paragraphs, bolded key terms.
 */
export function RolePlayView() {
    const character = useAppSelector(selectCharacter);
    const [showTradition, setShowTradition] = useState(true);
    const [showRecovery, setShowRecovery] = useState(true);

    const maxRecoveryPoints = Math.ceil(character.level / 2);

    return (
        <div className="pb-24 space-y-6 animate-fade-in px-4">
            {/* Context Header */}
            <div className="flex items-center justify-between pt-4 mb-2">
                <div>
                    <h2 className="font-display text-2xl text-parchment-light tracking-widest uppercase">Grimoire</h2>
                    <p className="text-[10px] text-muted uppercase tracking-tighter italic">Roleplaying & Reference</p>
                </div>
            </div>

            {/* Arcane Tradition Section */}
            <div className="card-parchment p-0 overflow-hidden elevation-1">
                <button
                    className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors"
                    onClick={() => setShowTradition(!showTradition)}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-purple-900/20 rounded border border-purple-500/20">
                            <Skull size={16} className="text-purple-300" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-display text-sm text-parchment-light tracking-wider uppercase">School of Necromancy</h3>
                            <div className="text-[10px] text-muted">Arcane Tradition • Level {character.level}</div>
                        </div>
                    </div>
                    {showTradition ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                </button>

                {showTradition && (
                    <div className="p-4 pt-0 space-y-4 animate-slide-down">
                        <div className="relative pl-4">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-500/30" />
                            <p className="text-sm text-parchment leading-relaxed italic">
                                You delve into the mysteries of life and death, commanding the forces that animate the dead.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="text-xs font-bold text-purple-400 uppercase mb-1">Grim Harvest (2nd Level)</div>
                                <p className="text-xs text-muted/90 leading-normal">
                                    Once per turn, when you kill a creature with a spell of 1st level or higher, regain HP equal to
                                    <b> twice the spell's level</b> (3× for Necromancy spells).
                                </p>
                            </div>
                            {character.level >= 6 && (
                                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                    <div className="text-xs font-bold text-purple-400 uppercase mb-1">Undead Thralls (6th Level)</div>
                                    <p className="text-xs text-muted/90 leading-normal">
                                        Animate Dead adds <b>+{character.level}</b> HP and <b>+{character.profBonus}</b> damage to your undead.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Arcane Recovery Section */}
            <div className="glass-card p-0 overflow-hidden elevation-1">
                <button
                    className="flex items-center justify-between w-full p-4 hover:bg-white/5 transition-colors"
                    onClick={() => setShowRecovery(!showRecovery)}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-900/20 rounded border border-blue-500/20">
                            <Sparkles size={16} className="text-blue-300" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-display text-sm text-parchment-light tracking-wider uppercase">Arcane Recovery</h3>
                            <div className="text-[10px] text-muted">Recover {maxRecoveryPoints} level(s) • Short Rest</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${character.arcaneRecoveryUsed ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
                            }`}>
                            {character.arcaneRecoveryUsed ? 'Used' : 'Available'}
                        </span>
                        {showRecovery ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                    </div>
                </button>

                {showRecovery && (
                    <div className="p-4 pt-0 space-y-3 animate-slide-down">
                        <p className="text-xs text-muted leading-relaxed">
                            Once per day, after a short rest, recover spell slots with a combined level equal to or less than
                            <b> half your wizard level (rounded up)</b>.
                        </p>
                        <ul className="text-xs text-parchment/80 space-y-1 list-none">
                            <li className="flex gap-2"><span className="text-blue-400">•</span> Max slot level: 5th</li>
                            <li className="flex gap-2"><span className="text-blue-400">•</span> Recovery budget: <b>{maxRecoveryPoints} levels</b></li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Character Chronicle */}
            <div className="card-parchment p-5 rounded-2xl border-white/10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                        <Users size={18} className="text-emerald-300" />
                    </div>
                    <h3 className="font-display text-base text-parchment tracking-widest uppercase">Chronicle</h3>
                </div>

                <div className="space-y-4 font-sans text-sm">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="text-[10px] text-emerald-400 uppercase font-black mb-2 tracking-widest">Active Quests</div>
                        <ul className="space-y-2 text-parchment/80">
                            <li className="flex gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>Tap to add quest notes...</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="text-[10px] text-emerald-400 uppercase font-black mb-2 tracking-widest">Key NPCs</div>
                        <div className="space-y-2">
                            <p className="text-parchment/60 italic text-xs">Tap to add NPC notes...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spellbook Summary */}
            <div className="glass-card p-5 rounded-2xl border-white/10 elevation-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                        <Book size={18} className="text-indigo-300" />
                    </div>
                    <div>
                        <h3 className="font-display text-base text-parchment tracking-widest uppercase">Spellbook</h3>
                        <p className="text-[10px] text-muted uppercase tracking-tighter">{character.preparedSpells.length} Prepared</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {character.preparedSpells.slice(0, 8).map((spell, index) => (
                        <span
                            key={index}
                            className="text-xs px-2 py-1 bg-indigo-900/30 border border-indigo-500/20 rounded-full text-indigo-200"
                        >
                            {spell}
                        </span>
                    ))}
                    {character.preparedSpells.length > 8 && (
                        <span className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-full text-muted">
                            +{character.preparedSpells.length - 8} more
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

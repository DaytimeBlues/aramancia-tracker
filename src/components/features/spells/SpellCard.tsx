import React, { useState } from 'react';
import { SpellV3 } from '../../../schemas/spellSchema';
import { Book, Flame, Shield, Skull, Eye, Star, Zap, Activity, Ghost, Clock, Ruler, ChevronDown } from 'lucide-react';
import { SpellDetailPanel } from './SpellDetailPanel';

interface SpellCardProps {
    spell: SpellV3;
    isPrepared: boolean;
    slotsAvailable: boolean;
    onPrepare: () => void;
    onCast: () => void;
}

const SchoolIcon = ({ school, active }: { school: string; active: boolean }) => {
    const className = `w-5 h-5 transition-all duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : 'opacity-60'}`;
    switch (school) {
        case 'Evocation': return <Flame className={`${className} text-red-500`} />;
        case 'Abjuration': return <Shield className={`${className} text-blue-500`} />;
        case 'Necromancy': return <Skull className={`${className} text-soul-green`} />;
        case 'Divination': return <Eye className={`${className} text-accent`} />;
        case 'Enchantment': return <Star className={`${className} text-pink-500`} />;
        case 'Transmutation': return <Zap className={`${className} text-orange-400`} />;
        case 'Illusion': return <Activity className={`${className} text-accent-glow`} />;
        default: return <Book className={`${className} text-phantom`} />;
    }
};

export const SpellCard: React.FC<SpellCardProps> = ({ spell, isPrepared, slotsAvailable, onPrepare, onCast }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isRitual = spell.ritual;
    const isConcentration = spell.duration.type === 'concentration';
    const isNecromancy = spell.school === 'Necromancy';

    return (
        <div className={`
            relative p-6 rounded-2xl border transition-all duration-500 group flex flex-col h-full overflow-hidden
            ${isPrepared
                ? 'bg-white/[0.03] border-accent/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] elevation-2'
                : 'bg-white/[0.01] border-white/5 opacity-80 hover:opacity-100 hover:border-white/10 hover:bg-white/[0.02]'
            }
        `}>
            {/* Background Glow for Prepared Spells */}
            {isPrepared && (
                <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 pointer-events-none rounded-full
                    ${isNecromancy ? 'bg-soul-green' : 'bg-accent'}`}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                <div className="flex items-start gap-4 min-w-0">
                    <div className={`p-2.5 rounded-xl border shadow-inner shrink-0 mt-0.5 transition-colors duration-500
                        ${isPrepared ? 'bg-black/40 border-accent/20' : 'bg-black/20 border-white/5'}`}>
                        <SchoolIcon school={spell.school} active={isPrepared} />
                    </div>
                    <div className="min-w-0">
                        <h3 className={`font-display text-lg tracking-wider transition-colors duration-500 ${isPrepared ? 'text-white' : 'text-phantom'}`}>
                            {spell.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isPrepared ? 'text-accent' : 'text-muted'}`}>
                                {spell.school}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] font-bold text-phantom uppercase">Level {spell.level}</span>
                        </div>
                    </div>
                </div>

                {/* Toggle Prepare Button */}
                <button
                    onClick={onPrepare}
                    className={`
                        p-2.5 rounded-xl transition-all duration-500 shrink-0 border group/prep
                        ${isPrepared
                            ? 'text-soul-green bg-soul-green/10 border-soul-green/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'text-muted bg-white/5 border-white/5 hover:text-white hover:border-white/20'
                        }
                    `}
                    title={isPrepared ? "Unprepare" : "Prepare"}
                >
                    <Book className={`w-4 h-4 transition-transform duration-500 ${isPrepared ? 'scale-110' : 'group-hover/prep:scale-110'}`} />
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <Clock size={12} className="text-muted" />
                    <span className="text-[10px] text-phantom truncate uppercase tracking-tighter">{spell.castingTime}</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-black/20 border border-white/5">
                    <Ruler size={12} className="text-muted" />
                    <span className="text-[10px] text-phantom truncate uppercase tracking-tighter">{spell.range}</span>
                </div>
            </div>

            {/* Tags Bar */}
            {(isRitual || isConcentration) && (
                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                    {isRitual && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10 border border-accent/20">
                            <Star size={10} className="text-accent-glow" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-accent-glow">Ritual</span>
                        </div>
                    )}
                    {isConcentration && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                            <Clock size={10} className="text-indigo-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Concentration</span>
                        </div>
                    )}
                </div>
            )}

            {/* Description Snippet / Expanded Detail */}
            <div className="flex-grow relative z-10">
                {isExpanded ? (
                    <SpellDetailPanel spell={spell} />
                ) : (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-left group/expand"
                    >
                        <p className="text-sm text-phantom leading-relaxed italic border-l border-white/10 pl-4 py-1 line-clamp-3 group-hover/expand:text-white transition-colors">
                            {spell.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-muted group-hover/expand:text-accent transition-colors">
                            <ChevronDown size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">View Details</span>
                        </div>
                    </button>
                )}

                {isExpanded && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="flex items-center gap-1.5 mt-3 text-muted hover:text-accent transition-colors"
                    >
                        <ChevronDown size={12} className="rotate-180" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Collapse</span>
                    </button>
                )}
            </div>

            {/* Cast Actions */}
            {isPrepared && (
                <div className="pt-5 mt-5 border-t border-white/5 flex justify-end relative z-10">
                    <button
                        onClick={onCast}
                        disabled={!slotsAvailable && !isRitual}
                        className={`
                            px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] rounded-xl
                            transition-all duration-500 flex items-center gap-3 group/btn
                            ${slotsAvailable
                                ? 'bg-accent/20 text-white hover:bg-accent/30 border border-accent/30 hover:border-accent/50 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                : 'bg-white/5 text-muted cursor-not-allowed border border-white/5'
                            }
                        `}
                    >
                        <Ghost className="w-3.5 h-3.5 group-hover/btn:translate-y-[-2px] transition-transform" />
                        Cast Spell
                    </button>
                </div>
            )}
        </div>
    );
};

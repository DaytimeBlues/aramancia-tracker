import { useState } from 'react';
import { Skull, Heart, Book, Scroll, Sparkles, ChevronDown, ChevronUp, Ghost, Activity, Shield } from 'lucide-react';
import { biographyData, allies, enemies } from '../../data/biography';
import { useAppSelector } from '../../store/hooks';
import { selectCharacter } from '../../store/slices/characterSlice';

export function BiographyView() {
    const character = useAppSelector(selectCharacter);
    const [showTradition, setShowTradition] = useState(true);
    const [showRecovery, setShowRecovery] = useState(true);

    const maxRecoveryPoints = Math.ceil(character.level / 2);

    return (
        <div className="pb-24 space-y-10 px-4 animate-fade-in relative z-10">
            {/* Legend Header */}
            <div className="flex items-center gap-5 mb-8 group">
                <div className="relative">
                    <div className="absolute inset-[-15px] bg-accent/20 blur-2xl rounded-full group-hover:bg-accent/30 transition-all duration-700" />
                    <div className="p-4 glass-card rounded-2xl border-accent/40 shadow-2xl relative z-10 elevation-2">
                        <Scroll className="text-accent-glow" size={28} />
                    </div>
                </div>
                <div>
                    <h2 className="font-display text-4xl text-white tracking-widest leading-none">Chronicles</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-px w-8 bg-accent/40" />
                        <p className="text-[10px] text-accent font-black uppercase tracking-[0.3em] font-sans">Legacy of House Vaelithor</p>
                    </div>
                </div>
            </div>

            {/* Hero Image Section - High Fidelity */}
            <div className="relative h-72 rounded-[2rem] overflow-hidden border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                <img
                    src={`${import.meta.env.BASE_URL}assets/aramancia-portrait.jpg`}
                    alt="Aramancia Vaelithor"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/60 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8 z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-px w-6 bg-accent" />
                        <span className="text-[10px] text-accent font-black uppercase tracking-[0.2em] font-sans">Spectral Archetype</span>
                    </div>
                    <h1 className="font-display text-4xl text-white tracking-[0.15em] mb-2 leading-none uppercase">
                        Aramancia
                    </h1>
                    <p className="text-xs text-phantom uppercase tracking-[0.3em] font-black opacity-80">Exiled High Scholar • Necromancer</p>
                </div>

                {/* Spectral Accents */}
                <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Skull size={48} className="text-white" />
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Arcane Tradition */}
                <div className={`glass-card p-0 overflow-hidden transition-all duration-500 border-white/5 shadow-2xl rounded-3xl ${showTradition ? 'elevation-2 border-accent/20' : ''}`}>
                    <button
                        className="flex items-center justify-between w-full p-6 hover:bg-white/5 transition-colors group/btn"
                        onClick={() => setShowTradition(!showTradition)}
                    >
                        <div className="flex items-center gap-5">
                            <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20 group-hover/btn:border-accent/40 transition-all">
                                <Skull size={24} className="text-accent" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-display text-lg text-white tracking-widest uppercase">School of Necromancy</h3>
                                <div className="text-[9px] text-accent font-black uppercase tracking-widest mt-1">Mastery Unveiled</div>
                            </div>
                        </div>
                        <div className={`p-2 rounded-xl transition-all ${showTradition ? 'bg-accent/20 text-white' : 'text-muted'}`}>
                            {showTradition ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </button>

                    {showTradition && (
                        <div className="p-6 pt-0 space-y-6 animate-slide-down origin-top">
                            <div className="relative p-5 bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/40" />
                                <p className="text-sm text-phantom leading-loose italic font-medium">
                                    "The line between life and death is but a veil, weathered by my touch. I do not merely command the dead; I whisper to the very essence of existence."
                                </p>
                            </div>

                            <div className="grid gap-4">
                                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all group/feat">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Activity size={14} className="text-accent" />
                                        <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Grim Harvest</div>
                                    </div>
                                    <p className="text-xs text-phantom leading-normal font-medium">
                                        Extract vital essence from the fallen. Regain HP equal to <b className="text-white">2× spell level</b> (3× for Necromancy).
                                    </p>
                                </div>
                                {character.level >= 6 && (
                                    <div className="bg-soul-green/5 p-5 rounded-2xl border border-soul-green/20 hover:border-soul-green/40 transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Ghost size={14} className="text-soul-green" />
                                            <div className="text-[10px] font-black text-soul-green uppercase tracking-[0.2em]">Undead Thralls</div>
                                        </div>
                                        <p className="text-xs text-phantom leading-normal font-medium">
                                            Bolster your minions. Animate Dead adds <b className="text-soul-green">+{character.level} HP</b> and <b className="text-soul-green">+{character.profBonus}</b> to damage.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Arcane Recovery */}
                <div className={`glass-card p-0 overflow-hidden transition-all duration-500 border-white/5 shadow-2xl rounded-3xl ${showRecovery ? 'elevation-2 border-soul-green/20' : ''}`}>
                    <button
                        className="flex items-center justify-between w-full p-6 hover:bg-white/5 transition-colors group/btn"
                        onClick={() => setShowRecovery(!showRecovery)}
                    >
                        <div className="flex items-center gap-5">
                            <div className="p-3 bg-soul-green/10 rounded-2xl border border-soul-green/20 group-hover/btn:border-soul-green/40 transition-all">
                                <Activity size={24} className="text-soul-green" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-display text-lg text-white tracking-widest uppercase">Siphon Reality</h3>
                                <div className="text-[9px] text-soul-green font-black uppercase tracking-widest mt-1">Arcane Recovery</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                                ${character.arcaneRecoveryUsed
                                    ? 'bg-hp-critical/10 text-hp-critical border-hp-critical/20'
                                    : 'bg-soul-green/10 text-soul-green border-soul-green/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}`}>
                                {character.arcaneRecoveryUsed ? 'Depleted' : 'Siphon Ready'}
                            </div>
                            <div className={`p-2 rounded-xl transition-all ${showRecovery ? 'bg-soul-green/20 text-white' : 'text-muted'}`}>
                                {showRecovery ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>
                    </button>

                    {showRecovery && (
                        <div className="p-6 pt-0 space-y-4 animate-slide-down origin-top">
                            <div className="p-5 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-soul-green/20 flex items-center justify-center bg-soul-green/5 shrink-0">
                                    <Sparkles size={18} className="text-soul-green" />
                                </div>
                                <div>
                                    <p className="text-xs text-phantom leading-loose font-medium">
                                        Once per day after meditation, recover spell slots totaling <b className="text-white">{maxRecoveryPoints}</b> levels (up to 5th level).
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Biography Chronicles */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 px-1">
                    <div className="p-2 bg-accent/10 rounded-xl border border-accent/20">
                        <Book size={20} className="text-accent" />
                    </div>
                    <h3 className="font-display text-2xl text-white tracking-widest uppercase">The Vaelithor Chronicles</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {biographyData.map((section, index) => (
                        <div key={index} className="glass-card p-6 rounded-3xl border-white/5 hover:border-accent/20 transition-all duration-500 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <Scroll size={120} className="text-white" />
                            </div>
                            <h4 className="text-[10px] font-black text-accent-glow uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                <div className="w-1 h-3 bg-accent rounded-full" />
                                {section.title}
                            </h4>
                            <p className="text-sm text-phantom leading-loose font-medium relative z-10">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Network Section (Allies & Enemies) */}
            <div className="grid lg:grid-cols-2 gap-10 pt-4">
                {/* Allies */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-1">
                        <div className="p-2 bg-soul-green/10 rounded-xl border border-soul-green/20">
                            <Heart size={20} className="text-soul-green" />
                        </div>
                        <h3 className="font-display text-2xl text-white tracking-widest uppercase">The Bound</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-soul-green/20 to-transparent" />
                    </div>

                    <div className="space-y-4">
                        {allies.map((ally, index) => (
                            <div key={index} className="glass-card p-5 flex items-center gap-5 border-white/5 hover:border-soul-green/20 transition-all duration-500 group rounded-3xl">
                                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-soul-green/30 transition-all">
                                    <Shield size={22} className="text-soul-green/40 group-hover:text-soul-green transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-display text-white text-lg tracking-wider uppercase">{ally.name}</span>
                                        <span className="text-[9px] text-soul-green font-black uppercase tracking-[0.2em] px-2 py-1 bg-soul-green/5 rounded-lg border border-soul-green/10">{ally.role}</span>
                                    </div>
                                    <p className="text-xs text-phantom leading-normal font-medium opacity-80">{ally.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enemies */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-1">
                        <div className="p-2 bg-hp-critical/10 rounded-xl border border-hp-critical/20">
                            <Skull size={20} className="text-hp-critical" />
                        </div>
                        <h3 className="font-display text-2xl text-white tracking-widest uppercase">The Marked</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-hp-critical/20 to-transparent" />
                    </div>

                    <div className="space-y-4">
                        {enemies.map((enemy, index) => (
                            <div key={index} className="glass-card p-5 flex items-center gap-5 border-white/5 hover:border-hp-critical/20 transition-all duration-500 group rounded-3xl">
                                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-hp-critical/30 transition-all">
                                    <Activity size={22} className="text-hp-critical/40 group-hover:text-hp-critical transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-display text-white text-lg tracking-wider uppercase">{enemy.name}</span>
                                        <span className="text-[9px] text-hp-critical font-black uppercase tracking-[0.2em] px-2 py-1 bg-hp-critical/5 rounded-lg border border-hp-critical/10">{enemy.role}</span>
                                    </div>
                                    <p className="text-xs text-phantom leading-normal font-medium opacity-80">{enemy.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quests and Reference (Merged from RolePlayView) */}
            <div className="grid lg:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                {/* The Quest Log */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-1">
                        <div className="p-2 bg-accent/10 rounded-xl border border-accent/20">
                            <Scroll size={20} className="text-accent" />
                        </div>
                        <h3 className="font-display text-2xl text-white tracking-widest uppercase">The Quest Log</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                    </div>

                    <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-accent/40 transition-all">
                            <div className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <Activity size={12} />
                                Active Threads
                            </div>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                    <span className="text-sm text-phantom font-medium">Investigate the whispers in the Shadowfell archives...</span>
                                </li>
                                <li className="flex gap-3 items-start opacity-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5" />
                                    <span className="text-sm text-phantom italic">Tap to scribe a new entry...</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* The Spellbook Summary */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-1">
                        <div className="p-2 bg-accent/10 rounded-xl border border-accent/20">
                            <Book size={20} className="text-accent" />
                        </div>
                        <h3 className="font-display text-2xl text-white tracking-widest uppercase">The Spellbook</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                    </div>

                    <div className="glass-card p-6 rounded-3xl border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-[10px] text-accent font-black uppercase tracking-[0.2em]">Resonating Essence</div>
                            <div className="text-[10px] text-phantom font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                                {character.preparedSpells.length} Prepared
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {character.preparedSpells.slice(0, 10).map((spell, index) => (
                                <span
                                    key={index}
                                    className="text-[10px] px-3 py-1.5 bg-accent/5 border border-accent/20 rounded-xl text-accent font-bold tracking-wider uppercase transition-all hover:bg-accent/20 hover:border-accent/40"
                                >
                                    {spell}
                                </span>
                            ))}
                            {character.preparedSpells.length > 10 && (
                                <span className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-phantom font-bold tracking-wider uppercase">
                                    +{character.preparedSpells.length - 10} More
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

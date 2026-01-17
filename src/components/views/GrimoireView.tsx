import { useState } from 'react';
import { magicSchools } from '../../data/lore';
import { BookOpen, ChevronRight, Crown } from 'lucide-react';

export function GrimoireView() {
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    return (
        <div className="pb-24 space-y-4 animate-fade-in relative z-10">
            {/* Header - Kyoto Style */}
            <div className="flex items-center gap-5 mb-10 px-2 animate-slide-up">
                <div className="relative group">
                    <div className="absolute inset-[-15px] bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-400/30 transition-all duration-700" />
                    <div className="p-4 glass-card rounded-2xl border-blue-500/30 shadow-2xl relative z-10 elevation-2">
                        <BookOpen className="text-blue-300 drop-shadow-[0_0_10px_rgba(147,197,253,0.5)]" size={28} />
                    </div>
                </div>
                <div>
                    <h2 className="font-display text-4xl text-parchment-light tracking-widest leading-none drop-shadow-2xl">Grimoire</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.3em]">Schools of Magic</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {magicSchools.map((school, index) => (
                    <div
                        key={school.name}
                        className={`glass-card overflow-hidden transition-all duration-500 ease-out animate-slide-up elevation-1 hover:elevation-2 rounded-2xl ${selectedSchool === school.name
                            ? 'ring-1 ring-accent/40 shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-accent-glow/5'
                            : 'opacity-90 hover:opacity-100 hover:border-white/20'
                            }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <button
                            onClick={() => setSelectedSchool(selectedSchool === school.name ? null : school.name)}
                            className={`w-full p-5 flex items-center justify-between text-left relative z-10 transition-all duration-300 tap-feedback ${selectedSchool === school.name ? 'bg-white/5 border-b border-white/5' : ''}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-4 h-4 rounded-full transition-all duration-500 relative flex items-center justify-center ${school.name === 'Necromancy'
                                    ? 'bg-accent shadow-[0_0_15px_rgba(212,177,58,0.8)]'
                                    : 'bg-white/10 border border-white/10'
                                    }`}>
                                    {school.name === 'Necromancy' && (
                                        <>
                                            <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-40" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />
                                        </>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-display text-xl tracking-widest transition-colors uppercase ${selectedSchool === school.name ? 'text-white' : 'text-parchment-light'}`}>
                                            {school.name}
                                        </span>
                                        {school.name === 'Necromancy' && (
                                            <div className="flex items-center gap-1.5 bg-accent px-2 py-0.5 rounded-full border border-accent-light shadow-lg">
                                                <Crown size={10} className="text-bg-dark" />
                                                <span className="text-[9px] font-black text-bg-dark uppercase tracking-tighter">
                                                    Specialty
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {selectedSchool !== school.name && (
                                        <p className="text-[11px] text-muted line-clamp-1 opacity-60 font-sans tracking-wide mt-1 italic">
                                            {school.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <ChevronRight
                                size={22}
                                className={`text-muted/40 transition-all duration-500 ${selectedSchool === school.name ? 'rotate-90 text-accent scale-110' : 'group-hover:text-parchment'}`}
                            />
                        </button>

                        {selectedSchool === school.name && (
                            <div className="px-5 pb-5 pt-2 relative z-10 animate-slide-down origin-top">
                                <div className="relative pl-4 mb-5">
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
                                    <p className="text-sm text-parchment leading-relaxed font-serif">
                                        {school.description}
                                    </p>
                                </div>

                                <div className="space-y-4 bg-black/20 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Crown size={14} className="text-accent" />
                                        <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest">
                                            Famous Practitioners
                                        </h4>
                                    </div>
                                    {school.famousWizards.map((wizard) => (
                                        <div key={wizard.name} className="relative group/wizard">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-sm font-display text-white group-hover/wizard:text-accent transition-colors">{wizard.name}</span>
                                                <span className="text-[9px] text-muted uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded">{wizard.title}</span>
                                            </div>
                                            <p className="text-xs text-muted/70 italic border-l border-white/10 pl-2 group-hover/wizard:border-accent/30 transition-colors">"{wizard.desc}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

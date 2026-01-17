import { useState } from 'react';
import { magicSchools } from '../../data/lore';
import { BookOpen, ChevronRight, Crown } from 'lucide-react';

export function GrimoireView() {
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    return (
        <div className="pb-24 space-y-4 animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 px-2">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <div className="p-3 bg-gradient-to-br from-blue-900/40 to-black/40 rounded-xl border border-blue-500/30 shadow-lg relative z-10">
                        <BookOpen className="text-blue-300" size={24} />
                    </div>
                </div>
                <div>
                    <h2 className="font-display text-3xl text-parchment-light tracking-wide leading-none drop-shadow-md">Grimoire</h2>
                    <p className="text-[10px] text-muted font-sans uppercase tracking-[0.2em] mt-1">Schools of Magic</p>
                </div>
            </div>

            <div className="space-y-3">
                {magicSchools.map((school, index) => (
                    <div
                        key={school.name}
                        className={`card-parchment overflow-hidden transition-all duration-500 ease-out animate-slide-up hover:border-white/20 ${selectedSchool === school.name
                            ? 'ring-1 ring-accent/30 shadow-[0_0_25px_rgba(212,177,58,0.1)]'
                            : 'opacity-90 hover:opacity-100'
                            }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <button
                            onClick={() => setSelectedSchool(selectedSchool === school.name ? null : school.name)}
                            className={`w-full p-4 flex items-center justify-between text-left relative z-10 transition-colors ${selectedSchool === school.name ? 'bg-white/5' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full transition-all duration-300 relative ${school.name === 'Necromancy'
                                    ? 'bg-accent shadow-[0_0_10px_rgba(212,177,58,0.6)]'
                                    : 'bg-white/20'
                                    }`}>
                                    {school.name === 'Necromancy' && <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-display text-lg tracking-wide transition-colors ${selectedSchool === school.name ? 'text-white' : 'text-parchment-light'}`}>
                                            {school.name}
                                        </span>
                                        {school.name === 'Necromancy' && (
                                            <span className="text-[9px] font-bold text-bg-dark bg-accent px-1.5 py-0.5 rounded border border-accent-light shadow-sm uppercase tracking-wider">
                                                Specialty
                                            </span>
                                        )}
                                    </div>
                                    {selectedSchool !== school.name && (
                                        <p className="text-[10px] text-muted line-clamp-1 opacity-60 font-serif italic">
                                            {school.description.substring(0, 40)}...
                                        </p>
                                    )}
                                </div>
                            </div>
                            <ChevronRight
                                size={20}
                                className={`text-muted transition-all duration-300 ${selectedSchool === school.name ? 'rotate-90 text-accent' : 'group-hover:text-parchment'}`}
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

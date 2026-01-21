import { useState } from 'react';
import { magicSchools } from '../../data/lore';
import { BookOpen, ChevronRight, Crown, Ghost } from 'lucide-react';

export function GrimoireView() {
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    return (
        <div className="pb-24 space-y-6 animate-fade-in relative z-10">
            {/* Header - Necromancer Noir */}
            <div className="flex items-center gap-5 mb-8 px-2 animate-slide-up">
                <div className="relative group">
                    <div className="absolute inset-[-15px] bg-accent/20 blur-2xl rounded-full group-hover:bg-accent/30 transition-all duration-700" />
                    <div className="p-4 glass-card rounded-2xl border-accent/30 shadow-2xl relative z-10 elevation-2">
                        <BookOpen className="text-accent-glow drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" size={28} />
                    </div>
                </div>
                <div>
                    <h2 className="font-display text-4xl text-white tracking-widest leading-none">Grimoire</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-px w-8 bg-accent/40" />
                        <p className="text-[10px] text-accent font-bold uppercase tracking-[0.3em]">Arcane Archives</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {magicSchools.map((school, index) => (
                    <div
                        key={school.name}
                        className={`glass-card overflow-hidden transition-all duration-500 ease-out animate-slide-up elevation-1 hover:elevation-2 rounded-3xl border-white/5 relative group ${selectedSchool === school.name
                            ? 'ring-1 ring-accent/40 shadow-[0_0_50px_rgba(139,92,246,0.2)] bg-accent/5 lg:scale-[1.02]'
                            : 'hover:border-accent/30 hover:bg-white/[0.02]'
                            }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                            <BookOpen size={120} className="text-white" />
                        </div>

                        <button
                            onClick={() => setSelectedSchool(selectedSchool === school.name ? null : school.name)}
                            className={`w-full p-6 flex items-center justify-between text-left relative z-10 transition-all duration-300 tap-feedback ${selectedSchool === school.name ? 'bg-white/5 border-b border-white/5' : ''}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className={`w-5 h-5 rounded-full transition-all duration-700 relative flex items-center justify-center ${school.name === 'Necromancy'
                                        ? 'bg-soul-green shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                                        : 'bg-white/10 border border-white/20'
                                        }`}>
                                        {school.name === 'Necromancy' && (
                                            <>
                                                <div className="absolute inset-0 rounded-full bg-soul-green animate-ping opacity-40" />
                                                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                                            </>
                                        )}
                                    </div>
                                    {selectedSchool === school.name && (
                                        <div className="absolute -inset-2 bg-accent/20 blur-xl rounded-full" />
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-display text-2xl tracking-[0.1em] transition-colors uppercase ${selectedSchool === school.name ? 'text-white' : 'text-phantom'}`}>
                                            {school.name}
                                        </span>
                                        {school.name === 'Necromancy' && (
                                            <div className="flex items-center gap-2 bg-soul-green/20 px-3 py-1 rounded-xl border border-soul-green/40 shadow-lg elevation-1">
                                                <Ghost size={12} className="text-soul-green" />
                                                <span className="text-[10px] font-black text-soul-green uppercase tracking-widest">
                                                    Sovereign
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {selectedSchool !== school.name && (
                                        <p className="text-xs text-phantom line-clamp-1 opacity-60 font-medium tracking-wide mt-1 italic">
                                            {school.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className={`p-2 rounded-2xl transition-all duration-500 ${selectedSchool === school.name ? 'bg-accent/20 text-white rotate-90 scale-110 shadow-lg' : 'text-muted group-hover:text-phantom'}`}>
                                <ChevronRight size={24} />
                            </div>
                        </button>

                        {selectedSchool === school.name && (
                            <div className="px-6 pb-6 pt-4 relative z-10 animate-slide-down origin-top">
                                <div className="relative p-5 bg-black/40 rounded-2xl border border-white/5 mb-6 shadow-inner">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent/50 to-transparent" />
                                    <p className="text-sm text-phantom leading-loose italic font-medium">
                                        {school.description}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2 px-1">
                                        <Crown size={16} className="text-accent-glow" />
                                        <h4 className="text-[11px] font-black text-accent uppercase tracking-[0.2em]">
                                            Archmages of the Veil
                                        </h4>
                                        <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                                    </div>
                                    <div className="grid gap-3">
                                        {school.famousWizards.map((wizard) => (
                                            <div key={wizard.name} className="relative group/wizard glass-card p-4 rounded-2xl border-white/5 hover:border-accent/40 transition-all duration-300">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-base font-display text-white group-hover/wizard:text-accent transition-colors tracking-wider uppercase">{wizard.name}</span>
                                                    <span className="text-[9px] text-accent font-black uppercase tracking-widest bg-accent/10 px-2 py-1 rounded-lg border border-accent/20">{wizard.title}</span>
                                                </div>
                                                <p className="text-xs text-phantom/70 italic leading-relaxed group-hover/wizard:text-phantom transition-colors">"{wizard.desc}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}

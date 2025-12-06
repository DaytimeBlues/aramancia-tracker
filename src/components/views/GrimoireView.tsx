import { useState } from 'react';
import { magicSchools } from '../../data/lore';
import { BookOpen, ChevronRight, Crown } from 'lucide-react';

export function GrimoireView() {
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg border border-accent/30">
                    <BookOpen className="text-accent" size={20} />
                </div>
                <div>
                    <h2 className="font-display text-xl text-parchment-light tracking-wider">Grimoire</h2>
                    <p className="text-xs text-muted">Schools of Magic</p>
                </div>
            </div>

            <div className="space-y-3">
                {magicSchools.map((school) => (
                    <div
                        key={school.name}
                        className={`card-parchment overflow-hidden transition-all duration-300 ${selectedSchool === school.name ? 'ring-1 ring-accent shadow-[0_0_20px_rgba(34,197,94,0.15)]' : ''
                            }`}
                    >
                        <button
                            onClick={() => setSelectedSchool(selectedSchool === school.name ? null : school.name)}
                            className="w-full p-4 flex items-center justify-between text-left relative z-10"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full transition-colors ${school.name === 'Necromancy'
                                    ? 'bg-accent shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse'
                                    : 'bg-parchment-dark/50'
                                    }`} />
                                <span className={`font-display text-base tracking-wide transition-colors ${selectedSchool === school.name ? 'text-accent' : 'text-parchment-light'
                                    }`}>
                                    {school.name}
                                </span>
                                {school.name === 'Necromancy' && (
                                    <span className="text-[9px] text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                                        Specialty
                                    </span>
                                )}
                            </div>
                            <ChevronRight
                                size={18}
                                className={`text-muted transition-all duration-300 ${selectedSchool === school.name ? 'rotate-90 text-accent' : ''
                                    }`}
                            />
                        </button>

                        {selectedSchool === school.name && (
                            <div className="px-4 pb-4 relative z-10">
                                <div className="border-l-2 border-accent/30 pl-4 mb-4">
                                    <p className="text-sm text-parchment leading-relaxed">
                                        {school.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Crown size={14} className="text-accent" />
                                        <h4 className="text-xs font-display text-parchment-light uppercase tracking-widest">
                                            Famous Practitioners
                                        </h4>
                                    </div>
                                    {school.famousWizards.map((wizard) => (
                                        <div key={wizard.name} className="bg-card-elevated/60 rounded-lg p-3 border border-parchment-dark/20">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-sm font-display text-parchment-light">{wizard.name}</span>
                                                <span className="text-[9px] text-accent/70 uppercase tracking-wider">{wizard.title}</span>
                                            </div>
                                            <p className="text-xs text-muted italic">"{wizard.desc}"</p>
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

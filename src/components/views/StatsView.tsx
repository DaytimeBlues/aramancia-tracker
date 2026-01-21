import { Brain, Star, Zap, Heart, Eye, Sparkles, Dumbbell, Skull, Ghost, Activity } from 'lucide-react';
import type { AbilityKey, Skill } from '../../types';
import { useAppSelector } from '../../store/hooks';
import { selectConcentration } from '../../store/slices/characterSlice';

interface StatsViewProps {
    abilities: Record<AbilityKey, number>;
    abilityMods: Record<AbilityKey, number>;
    skills: Record<string, Skill>;
    profBonus: number;
}

const abilityInfo: Record<AbilityKey, { name: string; icon: typeof Brain; color: string; accent: string }> = {
    str: { name: 'Strength', icon: Dumbbell, color: 'text-phantom', accent: 'bg-white/5' },
    dex: { name: 'Dexterity', icon: Zap, color: 'text-phantom', accent: 'bg-white/5' },
    con: { name: 'Constitution', icon: Heart, color: 'text-hp-critical/80', accent: 'bg-hp-critical/10' },
    int: { name: 'Intelligence', icon: Brain, color: 'text-accent-glow', accent: 'bg-accent/10' },
    wis: { name: 'Wisdom', icon: Eye, color: 'text-phantom', accent: 'bg-white/5' },
    cha: { name: 'Charisma', icon: Sparkles, color: 'text-phantom', accent: 'bg-white/5' },
};

function formatMod(mod: number): string {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

function getSkillBonus(skill: Skill, abilityMod: number, profBonus: number): number {
    return abilityMod + (skill.prof ? profBonus : 0);
}

export function StatsView({ abilities, abilityMods, skills, profBonus }: StatsViewProps) {
    const skillsByAbility: Record<AbilityKey, { key: string; skill: Skill }[]> = {
        str: [],
        dex: [],
        con: [],
        int: [],
        wis: [],
        cha: [],
    };

    Object.entries(skills).forEach(([key, skill]) => {
        if (skillsByAbility[skill.attr]) {
            skillsByAbility[skill.attr].push({ key, skill });
        }
    });

    const concentration = useAppSelector(selectConcentration);


    return (
        <div className="space-y-8 animate-fade-in relative z-10 px-1">
            {/* Header */}
            <div className="flex items-center gap-5 mb-10 group">
                <div className="relative">
                    <div className="absolute inset-[-15px] bg-soul-green/20 blur-2xl rounded-full group-hover:bg-soul-green/30 transition-all duration-700" />
                    <div className="p-4 glass-card rounded-2xl border-soul-green/30 shadow-2xl relative z-10 elevation-2">
                        <Skull className="text-soul-green drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" size={28} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent border-2 border-bg-dark animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                </div>
                <div>
                    <h2 className="font-display text-4xl text-white tracking-widest leading-none">Attributes</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-px w-8 bg-soul-green/40" />
                        <p className="text-[10px] text-soul-green font-black uppercase tracking-[0.3em]">Neural Mastery • +{profBonus} PB</p>
                    </div>
                </div>
            </div>

            {/* Concentration & Active Effects */}
            {concentration && (
                <div className="glass-card border-accent/30 p-5 flex items-center gap-4 animate-slide-up relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/40" />
                    <div className="p-3 bg-accent/20 rounded-xl border border-accent/40 shadow-lg">
                        <Activity className="w-5 h-5 text-accent-glow animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-accent-glow uppercase tracking-[0.3em] font-black">Active Trance</p>
                        <p className="text-xl font-display text-white tracking-wider">{concentration}</p>
                    </div>
                    <Ghost size={24} className="text-accent/10" />
                </div>
            )}

            {/* Abilities Grid */}
            <div className="grid gap-4">
                {(Object.keys(abilityInfo) as AbilityKey[]).map((abilityKey, index) => {
                    const info = abilityInfo[abilityKey];
                    const Icon = info.icon;
                    const score = abilities[abilityKey];
                    const mod = abilityMods[abilityKey];
                    const relatedSkills = skillsByAbility[abilityKey];

                    return (
                        <div
                            key={abilityKey}
                            className="glass-card p-0 overflow-hidden animate-slide-up hover:border-white/10 transition-all duration-500 group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="p-5 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl border transition-all duration-500 
                                        ${info.accent} border-white/5 group-hover:border-white/20`}>
                                        <Icon size={20} className={`${info.color} group-hover:scale-110 transition-transform`} />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-base text-white tracking-widest uppercase">
                                            {info.name}
                                        </h3>
                                        <span className="text-[10px] text-muted/60 font-black uppercase tracking-widest">
                                            {abilityKey} resonance
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center group/score">
                                        <span className="text-[9px] text-muted font-black uppercase tracking-widest block opacity-40 group-hover/score:opacity-100 transition-opacity">Base</span>
                                        <span className="text-2xl font-display text-white/40 group-hover:text-white transition-colors">{score}</span>
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500
                                        ${mod >= 0 ? 'bg-white/5 border-white/10 group-hover:border-accent/40' : 'bg-hp-critical/5 border-hp-critical/20 group-hover:border-hp-critical/40'}`}>
                                        <span className={`text-2xl font-display ${mod >= 0 ? 'text-white' : 'text-hp-critical'}`}>
                                            {formatMod(mod)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Panel */}
                            {relatedSkills.length > 0 && (
                                <div className="bg-black/20 border-t border-white/5 p-2 px-5 pb-5">
                                    <div className="space-y-1">
                                        {relatedSkills.map(({ key, skill }) => {
                                            const bonus = getSkillBonus(skill, mod, profBonus);
                                            return (
                                                <div
                                                    key={key}
                                                    className={`flex items-center justify-between p-2 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all duration-300
                                                        ${skill.prof ? 'bg-soul-green/[0.03]' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-1 h-1 rounded-full ${skill.prof ? 'bg-soul-green animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'bg-white/10'}`} />
                                                        <span className={`text-xs tracking-wide ${skill.prof ? 'text-white font-medium' : 'text-phantom/70'}`}>
                                                            {skill.name}
                                                        </span>
                                                        {skill.prof && (
                                                            <Star size={10} className="text-soul-green/40 fill-soul-green/20" />
                                                        )}
                                                    </div>
                                                    <div className={`font-display text-sm tracking-widest tabular-nums ${skill.prof ? 'text-soul-green' : 'text-phantom'}`}>
                                                        {formatMod(bonus)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="py-6 flex items-center justify-center gap-6 opacity-30 group cursor-default">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-soul-green" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Soul Connection (Proficiency)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star size={10} className="text-accent" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Ascended State</span>
                </div>
            </div>
        </div>
    );
}

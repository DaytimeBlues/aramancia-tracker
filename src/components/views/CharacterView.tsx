import type { CharacterData, Skill } from '../../types';
import { Target, ChevronRight, Skull } from 'lucide-react';
import { ProficiencyWidget } from '../widgets/ProficiencyWidget';
import { SavingThrowsWidget } from '../widgets/SavingThrowsWidget';
import { useState } from 'react';

interface CharacterViewProps {
    data: CharacterData;
}

export function CharacterView({ data }: CharacterViewProps) {
    const [collapsedSkills, setCollapsedSkills] = useState<Record<string, boolean>>({});
    if (!data) return null;

    const toggleSkillCategory = (ability: string) => {
        setCollapsedSkills(prev => ({
            ...prev,
            [ability]: !prev[ability]
        }));
    };

    const abilityOrder: Array<keyof CharacterData['abilities']> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const skillsByAbility = Object.values(data.skills || {}).reduce<Record<string, Record<string, Skill>>>((acc, skill) => {
        const list = acc[skill.attr] || {};
        list[skill.name] = skill;
        acc[skill.attr] = list;
        return acc;
    }, {});

    return (
        <div className="pb-24 space-y-8 px-4 animate-fade-in">
            {/* Core Stats Row */}
            <div className="stagger-1 animate-fade-in">
                <ProficiencyWidget
                    profBonus={data.profBonus}
                    level={data.level}
                />
            </div>

            <div className="stagger-2 animate-fade-in shadow-2xl">
                <SavingThrowsWidget
                    abilityMods={data.abilityMods}
                    profBonus={data.profBonus}
                    savingThrowProficiencies={data.savingThrowProficiencies}
                />
            </div>

            {/* Attributes Section */}
            <div className="stagger-3 animate-slide-up">
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-3">
                        <Skull size={20} className="text-soul-green drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <h3 className="font-display text-2xl text-white tracking-widest uppercase">Attributes</h3>
                    </div>
                    <div className="h-px flex-1 mx-6 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {abilityOrder.map((key, idx) => {
                        const score = data.abilities[key];
                        const mod = Math.floor((score - 10) / 2);
                        const displayMod = mod >= 0 ? `+${mod}` : `${mod}`;
                        return (
                            <div
                                key={key}
                                className="glass-card p-5 text-center relative overflow-hidden group tap-feedback border-white/5 hover:border-accent/30 transition-all duration-500"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="absolute top-0 right-0 p-1 opacity-[0.03] text-[50px] font-display font-bold leading-none select-none pointer-events-none group-hover:opacity-10 transition-opacity">
                                    {score}
                                </div>

                                <h4 className="text-[10px] text-phantom uppercase tracking-widest mb-2 font-black">{key}</h4>
                                <div className={`font-display text-5xl leading-none ${mod >= 0 ? 'text-white' : 'text-hp-critical'} relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                                    {displayMod}
                                </div>
                                <div className="inline-block mt-3 px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[10px] text-phantom font-sans tabular-nums">
                                    Score: {score}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Skills Section */}
            <div className="stagger-4 animate-slide-up">
                <div className="glass-card overflow-hidden border-white/5 shadow-2xl rounded-2xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-accent/10 to-transparent relative z-10">
                        <div className="flex items-center gap-3">
                            <Target size={20} className="text-accent-glow animate-pulse" />
                            <span className="font-display text-xl text-white tracking-widest uppercase">Skillset</span>
                        </div>
                        <div className="flex items-center gap-3 bg-soul-green/10 px-4 py-2 rounded-xl border border-soul-green/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <span className="text-[10px] text-soul-green font-black uppercase tracking-widest">Mastery</span>
                            <span className="text-lg font-display text-white">+{data.profBonus}</span>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5 relative z-10">
                        {abilityOrder.map((ability) => {
                            const skillsForAbility = Object.values(skillsByAbility[ability] || {}).sort((a, b) =>
                                a.name.localeCompare(b.name)
                            );
                            if (!skillsForAbility.length) return null;
                            const abilityMod = data.abilityMods?.[ability] || 0;
                            const isCollapsed = collapsedSkills[ability];

                            return (
                                <div key={ability} className="transition-all duration-300">
                                    <button
                                        onClick={() => toggleSkillCategory(ability)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group tap-feedback"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-90'}`}>
                                                <ChevronRight size={16} className="text-muted group-hover:text-accent transition-colors" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black uppercase tracking-widest text-phantom group-hover:text-white transition-colors w-10">{ability}</span>
                                                <span className={`text-xs font-display px-2 py-1 rounded-lg border tabular-nums ${abilityMod >= 0 ? 'bg-white/5 text-white border-white/10' : 'bg-hp-critical/10 text-hp-critical border-hp-critical/20'}`}>
                                                    {abilityMod >= 0 ? '+' : ''}{abilityMod}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-muted/40 uppercase tracking-widest font-bold">
                                            {skillsForAbility.length} talents
                                        </span>
                                    </button>

                                    {!isCollapsed && (
                                        <div className="bg-black/20 overflow-hidden animate-slide-down origin-top">
                                            {skillsForAbility.map((skill) => {
                                                const totalMod = abilityMod + (skill.prof ? data.profBonus : 0);
                                                return (
                                                    <div key={skill.name} className={`flex justify-between items-center px-6 py-3.5 hover:bg-white/5 border-l-2 transition-all duration-300 ${skill.prof ? 'border-soul-green bg-soul-green/5' : 'border-transparent'}`}>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${skill.prof ? 'bg-soul-green shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-white/10'}`} />
                                                            <span className={`text-sm tracking-wide ${skill.prof ? 'text-white font-medium' : 'text-phantom/70'}`}>
                                                                {skill.name}
                                                            </span>
                                                            {skill.prof && (
                                                                <span className="text-[9px] text-soul-green font-black uppercase tracking-tighter opacity-60">Proficient</span>
                                                            )}
                                                        </div>
                                                        <span className={`font-display text-base tabular-nums ${skill.prof ? 'text-white' : 'text-phantom'}`}>
                                                            {totalMod >= 0 ? '+' : ''}{totalMod}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

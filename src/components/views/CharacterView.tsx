import type { CharacterData, Skill } from '../../types';
import { Brain, Target, ChevronDown, ChevronRight } from 'lucide-react';
import { InitiativeWidget } from '../widgets/InitiativeWidget';
import { ProficiencyWidget } from '../widgets/ProficiencyWidget';
import { SavingThrowsWidget } from '../widgets/SavingThrowsWidget';
import { useState } from 'react';

interface CharacterViewProps {
    data: CharacterData;
}

export function CharacterView({ data }: CharacterViewProps) {
    if (!data) return null;

    const [collapsedSkills, setCollapsedSkills] = useState<Record<string, boolean>>({});

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
        <div className="pb-24 space-y-6">
            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-4 stagger-1 animate-fade-in">
                <InitiativeWidget
                    dexMod={data.abilityMods.dex}
                    profBonus={data.profBonus}
                />
                <ProficiencyWidget
                    profBonus={data.profBonus}
                    level={data.level}
                />
            </div>

            <div className="stagger-2 animate-fade-in">
                <SavingThrowsWidget
                    abilityMods={data.abilityMods}
                    profBonus={data.profBonus}
                    savingThrowProficiencies={data.savingThrowProficiencies}
                />
            </div>

            {/* Abilities Grid */}
            <div className="stagger-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <Brain size={18} className="text-secondary" />
                    <h3 className="font-display text-lg text-parchment-light tracking-wider">Abilities</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(data.abilities || {}).map(([key, score]) => {
                        const mod = Math.floor((score - 10) / 2);
                        const displayMod = mod >= 0 ? `+${mod}` : `${mod}`;
                        return (
                            <div key={key} className="card-parchment p-3 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-1 opacity-20 text-[40px] font-display font-bold leading-none select-none pointer-events-none group-hover:opacity-10 transition-opacity">
                                    {score}
                                </div>

                                <h4 className="text-[10px] text-muted uppercase tracking-widest mb-1 font-bold">{key}</h4>
                                <div className="font-display text-3xl text-parchment-light relative z-10 group-hover:scale-110 transition-transform">
                                    {displayMod}
                                </div>
                                <div className="text-[10px] text-muted/60 font-mono mt-1 border-t border-white/5 pt-1">
                                    Score: {score}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Skills Card */}
            <div className="stagger-4 animate-slide-up">
                <div className="card-parchment overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Target size={16} className="text-secondary" />
                            <span className="font-display text-base text-parchment-light tracking-wider">Skills</span>
                        </div>
                        <span className="text-[10px] text-indigo-200 bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-500/20">
                            Prof +{data.profBonus}
                        </span>
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
                                <div key={ability} className="">
                                    {/* Ability Header - Click to toggle */}
                                    <button
                                        onClick={() => toggleSkillCategory(ability)}
                                        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {isCollapsed ? <ChevronRight size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs uppercase tracking-widest font-bold text-muted group-hover:text-parchment transition-colors w-8">{ability.toUpperCase()}</span>
                                                <span className={`text-xs font-display px-1.5 py-0.5 rounded ${abilityMod >= 0 ? 'bg-white/5 text-parchment' : 'bg-red-900/20 text-red-300'}`}>
                                                    {abilityMod >= 0 ? '+' : ''}{abilityMod}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-muted/50">
                                            {skillsForAbility.length} skills
                                        </span>
                                    </button>

                                    {/* Skills List */}
                                    {!isCollapsed && (
                                        <div className="bg-black/10 animate-slide-down">
                                            {skillsForAbility.map((skill) => {
                                                const totalMod = abilityMod + (skill.prof ? data.profBonus : 0);
                                                return (
                                                    <div key={skill.name} className={`flex justify-between items-center px-4 py-2.5 hover:bg-white/5 border-l-2 ${skill.prof ? 'border-accent bg-accent/5' : 'border-transparent'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${skill.prof ? 'bg-accent shadow-[0_0_6px_rgba(212,177,58,0.6)]' : 'bg-white/10'}`} />
                                                            <span className={`text-sm ${skill.prof ? 'text-parchment-light font-medium' : 'text-muted'}`}>
                                                                {skill.name}
                                                            </span>
                                                        </div>
                                                        <span className={`font-display text-sm ${skill.prof ? 'text-white' : 'text-muted'}`}>
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

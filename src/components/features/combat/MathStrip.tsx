import React, { useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpellSaveDC, selectSpellAttackBonus, selectAbilityModifier, selectHp, selectCurrentAC } from '../../../store/slices/characterSlice';
import { Zap, Shield, Heart } from 'lucide-react';

interface StatBlockProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    subValue?: string | number;
    formula?: string;
    color: string;
    size?: 'sm' | 'md' | 'lg';
}

const StatBlock: React.FC<StatBlockProps> = ({ icon, label, value, subValue, formula, color, size = 'md' }) => {
    const [showFormula, setShowFormula] = useState(false);

    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-3xl'
    };

    return (
        <div className="relative">
            <button
                onClick={() => formula && setShowFormula(!showFormula)}
                className={`
                    flex flex-col items-center justify-center p-2 rounded-lg transition-all
                    ${formula ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}
                `}
            >
                <div className={`flex items-center gap-1.5 ${color} mb-0.5`}>
                    {icon}
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">{label}</span>
                </div>
                <div className={`font-bold font-display text-white leading-none ${sizeClasses[size]}`}>
                    {typeof value === 'number' && value >= 0 && label !== 'AC' && label !== 'HP' ? `+${value}` : value}
                    {subValue && <span className="text-sm text-stone-400 ml-1 font-sans">/ {subValue}</span>}
                </div>
            </button>

            {/* Formula Tooltip */}
            {showFormula && formula && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 w-max max-w-48 animate-fade-in">
                    <div className="bg-stone-800 border border-stone-700 rounded-lg p-3 shadow-xl text-xs text-stone-300">
                        <div className="font-mono">{formula}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Always-visible compact row showing key combat numbers.
 * Billboard Design: HP > AC > DC > Atk
 */
export const MathStrip: React.FC = () => {
    const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
    const spellSaveDC = useAppSelector(selectSpellSaveDC);
    const intMod = useAppSelector(state => selectAbilityModifier(state, 'int'));
    const profBonus = useAppSelector(state => state.character.profBonus);
    const hp = useAppSelector(selectHp);
    const ac = useAppSelector(selectCurrentAC);

    const hpColor = hp.current < hp.max / 2
        ? 'text-red-500 animate-pulse'
        : hp.temp > 0 ? 'text-blue-400' : 'text-green-500';

    return (
        <div className="flex items-center gap-2 sm:gap-6">
            {/* HP - The BillBoard */}
            <div className="flex-1 flex items-center justify-start border-r border-white/10 pr-4">
                <StatBlock
                    icon={<Heart className="w-4 h-4" />}
                    label="HP"
                    value={hp.current + hp.temp}
                    subValue={hp.max}
                    formula={`Current: ${hp.current} + Temp: ${hp.temp}`}
                    color={hpColor}
                    size="lg"
                />
            </div>

            {/* Core Defense */}
            <StatBlock
                icon={<Shield className="w-3.5 h-3.5" />}
                label="AC"
                value={ac}
                color="text-stone-300"
                size="md"
            />

            {/* Offense Stats - Smaller */}
            <div className="flex bg-black/20 rounded-lg p-1 border border-white/5">
                <StatBlock
                    icon={<Zap className="w-3 h-3" />}
                    label="DC"
                    value={spellSaveDC}
                    formula={`= 8 + Prof (${profBonus}) + INT (${intMod})`}
                    color="text-blue-400"
                    size="sm"
                />

                <div className="w-px bg-white/10 mx-1 my-2" />

                <StatBlock
                    icon={<Zap className="w-3 h-3" />}
                    label="Atk"
                    value={spellAttackBonus}
                    formula={`= Prof (${profBonus}) + INT (${intMod})`}
                    color="text-yellow-500"
                    size="sm"
                />
            </div>
        </div>
    );
};

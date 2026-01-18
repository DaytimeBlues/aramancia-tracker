import { useAppSelector } from '../../store/hooks';
import { Swords, Shield, Sparkles, Target } from 'lucide-react';

interface CombatBubbleProps {
    onClick: () => void;
}

export function CombatBubble({ onClick }: CombatBubbleProps) {
    const spellSaveDC = useAppSelector(state => state.character.dc);

    // Inline selector logic to avoid import issues
    const spellAttackBonus = useAppSelector(state => state.character.profBonus + state.character.abilityMods.int);

    const currentAC = useAppSelector(state => {
        const char = state.character;
        let ac = char.mageArmour ? 13 + char.abilityMods.dex : char.baseAC;
        if (char.shield) ac += 5;
        return ac;
    });

    const concentration = useAppSelector(state => state.character.concentration);
    // Explicit cast to bypass inexplicable build error where activeConcentration is missing from inferred type
    const activeConcentration = useAppSelector(state => (state.combat as any).activeConcentration);

    const isConcentrating = !!(concentration || activeConcentration);
    const attackBonusLabel = spellAttackBonus >= 0 ? `+${spellAttackBonus}` : `${spellAttackBonus}`;

    return (
        <button
            onClick={onClick}
            className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full
                glass-card backdrop-blur-md transition-all
                hover:scale-105 active:scale-95 shadow-lg tap-feedback
                ${isConcentrating
                    ? 'border-purple-500/30 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'border-white/20 hover:border-white/40'
                }
            `}
        >
            <Swords size={18} className={isConcentrating ? 'text-purple-300' : 'text-parchment'} />

            <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1" title="Armor Class">
                    <Shield size={12} className="text-blue-300" />
                    <span className="font-display text-parchment-light">{currentAC}</span>
                </div>
                <div className="flex items-center gap-1" title="Spell Save DC">
                    <Target size={12} className="text-amber-300" />
                    <span className="font-display text-parchment-light">{spellSaveDC}</span>
                </div>
                <div className="flex items-center gap-1" title="Spell Attack Bonus">
                    <Sparkles size={12} className="text-purple-300" />
                    <span className="font-display text-parchment-light">{attackBonusLabel}</span>
                </div>
            </div>

            {isConcentrating && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            )}
        </button>
    );
}

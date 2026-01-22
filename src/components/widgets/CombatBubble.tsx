import { useAppSelector } from '../../store/hooks';
import { Swords } from 'lucide-react';

interface CombatBubbleProps {
    onClick: () => void;
}

export function CombatBubble({ onClick }: CombatBubbleProps) {
    const currentAC = useAppSelector(state => {
        const char = state.character;
        let ac = char.mageArmour ? 13 + char.abilityMods.dex : char.baseAC;
        if (char.shield) ac += 5;
        return ac;
    });

    const concentration = useAppSelector(state => state.character.concentration);
    const activeConcentration = useAppSelector<ConcentrationState | null>(state => state.combat.activeConcentration);

    const isConcentrating = !!(concentration || activeConcentration);

    return (
        <button
            onClick={onClick}
            className={`
                relative w-14 h-14 rounded-2xl flex items-center justify-center
                bg-emerald-950/40 border border-emerald-500/30
                shadow-[0_0_20px_rgba(16,185,129,0.3)]
                hover:scale-105 active:scale-95 transition-all
                tap-feedback
            `}
            title="Combat Dashboard & Stats"
        >
            <Swords size={26} className="text-emerald-400" />

            {isConcentrating && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            )}

            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-bg-dark text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-lg border border-bg-dark shadow-sm">
                {currentAC}
            </div>
        </button>
    );
}

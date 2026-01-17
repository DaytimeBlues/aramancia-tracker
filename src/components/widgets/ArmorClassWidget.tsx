import { Shield } from 'lucide-react';

interface ArmorClassWidgetProps {
    baseAC: number;
    dexMod: number;
    mageArmour: boolean;
    hasShield: boolean;
    onToggle: (key: 'mageArmour' | 'shield') => void;
}

export function ArmorClassWidget({ baseAC, dexMod, mageArmour, hasShield, onToggle }: ArmorClassWidgetProps) {
    // RAW: Mage Armor sets base AC to 13 + DEX
    // Shield (spell) adds +5 AC
    const mageArmorAC = 13 + dexMod;
    const effectiveBaseAC = mageArmour ? mageArmorAC : baseAC;
    const currentAC = effectiveBaseAC + (hasShield ? 5 : 0);

    return (
        <div className="card-parchment p-0 overflow-hidden group hover:border-white/20 transition-colors">
            {/* Header with Visual */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 border-b border-white/10">
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/noise.png')]" />
                <div className="relative flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white/5 rounded border border-white/10">
                            <Shield size={16} className="text-blue-300" />
                        </div>
                        <h3 className="font-display text-sm text-parchment-light tracking-widest uppercase">Defense</h3>
                    </div>
                </div>
            </div>

            <div className="p-4 flex items-center gap-5">
                {/* AC Circle - Fitts's Law: 72px center target */}
                <div className="relative flex-shrink-0 group/ac">
                    <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-center relative touch-none pointer-events-none">
                        <div className="absolute inset-0 rounded-full border border-white/10 group-hover/ac:scale-110 transition-transform duration-500" />
                        <span className="font-display text-4xl text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] z-10 transition-transform group-hover/ac:scale-105">
                            {currentAC}
                        </span>
                        <div className="absolute -bottom-1.5 text-[10px] text-accent font-sans font-bold uppercase tracking-widest bg-slate-950 px-2 py-0.5 rounded-full border border-accent/30 shadow-lg">
                            AC
                        </div>

                        {/* Animated pulsing orbit for active protection */}
                        {(mageArmour || hasShield) && (
                            <div className="absolute inset-[-4px] border border-blue-400/20 rounded-full animate-pulse-glow" />
                        )}
                    </div>
                </div>

                {/* Toggles - Fitts's Law: full width clickable rows */}
                <div className="flex-1 space-y-2">
                    {/* Mage Armor */}
                    <button
                        onClick={() => onToggle('mageArmour')}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group/btn tap-feedback ${mageArmour ? 'bg-blue-900/30 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                        <div className="text-left">
                            <div className={`text-sm font-display tracking-wide transition-colors ${mageArmour ? 'text-blue-300' : 'text-muted group-hover/btn:text-parchment'}`}>Mage Armor</div>
                            <div className="text-[10px] text-muted/60 lowercase italic">base 13 + dex</div>
                        </div>
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${mageArmour ? 'border-blue-400 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-white/20'}`}>
                            {mageArmour && <div className="w-2 h-2 bg-white rounded-sm animate-scale-in" />}
                        </div>
                    </button>

                    {/* Shield Spell */}
                    <button
                        onClick={() => onToggle('shield')}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group/btn tap-feedback ${hasShield ? 'bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                        <div className="text-left">
                            <div className={`text-sm font-display tracking-wide transition-colors ${hasShield ? 'text-cyan-300' : 'text-muted group-hover/btn:text-parchment'}`}>Shield Spell</div>
                            <div className="text-[10px] text-muted/60 lowercase italic">+5 bonus</div>
                        </div>
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${hasShield ? 'border-cyan-400 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'border-white/20'}`}>
                            {hasShield && <div className="w-2 h-2 bg-white rounded-sm animate-scale-in" />}
                        </div>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-black/20 p-2 text-center border-t border-white/5">
                <span className="text-[10px] text-muted/50 uppercase tracking-widest">Base Armor Class: {baseAC}</span>
            </div>
        </div>
    );
}

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
                {/* AC Circle */}
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center relative overlow-hidden">
                        <div className="absolute inset-0 rounded-full border border-white/5" />
                        <span className="font-display text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10">
                            {currentAC}
                        </span>
                        <div className="absolute -bottom-1 text-[10px] text-muted font-sans font-bold uppercase tracking-wider bg-slate-900/90 px-1.5 rounded border border-white/10">
                            AC
                        </div>
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex-1 space-y-3">
                    {/* Mage Armor */}
                    <button
                        onClick={() => onToggle('mageArmour')}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-300 group/btn tap-feedback ${mageArmour ? 'bg-blue-900/20 border-blue-500/30' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="text-left">
                            <div className={`text-xs font-bold uppercase tracking-wider transition-colors ${mageArmour ? 'text-blue-300' : 'text-muted group-hover/btn:text-parchment'}`}>Mage Armor</div>
                            <div className="text-[10px] text-muted/60">Base 13 + DEX</div>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${mageArmour ? 'border-blue-400 bg-blue-500' : 'border-white/20'}`}>
                            {mageArmour && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                        </div>
                    </button>

                    {/* Shield Spell */}
                    <button
                        onClick={() => onToggle('shield')}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-300 group/btn tap-feedback ${hasShield ? 'bg-cyan-900/20 border-cyan-500/30' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
                    >
                        <div className="text-left">
                            <div className={`text-xs font-bold uppercase tracking-wider transition-colors ${hasShield ? 'text-cyan-300' : 'text-muted group-hover/btn:text-parchment'}`}>Shield Spell</div>
                            <div className="text-[10px] text-muted/60">+5 Bonus AC</div>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${hasShield ? 'border-cyan-400 bg-cyan-500' : 'border-white/20'}`}>
                            {hasShield && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
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

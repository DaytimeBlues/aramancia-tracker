import { Shield, Ghost } from 'lucide-react';

interface ArmorClassWidgetProps {
    baseAC: number;
    dexMod: number;
    mageArmour: boolean;
    hasShield: boolean;
    onToggle: (key: 'mageArmour' | 'shield') => void;
}

export function ArmorClassWidget({ baseAC, dexMod, mageArmour, hasShield, onToggle }: ArmorClassWidgetProps) {
    const mageArmorAC = 13 + dexMod;
    const effectiveBaseAC = mageArmour ? mageArmorAC : baseAC;
    const currentAC = effectiveBaseAC + (hasShield ? 5 : 0);

    return (
        <div className="glass-card p-0 overflow-hidden group border-white/5 shadow-2xl relative">
            {/* Header with Visual */}
            <div className="relative bg-gradient-to-r from-bg via-accent/10 to-bg p-5 border-b border-white/5">
                <div className="relative flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/20 rounded-xl border border-accent/30 shadow-lg">
                            <Shield size={18} className="text-accent-glow" />
                        </div>
                        <div>
                            <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Protection</h3>
                            <p className="text-[9px] text-muted tracking-widest font-bold uppercase">The Spectral Veil</p>
                        </div>
                    </div>
                    <Ghost size={16} className="text-muted/20" />
                </div>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-center gap-8">
                {/* AC Circle */}
                <div className="relative flex-shrink-0 group/ac scale-110">
                    <div className="absolute inset-0 bg-accent/30 blur-2xl rounded-full opacity-0 group-hover/ac:opacity-40 transition-opacity duration-700" />
                    <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-b from-white/[0.05] to-black/40 border-2 border-accent/20 shadow-2xl flex items-center justify-center relative z-10">
                        <span className="font-display text-5xl text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.4)] z-10 transition-transform group-hover/ac:scale-110 duration-500">
                            {currentAC}
                        </span>
                        <div className="absolute -bottom-2 text-[10px] text-accent font-black uppercase tracking-[0.2em] bg-bg px-3 py-1 rounded-full border border-accent/40 shadow-xl">
                            AC
                        </div>

                        {/* Pulsing orbit for active protection */}
                        {(mageArmour || hasShield) && (
                            <div className="absolute inset-[-6px] border border-accent/40 rounded-full animate-ping opacity-20" />
                        )}
                        {(mageArmour || hasShield) && (
                            <div className="absolute inset-[-4px] border border-soul-green/30 rounded-full animate-pulse opacity-40" />
                        )}
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex-1 w-full space-y-3">
                    {/* Mage Armor */}
                    <button
                        onClick={() => onToggle('mageArmour')}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 group/btn tap-feedback 
                            ${mageArmour
                                ? 'bg-accent/10 border-accent/40 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                    >
                        <div className="text-left">
                            <div className={`text-xs font-black uppercase tracking-widest transition-colors ${mageArmour ? 'text-accent-glow' : 'text-phantom'}`}>
                                Mage Armor
                            </div>
                            <div className="text-[10px] text-muted italic mt-0.5">13 + dex mastery</div>
                        </div>
                        <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all duration-500 
                            ${mageArmour ? 'border-accent/60 bg-accent shadow-[0_0_12px_rgba(139,92,246,0.5)]' : 'border-white/10'}`}>
                            {mageArmour && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                    </button>

                    {/* Shield Spell */}
                    <button
                        onClick={() => onToggle('shield')}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 group/btn tap-feedback 
                            ${hasShield
                                ? 'bg-soul-green/10 border-soul-green/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                    >
                        <div className="text-left">
                            <div className={`text-xs font-black uppercase tracking-widest transition-colors ${hasShield ? 'text-soul-green' : 'text-phantom'}`}>
                                Spell Shield
                            </div>
                            <div className="text-[10px] text-muted italic mt-0.5">+5 spectral ward</div>
                        </div>
                        <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all duration-500 
                            ${hasShield ? 'border-soul-green/60 bg-soul-green shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'border-white/10'}`}>
                            {hasShield && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-black/40 p-3 text-center border-t border-white/5 mt-2">
                <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-black">Native Resonance: {baseAC}</span>
            </div>
        </div>
    );
}

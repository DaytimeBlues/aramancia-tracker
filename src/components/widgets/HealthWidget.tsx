import { Skull, Minus, Plus, Shield, X, Activity } from 'lucide-react';
import { useState } from 'react';

interface HealthWidgetProps {
    current: number;
    max: number;
    temp: number;
    onChange: (newCurrent: number) => void;
    onTempChange: (newTemp: number) => void;
}

export function HealthWidget({ current, max, temp, onChange, onTempChange }: HealthWidgetProps) {
    const [tempInput, setTempInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const isCritical = current === 0;
    const isLow = current <= 10 && current > 0;

    const handleAddTemp = () => {
        const newTemp = parseInt(tempInput) || 0;
        if (newTemp > temp) {
            onTempChange(newTemp);
        }
        setTempInput('');
    };

    const handleDirectEdit = () => {
        const val = parseInt(editValue);
        if (!isNaN(val)) {
            onChange(Math.min(max, Math.max(0, val)));
            setIsEditing(false);
            setEditValue('');
        }
    };

    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative overflow-visible group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-hp-critical/10 rounded-xl border border-hp-critical/20">
                        <Skull size={18} className="text-hp-critical" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Vitality</h3>
                        <p className="text-[9px] text-muted tracking-widest font-bold uppercase">Life Essence</p>
                    </div>
                </div>
                {temp > 0 && (
                    <div className="flex items-center gap-2 bg-soul-green/20 px-3 py-1 rounded-full border border-soul-green/30 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <Shield size={10} className="text-soul-green" />
                        <span className="text-[10px] text-soul-green font-black uppercase tracking-widest">+{temp} Soul Shield</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                {/* Circular HP Display */}
                <button
                    onClick={() => { setEditValue(current.toString()); setIsEditing(true); }}
                    className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 tap-feedback group/hp border-2
                        ${isCritical ? 'bg-hp-critical/10 border-hp-critical shadow-[0_0_30px_rgba(220,38,38,0.3)]' :
                            isLow ? 'bg-hp-critical/5 border-hp-critical/40 shadow-[0_0_20px_rgba(220,38,38,0.1)]' :
                                'bg-white/[0.03] border-white/10 hover:border-white/20'}`}
                >
                    <div className="text-center relative z-10">
                        <span className={`font-display text-4xl block transition-all duration-500 ${isCritical ? 'text-hp-critical animate-pulse' :
                            isLow ? 'text-hp-critical' : 'text-white'
                            }`}>
                            {current}
                        </span>
                        <span className="text-muted text-[10px] font-black uppercase tracking-widest block -mt-1 opacity-40 group-hover/hp:opacity-100 transition-opacity">/{max} HP</span>
                    </div>

                    {/* Interior Progress Circle Effect */}
                    <div className="absolute inset-2 rounded-full border border-white/[0.05] pointer-events-none" />
                    <div className={`absolute inset-0 rounded-full transition-all duration-700 opacity-10 blur-sm pointer-events-none
                        ${isCritical ? 'bg-hp-critical animate-pulse' : 'bg-transparent'}`} />
                </button>

                {/* HP Progress and Fast Controls */}
                <div className="flex-1 w-full space-y-4">
                    {/* Linear Progress Bar */}
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-phantom flex items-center gap-2">
                                    <Activity size={10} className="text-hp-critical" />
                                    Continuum Status
                                </span>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-black uppercase tracking-widest tabular-nums ${current < max / 2 ? 'text-hp-critical' : 'text-soul-green'}`}>
                                    {Math.round(percentage)}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-black/40 border border-white/5 shadow-inner">
                            <div
                                style={{ width: `${percentage}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-700 ease-out relative
                                    ${isCritical ? 'bg-hp-critical' : isLow ? 'bg-hp-critical/60' : 'bg-white/80'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Adjust Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => onChange(Math.max(0, current - 1))}
                            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-hp-critical/10 hover:border-hp-critical/40 transition-all duration-500 tap-feedback group"
                        >
                            <Minus size={20} className="mx-auto text-muted group-hover:text-hp-critical transition-colors" />
                        </button>
                        <button
                            onClick={() => onChange(Math.min(max, current + 1))}
                            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-soul-green/10 hover:border-soul-green/40 transition-all duration-500 tap-feedback group"
                        >
                            <Plus size={20} className="mx-auto text-muted group-hover:text-soul-green transition-colors" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Temporary HP Control Panel */}
            <div className="mt-8 pt-5 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-soul-green/10 rounded-lg">
                        <Shield size={14} className="text-soul-green" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-phantom flex-1">Spectral Siphon (THP)</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            value={tempInput}
                            onChange={(e) => setTempInput(e.target.value)}
                            placeholder="0"
                            className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm text-white w-20 text-center focus:outline-none focus:border-soul-green/40 transition-all font-display tabular-nums"
                        />
                        <button
                            onClick={handleAddTemp}
                            className="px-5 py-2.5 rounded-xl bg-soul-green/10 border border-soul-green/30 text-[10px] font-black uppercase tracking-widest text-soul-green hover:bg-soul-green/20 transition-all tap-feedback"
                        >
                            Bind
                        </button>
                        {temp > 0 && (
                            <button
                                onClick={() => onTempChange(0)}
                                className="p-2.5 rounded-xl text-hp-critical/40 hover:text-hp-critical transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Direct Edit */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bg/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsEditing(false)} />
                    <div className="relative w-full max-w-sm glass-card border-accent/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-accent/10 to-transparent">
                            <h3 className="font-display text-xl text-white tracking-widest uppercase">Essence Shift</h3>
                            <button onClick={() => setIsEditing(false)} className="text-muted hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="text-center space-y-2">
                                <div className="text-6xl font-display text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tabular-nums">
                                    {editValue || current}
                                </div>
                                <div className="text-[10px] text-muted font-black uppercase tracking-[0.3em]">of {max} Vitality</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="text-[10px] text-center text-hp-critical font-black uppercase tracking-widest opacity-60">Siphon</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[1, 5, 10].map(amt => (
                                            <button
                                                key={`-${amt}`}
                                                onClick={() => setEditValue(p => Math.max(0, parseInt(p || current.toString()) - amt).toString())}
                                                className="py-3 rounded-xl border border-hp-critical/20 text-hp-critical font-display hover:bg-hp-critical/10 transition-all"
                                            >
                                                -{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[10px] text-center text-soul-green font-black uppercase tracking-widest opacity-60">Restore</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[1, 5, 10].map(amt => (
                                            <button
                                                key={`+${amt}`}
                                                onClick={() => setEditValue(p => Math.min(max, parseInt(p || current.toString()) + amt).toString())}
                                                className="py-3 rounded-xl border border-soul-green/20 text-soul-green font-display hover:bg-soul-green/10 transition-all"
                                            >
                                                +{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <input
                                    type="number"
                                    autoFocus
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-display text-white focus:border-accent/40 focus:outline-none transition-all"
                                />
                                <button
                                    onClick={handleDirectEdit}
                                    className="px-8 py-3 rounded-xl bg-accent text-white font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


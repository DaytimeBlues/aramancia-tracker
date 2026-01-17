import { Skull, Minus, Plus, Shield, X, Heart } from 'lucide-react';
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

    // RAW: THP doesn't stack - new THP replaces old (player chooses larger)
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
        <div className="card-parchment p-5 mb-4 relative overflow-visible">
            <div className="flex items-center gap-2 mb-4">
                <Skull size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">Hit Points</h3>
                {temp > 0 && (
                    <span className="ml-auto text-xs bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-500/30 animate-pulse">
                        +{temp} THP
                    </span>
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* Circular HP Display - Click to Edit */}
                <button
                    onClick={() => { setEditValue(current.toString()); setIsEditing(true); }}
                    className={`stat-circle w-24 h-24 glow-on-hover tap-feedback transition-colors relative group ${isCritical ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]' :
                        isLow ? 'border-orange-500' : ''
                        }`}
                >
                    <div className="text-center z-10">
                        <span className={`font-display text-3xl ${isCritical ? 'text-red-500 animate-pulse' :
                            isLow ? 'text-orange-400' : 'text-parchment-light'
                            }`}>
                            {current}
                        </span>
                        <span className="text-muted text-xs block -mt-1 group-hover:text-parchment transition-colors">/{max}</span>
                    </div>
                    {/* Hover Hint */}
                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="sr-only">Edit</span>
                    </div>
                </button>

                {/* HP Bar and Controls */}
                <div className="flex-1 space-y-3">
                    {/* Progress Bar */}
                    <div className="h-3 bg-card-elevated rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                        <div
                            className={`h-full transition-all duration-500 ease-out rounded-full relative overflow-hidden ${isCritical ? 'bg-red-600' :
                                isLow ? 'bg-orange-500' : 'bg-white'
                                }`}
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>

                    {/* Fitts's Law Optimized Controls */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => onChange(Math.max(0, current - 1))}
                            className="btn-fantasy flex-1 flex items-center justify-center py-3 active:scale-95 tap-feedback group border-red-900/30 hover:border-red-500/50"
                        >
                            <Minus size={20} className="group-hover:text-red-400 transition-colors" />
                        </button>
                        <button
                            onClick={() => onChange(Math.min(max, current + 1))}
                            className="btn-fantasy flex-1 flex items-center justify-center py-3 active:scale-95 tap-feedback group border-green-900/30 hover:border-green-500/50"
                        >
                            <Plus size={20} className="group-hover:text-green-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Temporary HP Section */}
            <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-white/70" />
                    <span className="text-xs text-muted">Temp HP</span>
                    <input
                        type="number"
                        min="0"
                        value={tempInput}
                        onChange={(e) => setTempInput(e.target.value)}
                        placeholder="0"
                        className="flex-1 bg-card-elevated border border-white/10 rounded px-2 py-1 text-sm text-parchment w-16 text-center focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <button
                        onClick={handleAddTemp}
                        className="btn-fantasy text-xs px-3 py-1 bg-indigo-900/20 border-indigo-500/30 text-indigo-200 hover:text-white hover:bg-indigo-800/40"
                    >
                        Add
                    </button>
                    {temp > 0 && (
                        <button
                            onClick={() => onTempChange(0)}
                            className="text-xs text-red-400 hover:text-red-300 px-2"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Edit Modal */}
            {isEditing && (
                <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
                    <div className="modal-content max-w-xs animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="font-display text-lg text-parchment">Adjust Health</h3>
                            <button onClick={() => setIsEditing(false)} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3 justify-center mb-2 px-4 py-3 bg-black/20 rounded-lg">
                                <Heart className={`transition-colors ${current < max / 2 ? 'text-red-500' : 'text-green-500'}`} size={28} />
                                <span className="text-3xl font-display text-white">{editValue || current}</span>
                                <span className="text-muted text-lg pt-1">/ {max}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-xs text-center text-red-400 font-bold uppercase tracking-wider">Damage</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[1, 5, 10].map(amt => (
                                            <button
                                                key={`-${amt}`}
                                                onClick={() => setEditValue(p => Math.max(0, parseInt(p || current.toString()) - amt).toString())}
                                                className="btn-fantasy py-2 text-red-400 border-red-900/30 hover:bg-red-900/20"
                                            >
                                                -{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-center text-green-400 font-bold uppercase tracking-wider">Heal</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[1, 5, 10].map(amt => (
                                            <button
                                                key={`+${amt}`}
                                                onClick={() => setEditValue(p => Math.min(max, parseInt(p || current.toString()) + amt).toString())}
                                                className="btn-fantasy py-2 text-green-400 border-green-900/30 hover:bg-green-900/20"
                                            >
                                                +{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    placeholder={current.toString()}
                                    className="flex-1 bg-bg-dark border border-white/10 rounded px-3 py-2 text-center text-lg font-display focus:border-accent/50 focus:outline-none"
                                />
                                <button onClick={handleDirectEdit} className="btn-primary flex-1">
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

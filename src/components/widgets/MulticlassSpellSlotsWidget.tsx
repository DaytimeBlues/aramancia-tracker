import { useState } from 'react';
import { Plus, Minus, RefreshCw, X, Ghost, Sparkles, Wand2 } from 'lucide-react';
import type { ClassLevel, CasterType } from '../../utils/spellSlotCalculator';
import {
    calculateCasterLevel,
    getSpellSlots,
    formatClassLevels
} from '../../utils/spellSlotCalculator';

interface MulticlassSpellSlotsWidgetProps {
    currentSlots?: Record<number, { used: number; max: number }>;
    onSlotsCalculated: (slots: Record<number, { used: number; max: number }>) => void;
}

const CASTER_CLASSES = [
    { name: 'Wizard', type: 'full' as CasterType },
    { name: 'Cleric', type: 'full' as CasterType },
    { name: 'Druid', type: 'full' as CasterType },
    { name: 'Bard', type: 'full' as CasterType },
    { name: 'Sorcerer', type: 'full' as CasterType },
    { name: 'Paladin', type: 'half' as CasterType },
    { name: 'Ranger', type: 'half' as CasterType },
    { name: 'Eldritch Knight', type: 'third' as CasterType },
    { name: 'Arcane Trickster', type: 'third' as CasterType },
];

export function MulticlassSpellSlotsWidget({ currentSlots, onSlotsCalculated }: MulticlassSpellSlotsWidgetProps) {
    const [classLevels, setClassLevels] = useState<ClassLevel[]>([
        { className: 'Wizard', level: 5, casterType: 'full' }
    ]);
    const [showConfig, setShowConfig] = useState(false);

    const casterLevel = calculateCasterLevel(classLevels);
    const slots = getSpellSlots(casterLevel);

    const handleAddClass = () => {
        const availableClasses = CASTER_CLASSES.filter(
            c => !classLevels.some(cl => cl.className === c.name)
        );
        if (availableClasses.length > 0) {
            setClassLevels([...classLevels, {
                className: availableClasses[0].name,
                level: 1,
                casterType: availableClasses[0].type
            }]);
        }
    };

    const handleRemoveClass = (index: number) => {
        if (classLevels.length > 1) {
            setClassLevels(classLevels.filter((_, i) => i !== index));
        }
    };

    const handleLevelChange = (index: number, delta: number) => {
        setClassLevels(classLevels.map((cl, i) => {
            if (i === index) {
                return { ...cl, level: Math.max(1, Math.min(20, cl.level + delta)) };
            }
            return cl;
        }));
    };

    const handleApply = () => {
        const newSlots: Record<number, { used: number; max: number }> = {};
        Object.entries(slots).forEach(([level, max]) => {
            const slotLevel = parseInt(level);
            const currentUsed = currentSlots?.[slotLevel]?.used ?? 0;
            newSlots[slotLevel] = { used: Math.min(currentUsed, max), max };
        });
        onSlotsCalculated(newSlots);
        setShowConfig(false);
    };

    return (
        <div className="glass-card p-6 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-xl border border-accent/30 shadow-lg">
                        <Wand2 size={18} className="text-accent-glow" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm text-white tracking-[0.2em] uppercase">Arcane Matrix</h3>
                        <p className="text-[9px] text-muted tracking-widest font-bold uppercase">Multiclass Resonance</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500
                        ${showConfig ? 'bg-accent text-white shadow-lg' : 'bg-white/5 text-phantom hover:bg-white/10'}`}
                >
                    {showConfig ? 'Lock Config' : 'Configure Matrix'}
                </button>
            </div>

            {/* Summary Information */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-6 relative z-10 group/summary">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/summary:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-[9px] text-muted font-black uppercase tracking-[0.3em] mb-2">Soul Composition</p>
                        <p className="text-lg font-display text-white tracking-widest uppercase">{formatClassLevels(classLevels)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-muted font-black uppercase tracking-[0.3em] mb-1">Effective Tier</p>
                        <div className="flex items-center justify-end gap-3">
                            <Sparkles size={16} className="text-accent-glow animate-pulse" />
                            <p className="text-3xl font-display text-white drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">{casterLevel}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculated Slots Preview */}
            <div className="flex flex-wrap gap-2.5 mb-6 relative z-10">
                {Object.entries(slots).map(([level, max]) => (
                    <div key={level} className="flex-1 min-w-[50px] text-center bg-white/[0.03] rounded-xl py-3 border border-white/5 group/slot hover:border-accent/40 hover:bg-accent/5 transition-all">
                        <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-1 group-hover/slot:text-accent">Lv{level}</p>
                        <p className="text-xl font-display text-white">{max}</p>
                    </div>
                ))}
            </div>

            {/* Configuration Panel */}
            <div className={`transition-all duration-700 overflow-hidden ${showConfig ? 'max-h-[500px] opacity-100 py-4 border-t border-white/5 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4">
                    {classLevels.map((cl, index) => (
                        <div key={index} className="flex items-center gap-4 bg-black/20 p-3 rounded-2xl border border-white/5 group/config">
                            <select
                                value={cl.className}
                                onChange={(e) => {
                                    const newClass = CASTER_CLASSES.find(c => c.name === e.target.value);
                                    if (newClass) {
                                        setClassLevels(classLevels.map((c, i) =>
                                            i === index ? { ...c, className: newClass.name, casterType: newClass.type } : c
                                        ));
                                    }
                                }}
                                className="flex-1 bg-transparent border-none text-sm text-white font-display uppercase tracking-widest focus:ring-0 cursor-pointer"
                            >
                                {CASTER_CLASSES.map(c => (
                                    <option key={c.name} value={c.name} className="bg-bg-dark">{c.name}</option>
                                ))}
                            </select>

                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-2 py-1">
                                <button
                                    onClick={() => handleLevelChange(index, -1)}
                                    className="p-1.5 text-muted hover:text-hp-critical transition-colors"
                                    aria-label="Decrease Level"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-6 text-center text-sm font-display text-white">{cl.level}</span>
                                <button
                                    onClick={() => handleLevelChange(index, 1)}
                                    className="p-1.5 text-muted hover:text-soul-green transition-colors"
                                    aria-label="Increase Level"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <div className="hidden sm:block text-[9px] text-muted font-black uppercase tracking-widest w-12 text-center">
                                {cl.casterType === 'full' ? '1.0x' : cl.casterType === 'half' ? '0.5x' : '0.3x'}
                            </div>

                            {classLevels.length > 1 && (
                                <button
                                    onClick={() => handleRemoveClass(index)}
                                    className="p-2 rounded-lg text-muted hover:text-hp-critical hover:bg-hp-critical/10 transition-all"
                                    aria-label="Remove Class"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleAddClass}
                            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-phantom hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                            disabled={classLevels.length >= CASTER_CLASSES.length}
                        >
                            <Plus size={14} />
                            Inject Essence
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 py-3 rounded-xl bg-accent text-white font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={14} className="animate-spin-slow" />
                            Synchronize
                        </button>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5 opacity-40">
                        <Ghost size={12} className="text-muted" />
                        <p className="text-[9px] text-muted uppercase tracking-widest font-black italic">
                            Resonance varies by affinity: Arcane (1.0), Divine (1.0), Martial (0.5/0.3)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

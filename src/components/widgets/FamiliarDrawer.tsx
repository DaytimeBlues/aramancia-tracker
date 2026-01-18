import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import { Bird, Bug, Cat, Eye, EyeOff, Feather, Fish, Heart, PawPrint, Shield, Skull, Sparkles, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    familiarDamaged,
    familiarDismissed,
    familiarHealed,
    familiarRecalled,
    familiarRenamed,
    familiarSummoned,
    selectFamiliar,
    toastShown
} from '../../store/slices/characterSlice';
import { FAMILIAR_FORMS, FAMILIAR_STATS } from '../../data/familiarStats';
import type { Familiar } from '../../types';

interface FamiliarDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const FORM_ICONS: Record<Familiar['form'], ComponentType<{ size?: number; className?: string }>> = {
    owl: Bird,
    cat: Cat,
    raven: Bird,
    bat: Bug,
    hawk: Bird,
    lizard: Bug,
    snake: Bug,
    octopus: Bug,
    spider: Bug,
    frog: Bug,
    crab: Bug,
    seahorse: Fish,
    fish: Fish,
    rat: Bug,
    weasel: Bug
};

export function FamiliarDrawer({ isOpen, onClose }: FamiliarDrawerProps) {
    const dispatch = useAppDispatch();
    const familiar = useAppSelector(selectFamiliar);
    const [selectedForm, setSelectedForm] = useState<Familiar['form']>('owl');
    const [name, setName] = useState('');

    const stats = useMemo(() => (familiar ? familiar : FAMILIAR_STATS[selectedForm]), [familiar, selectedForm]);

    if (!isOpen) return null;

    const handleSummon = () => {
        const base = FAMILIAR_STATS[selectedForm];
        dispatch(familiarSummoned({
            ...base,
            id: `familiar-${Date.now()}`,
            name: name || `My ${selectedForm}`,
            isActive: true,
            isInPocket: false
        }));
        dispatch(toastShown(`Summoned ${selectedForm} familiar!`));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md glass-card p-6 rounded-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Feather className="text-blue-400" />
                        {familiar ? familiar.name : 'Find Familiar'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {!familiar ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-5 gap-2">
                            {FAMILIAR_FORMS.map(form => {
                                const Icon = FORM_ICONS[form] || PawPrint;
                                return (
                                    <button
                                        key={form}
                                        onClick={() => setSelectedForm(form)}
                                        className={`flex flex-col items-center p-2 rounded-lg transition-all ${selectedForm === form ? 'bg-blue-500/30 ring-1 ring-blue-500' : 'hover:bg-slate-800'
                                            }`}
                                    >
                                        <Icon size={20} className={selectedForm === form ? 'text-blue-400' : 'text-slate-400'} />
                                        <span className="text-[10px] mt-1 capitalize text-slate-300">{form}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <input
                            type="text"
                            placeholder="Name your familiar..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSummon}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2"
                        >
                            <Sparkles size={20} />
                            Summon Familiar
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Current Familiar Stats/Actions */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-blue-300">
                                {(() => {
                                    const Icon = FORM_ICONS[familiar.form] || PawPrint;
                                    return <Icon size={32} />;
                                })()}
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-bold">{familiar.name}</div>
                                <div className="text-slate-400 text-sm capitalize">{familiar.form}</div>
                                <div className="flex gap-4 mt-1">
                                    <div className="flex items-center gap-1 text-red-400">
                                        <Heart size={14} /> {familiar.hp}/{familiar.maxHp}
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-400">
                                        <Shield size={14} /> AC {familiar.ac}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => dispatch(familiarDamaged(1))}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-900/30 text-red-300 border border-red-500/20 hover:bg-red-900/40"
                            >
                                <Skull size={18} /> Damage
                            </button>
                            <button
                                onClick={() => dispatch(familiarHealed(1))}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-900/30 text-green-300 border border-green-500/20 hover:bg-green-900/40"
                            >
                                <Heart size={18} /> Heal
                            </button>
                            <button
                                onClick={() => dispatch(familiarDismissed())}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                                disabled={!familiar.isActive || familiar.isInPocket}
                            >
                                <EyeOff size={18} /> Dismiss
                            </button>
                            <button
                                onClick={() => dispatch(familiarRecalled())}
                                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-900/30 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-900/40 disabled:opacity-50"
                                disabled={!familiar.isActive || !familiar.isInPocket}
                            >
                                <Eye size={18} /> Recall
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

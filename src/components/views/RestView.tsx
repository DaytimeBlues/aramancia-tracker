import { Tent, Moon, Sun, Sparkles } from 'lucide-react';

interface RestViewProps {
    onShortRest: () => void;
    onLongRest: () => void;
}

export function RestView({ onShortRest, onLongRest }: RestViewProps) {
    return (
        <div className="pb-20 flex flex-col items-center justify-center h-full min-h-[60vh]">
            <div className="text-center mb-10">
                <div className="relative inline-block mb-4">
                    <Tent size={48} className="text-parchment" />
                    <Sparkles size={16} className="text-accent absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h2 className="font-display text-2xl text-parchment-light tracking-wider mb-2">Rest & Recovery</h2>
                <p className="text-sm text-muted max-w-xs mx-auto">
                    Choose a rest type to recover hit points and spell slots.
                </p>
            </div>

            <div className="w-full space-y-4">
                {/* Short Rest */}
                <button
                    onClick={onShortRest}
                    className="w-full card-parchment p-5 text-left group transition-all hover:shadow-[0_0_20px_rgba(212,184,150,0.1)]"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-card-elevated rounded-full border border-parchment-dark/30 group-hover:border-accent/50 transition-colors">
                            <Sun size={24} className="text-parchment group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                            <h3 className="font-display text-lg text-parchment-light group-hover:text-accent transition-colors tracking-wider">
                                Short Rest
                            </h3>
                            <p className="text-xs text-muted">Use Hit Dice to heal</p>
                        </div>
                    </div>
                </button>

                {/* Long Rest */}
                <button
                    onClick={() => {
                        if (confirm("Take a Long Rest? This will reset HP, Spell Slots, and Hit Dice.")) {
                            onLongRest();
                        }
                    }}
                    className="w-full card-parchment p-5 text-left group transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-card-elevated rounded-full border border-parchment-dark/30 group-hover:border-accent/50 group-hover:bg-accent/10 transition-colors">
                            <Moon size={24} className="text-parchment group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                            <h3 className="font-display text-lg text-parchment-light group-hover:text-accent transition-colors tracking-wider">
                                Long Rest
                            </h3>
                            <p className="text-xs text-muted">Reset HP, Slots & Abilities</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

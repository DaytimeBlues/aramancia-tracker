import { Skull, Minus, Plus } from 'lucide-react';

interface HealthWidgetProps {
    current: number;
    max: number;
    onChange: (newCurrent: number) => void;
}

export function HealthWidget({ current, max, onChange }: HealthWidgetProps) {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const isLow = percentage <= 25;
    const isCritical = current === 0;

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Skull size={18} className="text-accent" />
                <h3 className="font-display text-sm text-parchment tracking-wider">Hit Points</h3>
            </div>

            <div className="flex items-center gap-6">
                {/* Circular HP Display */}
                <div className={`stat-circle ${isCritical ? 'border-red-500' : ''} ${isLow ? 'border-orange-500' : ''}`}>
                    <div className="text-center">
                        <span className={`font-display text-2xl ${isCritical ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-parchment-light'}`}>
                            {current}
                        </span>
                        <span className="text-muted text-sm">/{max}</span>
                    </div>
                </div>

                {/* HP Bar and Controls */}
                <div className="flex-1">
                    {/* Progress Bar */}
                    <div className="h-2 bg-card-elevated rounded-full overflow-hidden mb-3 border border-parchment-dark/20">
                        <div
                            className={`h-full transition-all duration-300 ease-out rounded-full ${isCritical ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-accent'
                                }`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* +/- Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onChange(current - 1)}
                            className="btn-fantasy flex-1 flex items-center justify-center py-2"
                        >
                            <Minus size={16} />
                        </button>
                        <button
                            onClick={() => onChange(current + 1)}
                            className="btn-fantasy flex-1 flex items-center justify-center py-2"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


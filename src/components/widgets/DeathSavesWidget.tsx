import { Heart, Skull } from 'lucide-react';

interface DeathSavesWidgetProps {
    successes: number;
    failures: number;
    onChange: (type: 'successes' | 'failures', value: number) => void;
}

export function DeathSavesWidget({ successes, failures, onChange }: DeathSavesWidgetProps) {
    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Skull size={18} className="text-muted" />
                <h3 className="font-display text-sm text-parchment tracking-wider">Death Saves</h3>
            </div>

            <div className="flex justify-between gap-6">
                {/* Successes */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Heart size={14} className="text-accent" />
                        <span className="text-xs text-accent uppercase tracking-wider">Success</span>
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <button
                                key={i}
                                onClick={() => onChange('successes', i === successes ? i - 1 : i)}
                                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${i <= successes
                                        ? 'bg-accent border-accent shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                                        : 'bg-transparent border-parchment-dark/40 hover:border-accent/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-parchment-dark/20" />

                {/* Failures */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Skull size={14} className="text-red-400" />
                        <span className="text-xs text-red-400 uppercase tracking-wider">Failure</span>
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <button
                                key={i}
                                onClick={() => onChange('failures', i === failures ? i - 1 : i)}
                                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${i <= failures
                                        ? 'bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                        : 'bg-transparent border-parchment-dark/40 hover:border-red-500/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


import { Sword, Scroll } from 'lucide-react';

export type ViewMode = 'combat' | 'roleplay';

interface ModeToggleProps {
    mode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
}

/**
 * ModeToggle - Context switcher between Combat and Role-Play dashboards.
 * 
 * WHY: Krug's "Don't Make Me Think" principle applied via clear iconography
 * and prominent placement. The toggle provides instant context switching
 * without requiring users to navigate menus or remember where things are.
 */
export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
    return (
        <div className="flex bg-card-elevated/50 p-1 rounded-full border border-white/10 shadow-inner backdrop-blur-md">
            <button
                onClick={() => onModeChange('combat')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${mode === 'combat'
                    ? 'bg-accent text-bg-dark shadow-lg shadow-accent/20'
                    : 'text-muted hover:text-parchment'
                    }`}
                aria-label="Combat Mode"
            >
                <Sword size={14} className={mode === 'combat' ? 'animate-pulse' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Combat</span>
            </button>
            <button
                onClick={() => onModeChange('roleplay')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${mode === 'roleplay'
                    ? 'bg-parchment text-bg-dark shadow-lg shadow-parchment/20'
                    : 'text-muted hover:text-parchment'
                    }`}
                aria-label="Roleplay Mode"
            >
                <Scroll size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Roleplay</span>
            </button>
        </div>
    );
}

/**
 * WizardModeContext.tsx
 *
 * WHY: Manages the "Preparation" vs "Execution" mode for the Wizard UI.
 * - "Preparation" (Study) Mode: Full library view, manage prepared spells.
 * - "Execution" (Combat) Mode: Filtered view, only prepared spells, panic buttons.
 *
 * Design Rationale (from Design Guide):
 * - Wizards are "architects" of combat. The UI must reduce cognitive load
 *   by hiding irrelevant spells during combat (State Pattern).
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type WizardMode = 'preparation' | 'execution';

interface WizardModeContextValue {
    mode: WizardMode;
    setMode: (mode: WizardMode) => void;
    toggleMode: () => void;
    isPreparationMode: boolean;
    isExecutionMode: boolean;
}

const WizardModeContext = createContext<WizardModeContextValue | undefined>(undefined);

interface WizardModeProviderProps {
    children: ReactNode;
    initialMode?: WizardMode;
}

export const WizardModeProvider: React.FC<WizardModeProviderProps> = ({
    children,
    initialMode = 'preparation',
}) => {
    const [mode, setModeState] = useState<WizardMode>(initialMode);

    const setMode = useCallback((newMode: WizardMode) => {
        setModeState(newMode);
    }, []);

    const toggleMode = useCallback(() => {
        setModeState((prev) => (prev === 'preparation' ? 'execution' : 'preparation'));
    }, []);

    const value: WizardModeContextValue = {
        mode,
        setMode,
        toggleMode,
        isPreparationMode: mode === 'preparation',
        isExecutionMode: mode === 'execution',
    };

    return (
        <WizardModeContext.Provider value={value}>
            {children}
        </WizardModeContext.Provider>
    );
};

/**
 * Hook to access the Wizard Mode context.
 * Throws an error if used outside of a WizardModeProvider.
 */
export function useWizardMode(): WizardModeContextValue {
    const context = useContext(WizardModeContext);
    if (context === undefined) {
        throw new Error('useWizardMode must be used within a WizardModeProvider');
    }
    return context;
}

export default WizardModeContext;

import type { Minion } from './index';

// Concentration state
export interface ConcentrationState {
    spellId: string;
    spellName: string;
    startRound: number;
    maxDurationRounds?: number;
}

// Combat phase for state machine
export type CombatPhase = 'idle' | 'casting' | 'resolving' | 'minion_turn';

// Casting state machine
export type CastingStep =
    | 'idle'
    | 'select_spell'
    | 'confirm_slot'
    | 'choose_targets'
    | 'resolve'
    | 'apply_effects'
    | 'complete';

export interface CastingState {
    step: CastingStep;
    spellId: string | null;
    slotLevel: number | null;
    resolutionMode: 'attack' | 'save' | 'automatic' | null;
}

export interface CombatSliceState {
    phase: CombatPhase;
    currentRound: number;
    turn: number; // Current index in initiativeOrder
    currentActorId: string | null;
    initiativeOrder: string[]; // List of IDs (Character + Minions + Enemies)

    // Concentration tracking
    activeConcentration: ConcentrationState | null;
    concentrationDC: number | null; // Set when damage taken

    // Minions (using EntityAdapter state shape)
    minions: {
        ids: string[];
        entities: Record<string, Minion>;
    };

    // Casting state machine
    casting: CastingState;
}

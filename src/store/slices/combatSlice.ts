import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../index';
import { slotExpended } from './spellbookSlice';
import type { Minion } from '../../types';

// Re-export Minion type for consumers of this slice
export type { Minion };

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

const minionAdapter = createEntityAdapter<Minion>();

export interface CombatState {
    phase: CombatPhase;
    currentRound: number;

    // Concentration tracking
    activeConcentration: ConcentrationState | null;
    concentrationCheckDC: number | null; // Set when damage taken

    // Initiative tracking
    initiatives: Record<string, number>; // { [actorId]: value }
    initiativeOrder: string[]; // sorted actor IDs
    currentTurnIndex: number;

    // Minions (using EntityAdapter)
    minions: ReturnType<typeof minionAdapter.getInitialState>;

    // Casting state machine
    casting: CastingState;
}

const initialState: CombatState = {
    phase: 'idle',
    currentRound: 1,

    activeConcentration: null,
    concentrationCheckDC: null,

    initiatives: {},
    initiativeOrder: [],
    currentTurnIndex: 0,

    minions: minionAdapter.getInitialState(),

    casting: {
        step: 'idle',
        spellId: null,
        slotLevel: null,
        resolutionMode: null,
    },
};

export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        // === Initiative Management ===
        initiativeSet: (state, action: PayloadAction<{ id: string; value: number }>) => {
            state.initiatives[action.payload.id] = action.payload.value;

            // Re-sort initiative order
            state.initiativeOrder = Object.entries(state.initiatives)
                .sort(([, a], [, b]) => b - a) // Highest first
                .map(([id]) => id);
        },

        initiativeCleared: (state) => {
            state.initiatives = {};
            state.initiativeOrder = [];
            state.currentTurnIndex = 0;
        },

        initiativeRemoved: (state, action: PayloadAction<string>) => {
            delete state.initiatives[action.payload];
            state.initiativeOrder = state.initiativeOrder.filter(id => id !== action.payload);
        },

        // === Concentration Management ===
        concentrationStarted: (state, action: PayloadAction<{ spellId: string; spellName: string; maxDurationRounds?: number }>) => {
            // Starting a new concentration spell ends any existing one
            state.activeConcentration = {
                spellId: action.payload.spellId,
                spellName: action.payload.spellName,
                startRound: state.currentRound,
                maxDurationRounds: action.payload.maxDurationRounds,
            };
            state.concentrationCheckDC = null;
        },

        concentrationBroken: (state) => {
            state.activeConcentration = null;
            state.concentrationCheckDC = null;
        },

        concentrationCheckRequired: (state, action: PayloadAction<{ damage: number }>) => {
            // DC = max(10, damage / 2)
            const dc = Math.max(10, Math.floor(action.payload.damage / 2));
            state.concentrationCheckDC = dc;
        },

        concentrationCheckResolved: (state, action: PayloadAction<{ passed: boolean }>) => {
            if (!action.payload.passed) {
                state.activeConcentration = null;
            }
            state.concentrationCheckDC = null;
        },

        // === Minion Management ===
        minionsHydrated: (state, action: PayloadAction<Minion[]>) => {
            minionAdapter.setAll(state.minions, action.payload);
            state.initiativeOrder = action.payload.map(minion => minion.id);
            state.currentTurnIndex = 0;
        },
        minionAdded: (state, action: PayloadAction<Minion>) => {
            minionAdapter.addOne(state.minions, action.payload);
            // Fallback initiative for minions if not present
            if (state.initiatives[action.payload.id] === undefined) {
                state.initiatives[action.payload.id] = 10; // Default flat 10 for minions
                state.initiativeOrder = Object.entries(state.initiatives)
                    .sort(([, a], [, b]) => b - a)
                    .map(([id]) => id);
            }
        },

        minionRemoved: (state, action: PayloadAction<string>) => {
            minionAdapter.removeOne(state.minions, action.payload);
            delete state.initiatives[action.payload];
            state.initiativeOrder = state.initiativeOrder.filter(id => id !== action.payload);
        },

        minionUpdated: (state, action: PayloadAction<{ id: string; changes: Partial<Minion> }>) => {
            minionAdapter.updateOne(state.minions, {
                id: action.payload.id,
                changes: action.payload.changes,
            });
        },

        minionDamaged: (state, action: PayloadAction<{ id: string; damage: number }>) => {
            const minion = state.minions.entities[action.payload.id];
            if (minion) {
                const newHp = Math.max(0, minion.hp - action.payload.damage);
                minionAdapter.updateOne(state.minions, {
                    id: action.payload.id,
                    changes: { hp: newHp },
                });
            }
        },

        minionHealed: (state, action: PayloadAction<{ id: string; healing: number }>) => {
            const minion = state.minions.entities[action.payload.id];
            if (minion) {
                const newHp = Math.min(minion.maxHp, minion.hp + action.payload.healing);
                minionAdapter.updateOne(state.minions, {
                    id: action.payload.id,
                    changes: { hp: newHp },
                });
            }
        },

        allMinionsCleared: (state) => {
            minionAdapter.removeAll(state.minions);
            // Keep only player initiative if present
            const playerInit = state.initiatives['player'];
            state.initiatives = playerInit !== undefined ? { 'player': playerInit } : {};
            state.initiativeOrder = playerInit !== undefined ? ['player'] : [];
            state.currentTurnIndex = 0;
        },

        // === Turn Management ===
        combatStarted: (state) => {
            state.phase = 'idle';
            state.currentRound = 1;
            state.currentTurnIndex = 0;
            // Note: Initiatives should be rolled/set before/during start
        },

        turnAdvanced: (state) => {
            if (state.initiativeOrder.length > 0) {
                const prevIndex = state.currentTurnIndex;
                state.currentTurnIndex = (state.currentTurnIndex + 1) % state.initiativeOrder.length;

                // New round if we've cycled back to the start
                if (state.currentTurnIndex === 0 && state.initiativeOrder.length > 1) {
                    state.currentRound += 1;
                } else if (state.currentTurnIndex <= prevIndex && state.initiativeOrder.length > 0) {
                    // This handles cases where items might have been removed
                    state.currentRound += 1;
                }
            }
        },

        combatEnded: (state) => {
            state.phase = 'idle';
            state.currentRound = 1;
            state.currentTurnIndex = 0;
            state.activeConcentration = null;
            state.concentrationCheckDC = null;
        },

        // === Casting State Machine ===
        castingStarted: (state, action: PayloadAction<{ spellId: string }>) => {
            state.phase = 'casting';
            state.casting = {
                step: 'select_spell',
                spellId: action.payload.spellId,
                slotLevel: null,
                resolutionMode: null,
            };
        },

        slotConfirmed: (state, action: PayloadAction<{ slotLevel: number; resolutionMode: 'attack' | 'save' | 'automatic' }>) => {
            state.casting.step = 'resolve';
            state.casting.slotLevel = action.payload.slotLevel;
            state.casting.resolutionMode = action.payload.resolutionMode;
            state.phase = 'resolving';
        },

        castingResolved: (state) => {
            state.casting.step = 'apply_effects';
        },

        castingCompleted: (state) => {
            state.casting = {
                step: 'idle',
                spellId: null,
                slotLevel: null,
                resolutionMode: null,
            };
            state.phase = 'idle';
        },

        castingCancelled: (state) => {
            state.casting = {
                step: 'idle',
                spellId: null,
                slotLevel: null,
                resolutionMode: null,
            };
            state.phase = 'idle';
        },
    },
});

// Export actions
export const {
    initiativeSet,
    initiativeCleared,
    initiativeRemoved,
    concentrationStarted,
    concentrationBroken,
    concentrationCheckRequired,
    concentrationCheckResolved,
    minionAdded,
    minionRemoved,
    minionUpdated,
    minionDamaged,
    minionHealed,
    allMinionsCleared,
    minionsHydrated,
    combatStarted,
    turnAdvanced,
    combatEnded,
    castingStarted,
    slotConfirmed,
    castingResolved,
    castingCompleted,
    castingCancelled,
} = combatSlice.actions;

/**
 * Complete the cast and spend a slot if needed.
 *
 * Notes:
 * - `castingCompleted` is a pure reducer; this thunk performs the cross-slice side effect.
 * - This is intentionally conservative: it only spends when `slotLevel > 0`.
 */
export const castingCompletedWithSlot = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const slotLevel = state.combat.casting.slotLevel ?? 0;

    // Cantrips (0) and unknown values do not expend slots.
    if (slotLevel > 0) {
        dispatch(slotExpended({ level: slotLevel }));
    }

    dispatch(castingCompleted());
};

// Selectors
export const minionSelectors = minionAdapter.getSelectors();
export const selectAllMinions = (state: RootState) => minionSelectors.selectAll(state.combat.minions);
export const selectMinionById = (id: string) => (state: RootState) =>
    minionSelectors.selectById(state.combat.minions, id);
export const selectMinionCount = (state: RootState) => minionSelectors.selectTotal(state.combat.minions);

export default combatSlice.reducer;

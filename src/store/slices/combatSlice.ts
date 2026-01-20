import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { slotExpended } from './spellbookSlice';
import type { Minion } from '../../types';
import type {
    CombatSliceState,
    ConcentrationState,
    CombatPhase,
    CastingState,
    CastingStep
} from '../../types/combat';
import type { RootState, AppDispatch } from '../../store';

// We avoid importing RootState/AppDispatch from '../index' to prevent circular dependencies
// which corrupt type inference for the slice actions and status.

// Re-export types for consumers
export type { Minion, CombatSliceState, ConcentrationState, CombatPhase, CastingState, CastingStep };

const minionAdapter = createEntityAdapter<Minion>();

const initialState: CombatSliceState = {
    phase: 'idle',
    currentRound: 1,
    turn: 0,
    currentActorId: null,
    initiativeOrder: [],

    activeConcentration: null,
    concentrationDC: null,

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
        // === Concentration Management ===
        concentrationStarted: (state, action: PayloadAction<{ spellId: string; spellName: string; maxDurationRounds?: number }>) => {
            // Starting a new concentration spell ends any existing one
            state.activeConcentration = {
                spellId: action.payload.spellId,
                spellName: action.payload.spellName,
                startRound: state.currentRound,
                maxDurationRounds: action.payload.maxDurationRounds,
            };
            state.concentrationDC = null;
        },

        concentrationBroken: (state) => {
            state.activeConcentration = null;
            state.concentrationDC = null;
        },

        checkRequired: (state, action: PayloadAction<{ damage: number }>) => {
            // DC = max(10, damage / 2)
            const dc = Math.max(10, Math.floor(action.payload.damage / 2));
            state.concentrationDC = dc;
        },

        checkResolved: (state, action: PayloadAction<{ passed: boolean }>) => {
            if (!action.payload.passed) {
                state.activeConcentration = null;
            }
            state.concentrationDC = null;
        },

        // === Minion Management ===
        minionsHydrated: (state, action: PayloadAction<Minion[]>) => {
            minionAdapter.setAll(state.minions, action.payload);
        },
        minionAdded: (state, action: PayloadAction<Minion>) => {
            minionAdapter.addOne(state.minions, action.payload);
        },

        minionRemoved: (state, action: PayloadAction<string>) => {
            minionAdapter.removeOne(state.minions, action.payload);
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

        minionConditionToggled: (state, action: PayloadAction<{ id: string; condition: string }>) => {
            const minion = state.minions.entities[action.payload.id];
            if (minion) {
                const { condition } = action.payload;
                const currentConditions = minion.conditions || [];
                const hasCondition = currentConditions.includes(condition);

                const newConditions = hasCondition
                    ? currentConditions.filter(c => c !== condition)
                    : [...currentConditions, condition];

                minionAdapter.updateOne(state.minions, {
                    id: action.payload.id,
                    changes: { conditions: newConditions },
                });
            }
        },

        allMinionsCleared: (state) => {
            minionAdapter.removeAll(state.minions);
        },

        // === Turn Management ===
        combatStarted: (state, action: PayloadAction<{ initiativeOrder: string[] }>) => {
            state.phase = 'idle';
            state.currentRound = 1;
            state.turn = 0;
            state.initiativeOrder = action.payload.initiativeOrder;
            state.currentActorId = action.payload.initiativeOrder[0] || null;
        },

        turnAdvanced: (state) => {
            if (state.initiativeOrder.length === 0) return;

            const nextTurn = state.turn + 1;
            if (nextTurn >= state.initiativeOrder.length) {
                state.currentRound += 1;
                state.turn = 0;
            } else {
                state.turn = nextTurn;
            }
            state.currentActorId = state.initiativeOrder[state.turn];
        },

        combatEnded: (state) => {
            state.phase = 'idle';
            state.currentRound = 1;
            state.turn = 0;
            state.currentActorId = null;
            state.initiativeOrder = [];
            state.activeConcentration = null;
            state.concentrationDC = null;
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
    minionConditionToggled,
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
    minionAdded,
    minionRemoved,
    minionUpdated,
    minionDamaged,
    minionHealed,
    concentrationStarted,
    concentrationBroken,
    checkRequired,
    checkResolved,
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

/**
 * Start combat with a set of combatants and initiatives.
 */
export const startCombatWithInitiative = (playerInitiative: number) => (dispatch: AppDispatch) => {
    const combatants = [
        { id: 'player', initiative: playerInitiative },
    ];

    const sortedIds = combatants
        .sort((a, b) => b.initiative - a.initiative)
        .map(c => c.id);

    dispatch(combatStarted({ initiativeOrder: sortedIds }));
};

// Selectors
export const minionSelectors = minionAdapter.getSelectors();
export const selectAllMinions = (state: RootState) => minionSelectors.selectAll(state.combat.minions);
export const selectMinionById = (id: string) => (state: RootState) =>
    minionSelectors.selectById(state.combat.minions, id);
export const selectMinionCount = (state: RootState) => minionSelectors.selectTotal(state.combat.minions);

export default combatSlice.reducer;

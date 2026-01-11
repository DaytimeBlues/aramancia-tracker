import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
}

export interface ConcentrationState {
  casterId: string;
  spellVariantId: string;
  startTime: number;
  source?: string;
}

export interface DamageEvent {
  targetId: string;
  amount: number;
  timestamp: number;
}

export interface PendingConcentrationCheck {
  casterId: string;
  spellVariantId: string;
  dc: number;
}

export interface CombatState {
  turnOrder: Combatant[];
  currentTurn: number;
  round: number;
  concentration: ConcentrationState | null;
  conditions: Record<string, string[]>;
  minions: string[];
  damageEvents: DamageEvent[];
  pendingConcentrationCheck: PendingConcentrationCheck | null;
}

const initialState: CombatState = {
  turnOrder: [],
  currentTurn: 0,
  round: 1,
  concentration: null,
  conditions: {},
  minions: [],
  damageEvents: [],
  pendingConcentrationCheck: null,
};

const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    setTurnOrder(state, action: PayloadAction<Combatant[]>) {
      state.turnOrder = action.payload;
    },
    advanceTurn(state) {
      if (state.turnOrder.length === 0) {
        return;
      }
      const nextTurn = (state.currentTurn + 1) % state.turnOrder.length;
      state.currentTurn = nextTurn;
      if (nextTurn === 0) {
        state.round += 1;
      }
    },
    setActiveConcentration(state, action: PayloadAction<ConcentrationState>) {
      state.concentration = action.payload;
      state.pendingConcentrationCheck = null;
    },
    clearConcentration(state) {
      state.concentration = null;
      state.pendingConcentrationCheck = null;
    },
    addCondition(
      state,
      action: PayloadAction<{ combatantId: string; condition: string }>,
    ) {
      const { combatantId, condition } = action.payload;
      const current = state.conditions[combatantId] ?? [];
      state.conditions[combatantId] = [...current, condition];
    },
    removeCondition(
      state,
      action: PayloadAction<{ combatantId: string; condition: string }>,
    ) {
      const { combatantId, condition } = action.payload;
      const current = state.conditions[combatantId] ?? [];
      state.conditions[combatantId] = current.filter((entry) => entry !== condition);
    },
    addMinion(state, action: PayloadAction<string>) {
      state.minions = [...state.minions, action.payload];
    },
    removeMinion(state, action: PayloadAction<string>) {
      state.minions = state.minions.filter((id) => id !== action.payload);
    },
    recordDamage(state, action: PayloadAction<{ targetId: string; amount: number }>) {
      state.damageEvents = [
        ...state.damageEvents,
        { ...action.payload, timestamp: Date.now() },
      ];
    },
    setPendingConcentrationCheck(
      state,
      action: PayloadAction<PendingConcentrationCheck>,
    ) {
      state.pendingConcentrationCheck = action.payload;
    },
    clearPendingConcentrationCheck(state) {
      state.pendingConcentrationCheck = null;
    },
    resetCombat(state) {
      state.turnOrder = [];
      state.currentTurn = 0;
      state.round = 1;
      state.concentration = null;
      state.conditions = {};
      state.minions = [];
      state.damageEvents = [];
      state.pendingConcentrationCheck = null;
    },
  },
});

export const {
  setTurnOrder,
  advanceTurn,
  setActiveConcentration,
  clearConcentration,
  addCondition,
  removeCondition,
  addMinion,
  removeMinion,
  recordDamage,
  setPendingConcentrationCheck,
  clearPendingConcentrationCheck,
  resetCombat,
} = combatSlice.actions;

export default combatSlice.reducer;

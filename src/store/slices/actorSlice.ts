/**
 * V3.0 Redux Store - Actor Slice
 * Actor metadata: level, class, proficiency, etc.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ActorState } from '../../types/v3';

const initialState: ActorState = {
  id: 'player-character',
  name: 'Character',
  level: 5,
  class: 'Wizard',
  proficiencyBonus: 3,
  hitDieSize: 6,
  spellcastingAbility: 'int',
  preparedSpellIds: [],
  activeEffectIds: [],
  baseAttributes: {
    str: 8,
    dex: 14,
    con: 14,
    int: 17,
    wis: 15,
    cha: 10,
  },
  overrides: {},
};

export const actorSlice = createSlice({
  name: 'actor',
  initialState,
  reducers: {
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
      // Proficiency bonus recalculated via selector
    },
    setAttribute: (state, action: PayloadAction<{ ability: keyof ActorState['baseAttributes']; value: number }>) => {
      state.baseAttributes[action.payload.ability] = action.payload.value;
    },
    setClass: (state, action: PayloadAction<{ class: string; hitDieSize: number }>) => {
      state.class = action.payload.class;
      state.hitDieSize = action.payload.hitDieSize;
    },
    setSpellcastingAbility: (state, action: PayloadAction<'int' | 'wis' | 'cha'>) => {
      state.spellcastingAbility = action.payload;
    },
    prepareSpell: (state, action: PayloadAction<string>) => {
      if (!state.preparedSpellIds.includes(action.payload)) {
        state.preparedSpellIds.push(action.payload);
      }
    },
    unprepareSpell: (state, action: PayloadAction<string>) => {
      state.preparedSpellIds = state.preparedSpellIds.filter(id => id !== action.payload);
    },
    addActiveEffect: (state, action: PayloadAction<string>) => {
      if (!state.activeEffectIds.includes(action.payload)) {
        state.activeEffectIds.push(action.payload);
      }
    },
    removeActiveEffect: (state, action: PayloadAction<string>) => {
      state.activeEffectIds = state.activeEffectIds.filter(id => id !== action.payload);
    },
    setOverride: (state, action: PayloadAction<{ key: keyof NonNullable<ActorState['overrides']>; value: number | undefined }>) => {
      if (!state.overrides) state.overrides = {};
      if (action.payload.value === undefined) {
        delete state.overrides[action.payload.key];
      } else {
        (state.overrides as any)[action.payload.key] = action.payload.value;
      }
    },
  },
});

export const {
  setLevel,
  setAttribute,
  setClass,
  setSpellcastingAbility,
  prepareSpell,
  unprepareSpell,
  addActiveEffect,
  removeActiveEffect,
  setOverride,
} = actorSlice.actions;

export default actorSlice.reducer;

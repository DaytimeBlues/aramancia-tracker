/**
 * V3.0 Redux Store - Concentration Slice
 * Concentration state and prompt handling
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ConcentrationState, ConcentrationPrompt } from '../../types/v3';

interface ConcentrationSliceState {
  current: ConcentrationState;
  prompt: ConcentrationPrompt | null;
}

const initialState: ConcentrationSliceState = {
  current: {
    active: false,
    effectIds: [],
  },
  prompt: null,
};

export const concentrationSlice = createSlice({
  name: 'concentration',
  initialState,
  reducers: {
    startConcentration: (state, action: PayloadAction<{ spellId: string; spellName: string; effectIds?: string[] }>) => {
      state.current = {
        active: true,
        spellId: action.payload.spellId,
        spellName: action.payload.spellName,
        effectIds: action.payload.effectIds || [],
      };
    },
    endConcentration: (state) => {
      state.current = {
        active: false,
        effectIds: [],
      };
    },
    showConcentrationPrompt: (state, action: PayloadAction<ConcentrationPrompt>) => {
      state.prompt = action.payload;
    },
    hideConcentrationPrompt: (state) => {
      state.prompt = null;
    },
  },
});

export const {
  startConcentration,
  endConcentration,
  showConcentrationPrompt,
  hideConcentrationPrompt,
} = concentrationSlice.actions;

export default concentrationSlice.reducer;

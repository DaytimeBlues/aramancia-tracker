/**
 * V3.0 Redux Store - Effects Slice
 * Active effects that modify character stats
 */

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { ActiveEffect } from '../../types/v3';
import type { RootState } from '../store';

// Create entity adapter for effects
export const effectsAdapter = createEntityAdapter<ActiveEffect>({
  selectId: (effect) => effect.id,
});

// Initial state
const initialState = effectsAdapter.getInitialState();

// Create slice
export const effectsSlice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    effectAdded: effectsAdapter.addOne,
    effectsAdded: effectsAdapter.addMany,
    effectUpdated: effectsAdapter.updateOne,
    effectRemoved: effectsAdapter.removeOne,
    effectsCleared: effectsAdapter.removeAll,
  },
});

// Export actions
export const {
  effectAdded,
  effectsAdded,
  effectUpdated,
  effectRemoved,
  effectsCleared,
} = effectsSlice.actions;

// Export selectors
export const effectsSelectors = effectsAdapter.getSelectors<RootState>(
  (state) => state.effects
);

// Export reducer
export default effectsSlice.reducer;

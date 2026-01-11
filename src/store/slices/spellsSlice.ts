/**
 * V3.0 Redux Store - Spells Slice
 * Normalized spell entities with RTK entity adapter
 */

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { Spell } from '../../types/v3';
import type { RootState } from '../store';

// Create entity adapter for spells
export const spellsAdapter = createEntityAdapter<Spell>({
  selectId: (spell) => spell.id,
  sortComparer: (a, b) => {
    // Sort by level, then by name
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name);
  },
});

// Initial state
const initialState = spellsAdapter.getInitialState();

// Create slice
export const spellsSlice = createSlice({
  name: 'spells',
  initialState,
  reducers: {
    spellAdded: spellsAdapter.addOne,
    spellsAdded: spellsAdapter.addMany,
    spellUpdated: spellsAdapter.updateOne,
    spellRemoved: spellsAdapter.removeOne,
    spellsCleared: spellsAdapter.removeAll,
  },
});

// Export actions
export const {
  spellAdded,
  spellsAdded,
  spellUpdated,
  spellRemoved,
  spellsCleared,
} = spellsSlice.actions;

// Export selectors
export const spellsSelectors = spellsAdapter.getSelectors<RootState>(
  (state) => state.spells
);

// Export reducer
export default spellsSlice.reducer;

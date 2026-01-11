/**
 * Spells Slice - Normalized Entity Storage
 * 
 * This slice manages the central spell repository using RTK's createEntityAdapter.
 * Spells are stored by ID in a normalized structure for efficient lookups and updates.
 * 
 * Key concepts:
 * - Normalized state: Spells stored once, referenced by ID elsewhere
 * - Entity adapter: Provides CRUD operations and selectors
 * - Immutable updates: RTK uses Immer for safe mutations
 */

import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import type { NormalizedSpell } from '../types/spellSchema';
import type { RootState } from '../store';

/**
 * Entity adapter for normalized spell storage
 * Provides:
 * - Normalized state shape: { ids: string[], entities: Record<string, NormalizedSpell> }
 * - CRUD methods: addOne, addMany, updateOne, removeOne, etc.
 * - Selectors: selectAll, selectById, selectIds, selectEntities, selectTotal
 */
const spellsAdapter = createEntityAdapter<NormalizedSpell>({
  // Sort spells by level, then alphabetically
  sortComparer: (a, b) => {
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return a.name.localeCompare(b.name);
  },
});

/**
 * Initial state using adapter
 */
const initialState = spellsAdapter.getInitialState({
  // Additional state beyond the normalized entities
  loading: false,
  error: null as string | null,
});

/**
 * Spells slice
 */
const spellsSlice = createSlice({
  name: 'spells',
  initialState,
  reducers: {
    // Add a single spell
    spellAdded: spellsAdapter.addOne,
    
    // Add multiple spells (bulk import)
    spellsAdded: spellsAdapter.addMany,
    
    // Update a spell
    spellUpdated: spellsAdapter.updateOne,
    
    // Remove a spell
    spellRemoved: spellsAdapter.removeOne,
    
    // Set all spells (replace entire collection)
    spellsSet: spellsAdapter.setAll,
    
    // Set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    
    // Set error state
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

/**
 * Export actions
 */
export const {
  spellAdded,
  spellsAdded,
  spellUpdated,
  spellRemoved,
  spellsSet,
  setLoading,
  setError,
} = spellsSlice.actions;

/**
 * Export reducer
 */
export default spellsSlice.reducer;

/**
 * Export selectors provided by the adapter
 * These are base selectors that read directly from state
 */
export const spellsSelectors = spellsAdapter.getSelectors<RootState>(
  (state) => state.spells
);

/**
 * Named exports for common selectors
 */
export const {
  selectAll: selectAllSpells,
  selectById: selectSpellById,
  selectIds: selectSpellIds,
  selectEntities: selectSpellEntities,
  selectTotal: selectTotalSpells,
} = spellsSelectors;

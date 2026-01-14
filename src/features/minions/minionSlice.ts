import { createSlice, type PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';
import type { Minion } from './minionSchema';

export const minionsAdapter = createEntityAdapter<Minion>();

const initialState = minionsAdapter.getInitialState({
  isLoading: false,
});

export const minionSlice = createSlice({
  name: 'minions',
  initialState,
  reducers: {
    addMinion: (state, action: PayloadAction<Omit<Minion, 'id'>>) => {
      const id = crypto.randomUUID();
      const newMinion: Minion = {
        ...action.payload,
        id,
      };
      minionsAdapter.addOne(state, newMinion);
    },
    removeMinion: (state, action: PayloadAction<string>) => {
      minionsAdapter.removeOne(state, action.payload);
    },
    updateMinion: (state, action: PayloadAction<{ id: string; changes: Partial<Minion> }>) => {
      const { id, changes } = action.payload;
      const existingMinion = minionsAdapter.getSelectors().selectById(state, id);
      
      if (!existingMinion) return;

      const sanitizedChanges: Partial<Minion> = {};

      if (changes.hp) {
        sanitizedChanges.hp = {
          current: Math.max(0, Math.min(9999, changes.hp.current)),
          max: Math.max(1, Math.min(9999, changes.hp.max)),
        };
      }

      if (changes.ac !== undefined) {
        sanitizedChanges.ac = Math.max(0, Math.min(30, changes.ac));
      }

      if (changes.name !== undefined && changes.name !== '') {
        sanitizedChanges.name = changes.name.slice(0, 50);
      }

      minionsAdapter.updateOne(state, { id, changes: sanitizedChanges });
    },
    clearMinions: (state) => {
      minionsAdapter.removeAll(state);
    },
  },
});

export const { addMinion, removeMinion, updateMinion, clearMinions } = minionSlice.actions;
export const minionSelectors = minionsAdapter.getSelectors();
export default minionSlice.reducer;

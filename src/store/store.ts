/**
 * V3.0 Redux Store Configuration
 * Central store with normalized entity slices
 */

import { configureStore } from '@reduxjs/toolkit';
import spellsReducer from './slices/spellsSlice';
import actorReducer from './slices/actorSlice';
import effectsReducer from './slices/effectsSlice';
import concentrationReducer from './slices/concentrationSlice';
import { concentrationMiddleware } from './middleware/concentrationMiddleware';

export const store = configureStore({
  reducer: {
    spells: spellsReducer,
    actor: actorReducer,
    effects: effectsReducer,
    concentration: concentrationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(concentrationMiddleware.middleware),
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
